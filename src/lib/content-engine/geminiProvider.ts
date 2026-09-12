import { GoogleGenAI } from "@google/genai";
import type { AIProvider } from "./aiProvider";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured in .env.local");
}

const ai = new GoogleGenAI({
  apiKey,
});

export class GeminiProvider implements AIProvider {
  async generateText(prompt: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });
    console.log("===== GEMINI RESPONSE DIAGNOSTICS =====");
    console.log("response.text:", response.text);
    console.log("candidates:", response.candidates);
    console.log("promptFeedback:", response.promptFeedback);
    console.log("===== END GEMINI RESPONSE DIAGNOSTICS =====");
    //const text = response.text;

    //if (!text) {
    //   throw new Error("Gemini returned an empty response.");
    // }

    // return text;
    // }
    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    console.log("===== GEMINI RAW RESPONSE =====");
    console.log(text);
    console.log("===== END GEMINI RAW RESPONSE =====");

    return text;
  }
}
