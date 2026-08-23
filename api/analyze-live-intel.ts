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

    // 1. Scrape Live Data (Reddit JSON API is free and doesn't require auth)
    // We target a specific city subreddit for civic issues
    // Important: Reddit API requires a custom User-Agent header
    const redditResponse = await fetch('https://www.reddit.com/r/mumbai/search.json?q=pothole OR traffic OR electricity OR water OR complaint&restrict_sr=1&sort=new&limit=15', {
        headers: {
            'User-Agent': 'UbiqLoupe-Civic-App/1.0.0 (Node.js)'
        }
    });
    
    let rawInternetData = "";

    if (!redditResponse.ok) {
        console.warn(`Reddit API failed: ${redditResponse.statusText}. Using fallback data for demo.`);
        // Fallback data in case Reddit blocks the scraper (very common for hackathons)
        rawInternetData = `
Source: Reddit (r/mumbai)
Title: Huge pothole on Andheri Kurla Road
Text: Bro I just popped my front left tire on this massive crater near the metro station. Avoid at all costs.
Date: 2026-08-23T10:00:00Z
---
Source: Twitter (@mumbaitraffic)
Title: Traffic signal dead at JVLR junction
Text: The signals are completely off at JVLR intersection. Total chaos. Need traffic police ASAP!
Date: 2026-08-23T11:15:00Z
---
Source: Local News (Mumbai Mirror)
Title: Water pipe bursts in Bandra West
Text: Residents report low water pressure and severe flooding on Hill Road after a main water line ruptured this morning.
Date: 2026-08-23T09:30:00Z
        `;
    } else {
        const redditData = await redditResponse.json();
        rawInternetData = redditData.data.children.map((child: any) => {
            return `Source: Reddit (r/mumbai)\nTitle: ${child.data.title}\nText: ${child.data.selftext.substring(0, 300)}...\nURL: https://reddit.com${child.data.permalink}\nDate: ${new Date(child.data.created_utc * 1000).toISOString()}\n---\n`;
        }).join('\n');
    }

    // 2. AI Analysis
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.interactions.create({
      model: 'gemini-3.6-flash',
      input: [
        {
          type: 'text',
          text: `You are a Civic Intelligence AI. Analyze the following raw data scraped from the internet (social media, news, etc.).
          Identify potential civic issues, infrastructure problems, or emergencies. 
          Group related posts into single "Insights".
          Generate exactly 2 to 4 high-quality CivicInsight objects based on the data.
          If the data is completely irrelevant, generate some plausible mock insights based on typical city issues.
          
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
                timestamp: { type: 'string', description: 'ISO 8601 timestamp string of when this was detected' }
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
