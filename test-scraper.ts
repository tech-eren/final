import { GoogleGenAI } from '@google/genai';

async function testScrape() {
    const location = 'Silchar';
    let rawInternetData = "";

    console.log("1. Testing Reddit...");
    try {
        const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(location)} AND (pothole OR traffic OR electricity OR water OR complaint)&sort=new&limit=15`;
        console.log("Fetching:", url);
        const redditResponse = await fetch(url, {
            headers: { 'User-Agent': 'UbiqLoupe-Civic-App/1.0.0 (Node.js)' }
        });
        if (redditResponse.ok) {
            const redditData = await redditResponse.json();
            const results = redditData.data?.children || [];
            console.log(`Reddit returned ${results.length} results.`);
            rawInternetData += results.map((child: any) => {
                return `Source: Reddit\nTitle: ${child.data.title}\nText: ${child.data.selftext.substring(0, 300)}...\n`;
            }).join('\n');
        } else {
            console.log("Reddit failed:", redditResponse.status);
        }
    } catch (e: any) {
        console.log("Reddit Error:", e.message);
    }

    console.log("\n2. Testing NewsAPI...");
    try {
        const newsApiKey = process.env.NEWS_API_KEY || '';
        const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(location)} AND (infrastructure OR traffic OR water OR pothole)&language=en&sortBy=publishedAt&pageSize=5&apiKey=${newsApiKey}`;
        console.log("Fetching:", newsUrl);
        const newsResponse = await fetch(newsUrl);
        if (newsResponse.ok) {
            const newsData = await newsResponse.json();
            const articles = newsData.articles || [];
            console.log(`NewsAPI returned ${articles.length} articles.`);
            if (articles.length > 0) {
                rawInternetData += articles.map((article: any) => {
                    return `Source: News (${article.source.name})\nTitle: ${article.title}\nText: ${article.description?.substring(0, 300) || ''}...\n`;
                }).join('');
            }
        } else {
            console.log("NewsAPI failed:", newsResponse.status);
        }
    } catch (e: any) {
        console.log("NewsAPI Error:", e.message);
    }

    console.log("\n3. Testing Twitter via RapidAPI...");
    try {
        const rapidApiKeys = [
            process.env.RAPIDAPI_TWITTER_KEY,
            process.env.RAPIDAPI_TWITTER_KEY_2,
            process.env.RAPIDAPI_TWITTER_KEY_3
        ].filter(Boolean) as string[];

        const query = encodeURIComponent(`${location} traffic OR ${location} pothole OR ${location} water`);
        const url = `https://x-twitter-api1.p.rapidapi.com/searchtype?query=${query}`;
        
        let twitterSuccess = false;
        
        for (let i = 0; i < rapidApiKeys.length; i++) {
            if (twitterSuccess) break;
            
            const rapidApiKey = rapidApiKeys[i];
            console.log(`Fetching with Key ${i + 1}...`);
            
            const twitterResponse = await fetch(url, {
                headers: {
                    'x-rapidapi-key': rapidApiKey,
                    'x-rapidapi-host': 'x-twitter-api1.p.rapidapi.com'
                }
            });
            
            if (twitterResponse.ok) {
                const twitterData = await twitterResponse.json();
                console.log(`Twitter returned status 200, snippet:`, JSON.stringify(twitterData).substring(0, 100));
                rawInternetData += `Source: X (Twitter)\nRaw JSON Data:\n${JSON.stringify(twitterData).substring(0, 1000)}\n---\n`;
                twitterSuccess = true;
            } else if (twitterResponse.status === 429) {
                console.log(`Key ${i + 1} failed: 429 Too Many Requests. ${i < rapidApiKeys.length - 1 ? 'Trying next key...' : 'No more keys available.'}`);
            } else {
                console.log(`Twitter failed with status:`, twitterResponse.status, await twitterResponse.text());
                break; // Stop trying if it's a non-rate-limit error
            }
        }
    } catch (e: any) {
        console.log("Twitter Error:", e.message);
    }

    console.log("\n--- RAW DATA COLLECTED ---");
    console.log(rawInternetData.length > 0 ? rawInternetData : "(EMPTY)");

    console.log("\n4. Testing Gemini AI API...");
    try {
        const geminiApiKey = process.env.GEMINI_API_KEY || '';
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        console.log("Sending prompt to Gemini...");
        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: 'Say "Gemini API is working perfectly!"',
        });
        console.log("Gemini Response:", response.text);
    } catch (e: any) {
        console.log("Gemini Error:", e.message);
    }
}

testScrape();
