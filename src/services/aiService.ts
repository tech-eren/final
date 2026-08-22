import { GoogleGenAI, Type } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
// Initialize the SDK. 
// Note: Exposing the API key in the frontend is strictly for the hackathon prototype.
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

export interface AIAnalysisResult {
  hasIssue: boolean;
  category?: string;
  title?: string;
  description?: string;
}

export const aiService = {
  analyzeImage: async (file: File): Promise<AIAnalysisResult> => {
    if (!apiKey || apiKey === 'your_api_key_here') {
      throw new Error('Please add your Gemini API key to the .env file');
    }

    // Convert File to Base64
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: 'Analyze this image. Determine if it contains a civic infrastructure issue (like a pothole, road damage, broken streetlight, garbage accumulation, water leakage, drainage blockage, flooding, fallen tree, traffic signal malfunction, or illegal dumping). If it does NOT contain any of these (e.g., it is a random picture, a selfie, a cat, a clean road), return hasIssue false. If it DOES contain an issue, return hasIssue true, and provide a short title, description, and the category.',
              },
              {
                inlineData: {
                  mimeType: file.type,
                  data: base64Data,
                },
              },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hasIssue: { type: Type.BOOLEAN },
              category: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ['hasIssue'],
          },
        },
      });

      if (response.text) {
        return JSON.parse(response.text) as AIAnalysisResult;
      }
      return { hasIssue: false };
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to analyze image with AI');
    }
  }
};
