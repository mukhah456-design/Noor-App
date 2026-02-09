
import { GoogleGenAI, Type } from "@google/genai";
import { SpiritualReflection } from "../types";

export const fetchDailyReflection = async (): Promise<SpiritualReflection> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Generate a daily Islamic spiritual reflection and a short Hadith in Urdu.
  The response must be in JSON format with the following keys:
  - hadith: A short authentic Hadith text in Urdu.
  - reference: The source of the Hadith (e.g., Sahih Bukhari).
  - reflection: A short 1-2 sentence spiritual benefit or reflection in Urdu.
  Focus on themes of prayer, mindfulness, or kindness.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hadith: { type: Type.STRING },
            reference: { type: Type.STRING },
            reflection: { type: Type.STRING },
          },
          required: ["hadith", "reference", "reflection"],
        },
      },
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      hadith: "نماز مومن کی معراج ہے۔",
      reference: "حدیثِ نبوی ﷺ",
      reflection: "نماز اللہ تعالیٰ سے گفتگو کا بہترین ذریعہ ہے، اسے خشوع و خضوع کے ساتھ ادا کریں۔"
    };
  }
};
