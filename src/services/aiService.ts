export interface AIAnalysisResult {
  hasIssue: boolean;
  category?: string;
  title?: string;
  description?: string;
  severity?: "low" | "medium" | "high";
}

export const aiService = {
  analyzeImage: async (file: File): Promise<AIAnalysisResult> => {
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
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType: file.type,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json();
      return result as AIAnalysisResult;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to analyze image with AI');
    }
  }
};
