import { GoogleGenAI } from '@google/genai';

/**
 * Resolves GPS coordinates to a human-readable city/district name
 * using the free OpenStreetMap Nominatim API (no API key required).
 */
interface GeoLocation {
  city: string;
  district: string;
  state: string;
  country: string;
}

async function reverseGeocode(lat: number, lng: number): Promise<GeoLocation> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'en', 'User-Agent': 'CivicResolveApp/1.0' },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error('Nominatim failed');
    const data = await res.json();
    const addr = data.address || {};
    return {
      city: addr.city || addr.town || addr.municipality || '',
      district: addr.county || addr.state_district || '',
      state: addr.state || 'Assam',
      country: addr.country || 'India'
    };
  } catch {
    console.warn('Reverse geocoding failed, falling back to Silchar');
    return { city: 'Silchar', district: 'Cachar', state: 'Assam', country: 'India' };
  }
}

export const liveIntelService = {
  /**
   * Scrapes live internet data and uses AI to extract civic insights.
   * @param userLat  Browser GPS latitude  (optional, falls back to Silchar)
   * @param userLng  Browser GPS longitude (optional, falls back to Silchar)
   * @returns Parsed array of CivicInsight objects
   */
  analyzeLiveIntel: async (userLat?: number, userLng?: number, scope: 'local' | 'state' | 'national' = 'local'): Promise<any[]> => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Server configuration error: VITE_GEMINI_API_KEY is missing');
      }

      // --- Resolve location name from GPS ---
      const lat = userLat ?? 24.8333;
      const lng = userLng ?? 92.7789;
      const geo = await reverseGeocode(lat, lng);
      
      let locationQuery = '';
      if (scope === 'local') {
        locationQuery = geo.city || geo.district || geo.state;
      } else if (scope === 'state') {
        locationQuery = geo.state;
      } else {
        locationQuery = geo.country;
      }
      
      console.log(`[LiveIntel] Scanning for scope "${scope}", query: "${locationQuery}" (${lat.toFixed(4)}, ${lng.toFixed(4)})`);

      let rawInternetData = '';

      // 1. Scrape Reddit (global search, no subreddit restriction — smaller cities rarely have one)
      try {
        const query = encodeURIComponent(`${locationQuery} (pothole OR traffic OR electricity OR water OR flood OR road OR sewage)`);
        const redditResponse = await fetch(
          `https://www.reddit.com/search.json?q=${query}&sort=new&limit=15`,
          { signal: AbortSignal.timeout(5000) }
        );
        if (redditResponse.ok) {
          const redditData = await redditResponse.json();
          if (redditData.data?.children?.length > 0) {
            rawInternetData += redditData.data.children.map((child: any) =>
              `Source: Reddit\nTitle: ${child.data.title}\nText: ${child.data.selftext.substring(0, 300)}...\nURL: https://reddit.com${child.data.permalink}\nDate: ${new Date(child.data.created_utc * 1000).toISOString()}\n---\n`
            ).join('\n');
          }
        }
      } catch (err) {
        console.warn(`Reddit scrape failed: ${err}`);
      }

      // 2. Scrape Twitter (X) via RapidAPI
      try {
        const rapidApiKey = import.meta.env.VITE_RAPIDAPI_TWITTER_KEY;
        if (rapidApiKey) {
          const query = encodeURIComponent(`${locationQuery} traffic OR ${locationQuery} pothole OR ${locationQuery} water OR ${locationQuery} flood`);
          const twitterResponse = await fetch(
            `https://x-twitter-api1.p.rapidapi.com/searchtype?query=${query}`,
            {
              headers: {
                'x-rapidapi-key': rapidApiKey,
                'x-rapidapi-host': 'x-twitter-api1.p.rapidapi.com',
              },
              signal: AbortSignal.timeout(8000),
            }
          );
          if (twitterResponse.ok) {
            const twitterData = await twitterResponse.json();
            rawInternetData += `Source: X (Twitter)\nRaw JSON Data:\n${JSON.stringify(twitterData).substring(0, 4000)}\n---\n`;
          } else {
            console.warn(`Twitter API returned status ${twitterResponse.status}`);
          }
        }
      } catch (err) {
        console.warn(`Twitter scrape failed: ${err}`);
      }

      // 3. Scrape local news via NewsAPI
      try {
        const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
        if (newsApiKey) {
          const query = encodeURIComponent(`${locationQuery} AND (infrastructure OR traffic OR water OR pothole OR flood OR power)`);
          const newsUrl = `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${newsApiKey}`;
          const newsResponse = await fetch(newsUrl, { signal: AbortSignal.timeout(5000) });
          if (newsResponse.ok) {
            const newsData = await newsResponse.json();
            if (newsData.articles?.length > 0) {
              rawInternetData += newsData.articles.map((article: any) =>
                `Source: News (${article.source.name})\nTitle: ${article.title}\nText: ${article.description?.substring(0, 300) || ''}...\nURL: ${article.url}\nDate: ${article.publishedAt}\n---\n`
              ).join('');
            }
          } else {
            console.warn(`NewsAPI returned status ${newsResponse.status}`);
          }
        }
      } catch (err) {
        console.warn(`NewsAPI scrape failed: ${err}`);
      }

      // 4. Fallback if all scrapers fail
      if (rawInternetData.trim().length === 0) {
        console.warn('All live scrapes failed or returned empty. Using location-specific fallback data.');
        rawInternetData = `
Source: Reddit (r/civic)
Title: Huge pothole near the main market in ${locationQuery}
Text: The road near the central market has a dangerous pothole. Multiple bikes have crashed there this week. Someone needs to fix this urgently.
Date: ${new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()}
---
Source: Twitter (@localcivic)
Title: Traffic signal down at main junction in ${locationQuery}
Text: The traffic signals at the main intersection have been non-functional for 2 days. Police need to be deployed immediately.
Date: ${new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()}
---
Source: Local News (Local Chronicle)
Title: Water supply disrupted in ${locationQuery}
Text: Residents in several neighborhoods report no water supply since yesterday due to a suspected main pipe rupture. Authority response awaited.
Date: ${new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()}
        `;
      }

      // 5. AI Analysis
      const ai = new GoogleGenAI({ apiKey });

      let aiRules = '';
      if (scope === 'local') {
        aiRules = `
            - Only generate insights about civic issues IN OR VERY NEAR "${locationQuery}".
            - Completely IGNORE any content about other cities, states, or countries.
            - If a scraped article is from another city, discard it entirely.
        `;
      } else if (scope === 'state') {
        aiRules = `
            - Only generate insights about civic issues WITHIN the state of "${locationQuery}".
            - Completely IGNORE any content about other states or countries.
            - Extract exact city/district names for each issue.
        `;
      } else {
        aiRules = `
            - Extract significant, high-profile civic issues from ANYWHERE in "${locationQuery}".
            - Focus on trending or major infrastructure problems.
            - Extract exact city, district, and state names for each issue.
        `;
      }

      const universalFallbackRule = `- If after filtering there is not enough relevant data, generate 2-3 realistic, plausible civic issues that could commonly affect "${locationQuery}".`;

      const response = await ai.interactions.create({
        model: 'gemini-3.6-flash',
        input: [
          {
            type: 'text',
            text: `You are a Civic Intelligence AI analyzing data for ${scope} scope (target: "${locationQuery}").
            Analyze the following raw data scraped from the internet (social media, news, etc.).
            
            STRICT RULES:
            - ONLY extract actual civic PROBLEMS, HAZARDS, or COMPLAINTS (e.g., potholes, power cuts, flooding, broken infrastructure).
            - IGNORE ALL positive news, announcements, project inaugurations, business expansions, or general articles. If a piece of data is not a problem that needs fixing, DISCARD IT.
            ${aiRules}
            ${universalFallbackRule}
            - For EVERY issue, extract its exact structured location (city, district, state, country, lat, lng).
            
            EXAMPLE OUTPUT FORMAT:
            "city": "Silchar", "district": "Cachar", "state": "Assam", "country": "India"
            (Provide ONLY the exact place name. If unknown, use null.)
            
            Generate exactly 2 to 4 CivicInsight objects.
            
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
                description: { type: 'string', description: 'Detailed summary of the issue, mentioning the specific location' },
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
              required: ['id', 'type', 'title', 'description', 'severity', 'actionSuggested', 'timestamp'],
            },
          },
        },
      });

      if (response.output_text) {
        let cleanText = response.output_text;
        if (cleanText.startsWith('```json')) cleanText = cleanText.substring(7);
        if (cleanText.startsWith('```')) cleanText = cleanText.substring(3);
        if (cleanText.endsWith('```')) cleanText = cleanText.substring(0, cleanText.length - 3);
        const parsed = JSON.parse(cleanText.trim());
        // Tag all extracted insights with the scope they were found under and sanitize fields
        return parsed.map((item: any) => {
          // Fallback: If AI hallucinates a giant string into a location field, wipe it out
          const safeString = (val: any) => typeof val === 'string' && val.length > 30 ? null : val;
          return { 
            ...item, 
            city: safeString(item.city),
            district: safeString(item.district),
            state: safeString(item.state),
            country: safeString(item.country),
            scope 
          };
        });
      }
      return [];
    } catch (error: any) {
      console.error('Live Scrape Error:', error);
      throw error;
    }
  },
};
