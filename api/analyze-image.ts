import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { imageBase64, mimeType } = req.body || {};

    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ error: 'Missing imageBase64 or mimeType' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Server configuration error: GEMINI_API_KEY is missing');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.interactions.create({
      model: 'gemini-3.6-flash',
      input: [
        {
          type: 'text',
          text: 'Analyze this image. Determine if it contains a civic infrastructure issue (like a pothole, road damage, broken streetlight, garbage accumulation, water leakage, drainage blockage, flooding, fallen tree, traffic signal malfunction, or illegal dumping). If it does NOT contain any of these (e.g., it is a random picture, a selfie, a cat, a clean road), return hasIssue false. If it DOES contain an issue, return hasIssue true, and provide a short title, description, category, and severity ("low", "medium", or "high"). Use "low" for minor issues with limited immediate impact, "medium" for clearly noticeable civic issues affecting usability/accessibility, and "high" for potentially dangerous, severe, widespread, or urgent issues. Do not invent facts that cannot be determined from the image.',
        },
        {
          type: 'image',
          mime_type: mimeType,
          data: imageBase64,
        },
      ],
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        schema: {
          type: 'object',
          properties: {
            hasIssue: { type: 'boolean' },
            category: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            severity: {
              type: 'string',
              enum: ['low', 'medium', 'high']
            },
          },
          required: ['hasIssue'],
        },
      },
    });

    if (response.output_text) {
      const parsed = JSON.parse(response.output_text);
      if (parsed.hasIssue && (!parsed.severity || !['low', 'medium', 'high'].includes(parsed.severity))) {
        parsed.severity = 'medium';
      }
      return res.status(200).json(parsed);
    }
    
    return res.status(200).json({ hasIssue: false });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(502).json({ error: 'Failed to analyze image with AI' });
  }
}
