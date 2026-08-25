import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Server configuration error: GEMINI_API_KEY is missing');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // 1. Scrape Reddit
    let rawInternetData = "";
    
    try {
        const location = req.query.location || (req.body && req.body.location) || 'Silchar';
        // Using a general Reddit search for the location instead of a specific subreddit since smaller cities might not have active subreddits
        const redditResponse = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(location)} AND (pothole OR traffic OR electricity OR water OR complaint)&sort=new&limit=15`, {
            headers: {
                'User-Agent': 'UbiqLoupe-Civic-App/1.0.0 (Node.js)'
            },
            signal: AbortSignal.timeout(5000)
        });
        
        if (redditResponse.ok) {
            const redditData = await redditResponse.json();
            rawInternetData += redditData.data.children.map((child: any) => {
                return `Source: Reddit\nTitle: ${child.data.title}\nText: ${child.data.selftext.substring(0, 300)}...\nURL: https://reddit.com${child.data.permalink}\nDate: ${new Date(child.data.created_utc * 1000).toISOString()}\n---\n`;
            }).join('\n');
        }
    } catch (fetchError) {
        console.warn(`Reddit scrape failed: ${fetchError}`);
    }

    // 2. Scrape Twitter (X) via RapidAPI
    try {
        const rapidApiKey = process.env.RAPIDAPI_TWITTER_KEY;
        if (rapidApiKey) {
            const location = req.query.location || (req.body && req.body.location) || 'Silchar';
            const query = encodeURIComponent(`${location} traffic OR ${location} pothole OR ${location} water`);
            const twitterResponse = await fetch(`https://x-twitter-api1.p.rapidapi.com/searchtype?query=${query}`, {
                headers: {
                    'x-rapidapi-key': rapidApiKey,
                    'x-rapidapi-host': 'x-twitter-api1.p.rapidapi.com'
                },
                signal: AbortSignal.timeout(8000)
            });
            
            if (twitterResponse.ok) {
                const twitterData = await twitterResponse.json();
                // Pass raw stringified JSON directly since Gemini is good at parsing raw dumps.
                // Substring it to avoid huge token usage if the response is massive.
                rawInternetData += `Source: X (Twitter)\nRaw JSON Data:\n${JSON.stringify(twitterData).substring(0, 4000)}\n---\n`;
            } else {
                console.warn(`Twitter API returned status ${twitterResponse.status}`);
            }
        }
    } catch (err) {
        console.warn(`Twitter scrape failed: ${err}`);
    }

    // 3. Scrape Local News via NewsAPI
    try {
        const newsApiKey = process.env.NEWS_API_KEY;
        if (newsApiKey) {
            const location = req.query.location || (req.body && req.body.location) || 'Silchar';
            const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(location)} AND (infrastructure OR traffic OR water OR pothole)&language=en&sortBy=publishedAt&pageSize=5&apiKey=${newsApiKey}`;
            const newsResponse = await fetch(newsUrl, { signal: AbortSignal.timeout(5000) });
            
            if (newsResponse.ok) {
                const newsData = await newsResponse.json();
                if (newsData.articles && newsData.articles.length > 0) {
                    rawInternetData += newsData.articles.map((article: any) => {
                        return `Source: News (${article.source.name})\nTitle: ${article.title}\nText: ${article.description?.substring(0, 300) || ''}...\nURL: ${article.url}\nDate: ${article.publishedAt}\n---\n`;
                    }).join('');
                }
            } else {
                console.warn(`NewsAPI returned status ${newsResponse.status}`);
            }
        }
    } catch (err) {
        console.warn(`NewsAPI scrape failed: ${err}`);
    }

    // 4. If no data was found, just return empty early
    if (rawInternetData.trim().length === 0) {
        console.log(`No live data found for ${location}.`);
        return res.status(200).json([]);
    }

    // 5. AI Analysis
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.interactions.create({
      model: 'gemini-3.6-flash',
      input: [
        {
          type: 'text',
          text: `You are a Civic Intelligence AI for the city of ${location}. Analyze the following raw data scraped from the internet (social media, news, etc.).
          Identify potential civic issues, infrastructure problems, or emergencies SPECIFICALLY for ${location} or surrounding areas. 
          Ignore any news or posts about other cities.
          Group related posts into single "Insights".
          Generate exactly 1 to 4 high-quality CivicInsight objects based ONLY on the provided data.
          If there are no civic issues in the data, return an empty array. Do not invent or mock data.
          
          Raw Internet Data:
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
                id: { type: 'string', description: 'Unique string ID starting with ins_' },
                type: { type: 'string', enum: ['anomaly', 'cluster', 'prediction'] },
                title: { type: 'string' },
                description: { type: 'string', description: 'Detailed summary of the issue found in the scraped data' },
                severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                actionSuggested: { type: 'string', description: 'Recommended action for the authority' },
                timestamp: { type: 'string', description: 'ISO 8601 timestamp string of when this was detected' },
                city: { type: 'string', description: 'City name where the issue is occurring, if identifiable' },
                district: { type: 'string', description: 'District name, if identifiable' },
                state: { type: 'string', description: 'State name, if identifiable' },
                country: { type: 'string', description: 'Country name, if identifiable' },
                latitude: { type: 'number', description: 'Estimated latitude of the issue, if identifiable' },
                longitude: { type: 'number', description: 'Estimated longitude of the issue, if identifiable' }
            },
            required: ['id', 'type', 'title', 'description', 'severity', 'actionSuggested', 'timestamp']
          }
        },
      },
    });

    if (response.output_text) {
      // Strip out any markdown formatting that Gemini might wrap the JSON in
      let cleanText = response.output_text;
      if (cleanText.startsWith('```json')) {
          cleanText = cleanText.substring(7);
      }
      if (cleanText.startsWith('```')) {
          cleanText = cleanText.substring(3);
      }
      if (cleanText.endsWith('```')) {
          cleanText = cleanText.substring(0, cleanText.length - 3);
      }
      cleanText = cleanText.trim();

      const parsedInsights = JSON.parse(cleanText);
      return res.status(200).json(parsedInsights);
    }
    
    return res.status(200).json([]);
  } catch (error: any) {
    console.error('Live Scrape Error:', error);
    return res.status(502).json({ error: 'Failed to scrape and analyze live data', details: error.message });
  }
}
