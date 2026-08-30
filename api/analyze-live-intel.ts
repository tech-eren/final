import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const geminiKeys = [
        process.env.GEMINI_API_KEY,
        process.env.GEMINI_API_KEY_2,
        process.env.GEMINI_API_KEY_3
    ].filter(Boolean) as string[];

    if (geminiKeys.length === 0) {
      console.error('Server configuration error: GEMINI_API_KEY is missing');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const location = (req.query.location || (req.body && req.body.location) || 'Silchar') as string;
    const scope = (req.query.scope || (req.body && req.body.scope) || 'local') as string;

    console.log(`[Sweep] Starting scrape for location="${location}", scope="${scope}"`);

    // ============================================================
    // Run ALL scrapers in PARALLEL (don't wait for one to finish)
    // ============================================================
    const scrapeResults = await Promise.allSettled([
      // 1. Reddit
      (async () => {
        const redditResponse = await fetch(
          `https://www.reddit.com/search.json?q=${encodeURIComponent(location)}&sort=new&limit=15`,
          {
            headers: { 'User-Agent': 'UbiqLoupe-Civic-App/1.0.0 (Node.js)' },
            signal: AbortSignal.timeout(4000)
          }
        );
        if (!redditResponse.ok) throw new Error(`Reddit ${redditResponse.status}`);
        const data = await redditResponse.json();
        const posts = data.data.children.map((child: any) =>
          `Source: Reddit\nTitle: ${child.data.title}\nText: ${(child.data.selftext || '').substring(0, 300)}\nURL: https://reddit.com${child.data.permalink}\nDate: ${new Date(child.data.created_utc * 1000).toISOString()}\n---`
        ).join('\n');
        console.log(`[Sweep] Reddit: found ${data.data.children.length} posts`);
        return posts;
      })(),

      // 2. Twitter (X) — try only the first available key, with short timeout
      (async () => {
        const rapidApiKeys = [
          process.env.RAPIDAPI_TWITTER_KEY,
          process.env.RAPIDAPI_TWITTER_KEY_2,
          process.env.RAPIDAPI_TWITTER_KEY_3
        ].filter(Boolean) as string[];

        for (const key of rapidApiKeys) {
          try {
            const resp = await fetch(
              `https://x-twitter-api1.p.rapidapi.com/searchtype?query=${encodeURIComponent(location)}`,
              {
                headers: { 'x-rapidapi-key': key, 'x-rapidapi-host': 'x-twitter-api1.p.rapidapi.com' },
                signal: AbortSignal.timeout(4000)
              }
            );
            if (resp.ok) {
              const data = await resp.json();
              console.log(`[Sweep] Twitter: got data`);
              return `Source: X (Twitter)\nRaw JSON Data:\n${JSON.stringify(data).substring(0, 4000)}\n---`;
            }
            if (resp.status === 429) {
              console.warn(`[Sweep] Twitter key rate-limited, trying next...`);
              continue;
            }
            throw new Error(`Twitter ${resp.status}`);
          } catch (e: any) {
            if (e.message?.includes('429') || e.name === 'AbortError') continue;
            throw e;
          }
        }
        throw new Error('All Twitter keys exhausted');
      })(),

      // 3. NewsAPI — THE KEY SOURCE for regional/national data
      (async () => {
        const newsApiKey = process.env.NEWS_API_KEY;
        if (!newsApiKey) throw new Error('No NewsAPI key');

        // Use different search terms based on scope
        let query = location;
        if (scope === 'global') {
          query = 'India infrastructure OR India civic OR India public OR India government';
        } else if (scope === 'regional') {
          query = `${location} OR ${location} news`;
        }

        const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=15&apiKey=${newsApiKey}`;
        const resp = await fetch(newsUrl, { signal: AbortSignal.timeout(5000) });
        
        if (!resp.ok) {
          const errText = await resp.text();
          console.error(`[Sweep] NewsAPI error ${resp.status}: ${errText}`);
          throw new Error(`NewsAPI ${resp.status}: ${errText}`);
        }

        const data = await resp.json();
        if (!data.articles || data.articles.length === 0) {
          console.log(`[Sweep] NewsAPI: 0 articles found`);
          throw new Error('No articles found');
        }

        const articles = data.articles.map((a: any) =>
          `Source: News (${a.source?.name || 'Unknown'})\nTitle: ${a.title}\nText: ${(a.description || '').substring(0, 400)}\nURL: ${a.url}\nDate: ${a.publishedAt}\n---`
        ).join('\n');
        
        console.log(`[Sweep] NewsAPI: found ${data.articles.length} articles`);
        return articles;
      })(),

      // 4. Google News RSS (backup, free, no key needed)
      (async () => {
        const googleNewsUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(location + ' issue OR problem OR complaint')}&hl=en-IN&gl=IN&ceid=IN:en`;
        const resp = await fetch(googleNewsUrl, { signal: AbortSignal.timeout(4000) });
        if (!resp.ok) throw new Error(`Google News ${resp.status}`);
        const xml = await resp.text();
        
        // Simple XML parsing for RSS items
        const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
        const parsed = items.slice(0, 10).map(item => {
          const title = item.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/, '$1') || '';
          const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';
          const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '';
          return `Source: Google News\nTitle: ${title}\nDate: ${pubDate}\nURL: ${link}\n---`;
        }).join('\n');
        
        console.log(`[Sweep] Google News RSS: found ${items.length} items`);
        return parsed;
      })()
    ]);

    // Combine all successful results
    let rawInternetData = '';
    const sourceNames = ['Reddit', 'Twitter', 'NewsAPI', 'Google News'];
    scrapeResults.forEach((result, idx) => {
      if (result.status === 'fulfilled' && result.value) {
        rawInternetData += result.value + '\n\n';
      } else if (result.status === 'rejected') {
        console.warn(`[Sweep] ${sourceNames[idx]} failed: ${result.reason?.message || result.reason}`);
      }
    });

    console.log(`[Sweep] Total scraped data length: ${rawInternetData.length} chars`);

    if (rawInternetData.trim().length === 0) {
      console.log(`[Sweep] No live data found for ${location}.`);
      return res.status(200).json([]);
    }

    // ============================================================
    // AI Analysis with key rotation
    // ============================================================
    let parsedInsights: any = [];
    let aiSuccess = false;
    let lastAiError: any = null;

    for (let i = 0; i < geminiKeys.length; i++) {
      if (aiSuccess) break;

      try {
        const ai = new GoogleGenAI({ apiKey: geminiKeys[i] });
        console.log(`[Sweep] Trying Gemini key ${i + 1}...`);

        const response = await ai.interactions.create({
          model: 'gemini-3.6-flash',
          input: [
            {
              type: 'text',
              text: `You are a Civic Intelligence AI. Your task is STRICT location-based filtering.

SCOPE: "${scope}"
TARGET LOCATION: "${location}"

CRITICAL RULES:
- For scope "local": ONLY return issues that are DIRECTLY about "${location}" or towns/villages within 50km of it. If a post mentions a completely different city (e.g., Mumbai, Delhi, Meerut, Trichy, Bangalore), you MUST SKIP it entirely.
- For scope "regional": ONLY return issues from the state of "${location}" (e.g., if location is "Assam", only return Assam issues). Skip issues from other states.
- For scope "global": Return national-level issues from across India. Include the actual city and state where each issue occurs.
- If NONE of the scraped data contains relevant civic issues, return an EMPTY array [].
- The "city", "state", and "country" fields MUST accurately reflect where the issue is actually happening.
- "state" field is REQUIRED for all results. "country" must always be "India".
- Do NOT invent or hallucinate issues. Only report what is clearly in the data.
- DEDUPLICATION: Do NOT return multiple issues that describe the exact same real-world incident or event. If multiple sources talk about the same protest, pothole, or incident, COMBINE them into a SINGLE issue.

Analyze this scraped data and extract 1-4 civic issues (infrastructure, safety, environment, public services, civic problems):

${rawInternetData}
`,
            }
          ],
          response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', description: 'Unique ID starting with ins_' },
                  type: { type: 'string', enum: ['anomaly', 'cluster', 'prediction'] },
                  title: { type: 'string' },
                  description: { type: 'string', description: 'Detailed summary of the civic issue' },
                  severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                  actionSuggested: { type: 'string', description: 'Recommended action' },
                  timestamp: { type: 'string', description: 'ISO 8601 timestamp' },
                  scope: { type: 'string', enum: ['local', 'regional', 'global'], description: `Must be: ${scope}` },
                  city: { type: 'string', description: 'City where the issue is occurring' },
                  district: { type: 'string', description: 'District name' },
                  state: { type: 'string', description: 'State name (REQUIRED)' },
                  country: { type: 'string', description: 'Must be India' },
                  latitude: { type: 'number', description: 'Estimated latitude' },
                  longitude: { type: 'number', description: 'Estimated longitude' }
                },
                required: ['id', 'type', 'title', 'description', 'severity', 'actionSuggested', 'timestamp', 'scope', 'state', 'country']
              }
            },
          },
        });

        if (response.output_text) {
          let cleanText = response.output_text;
          if (cleanText.startsWith('```json')) cleanText = cleanText.substring(7);
          if (cleanText.startsWith('```')) cleanText = cleanText.substring(3);
          if (cleanText.endsWith('```')) cleanText = cleanText.substring(0, cleanText.length - 3);
          cleanText = cleanText.trim();

          parsedInsights = JSON.parse(cleanText);
          aiSuccess = true;
          console.log(`[Sweep] Gemini key ${i + 1} succeeded. ${parsedInsights.length} insights generated.`);
        }
      } catch (error: any) {
        console.warn(`[Sweep] Gemini key ${i + 1} failed: ${error.message}`);
        lastAiError = error;
      }
    }

    if (!aiSuccess) {
      console.error('[Sweep] All Gemini keys failed.', lastAiError);
      return res.status(502).json({ error: 'Failed to analyze live data', details: lastAiError?.message });
    }

    return res.status(200).json(parsedInsights);
  } catch (error: any) {
    console.error('Fatal API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
