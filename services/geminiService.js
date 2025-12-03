import { GoogleGenAI, Type } from "@google/genai";
import { Status } from "../constants";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const analyzeTranscript = async (transcript) => {
  if (!ai) {
    console.warn("Gemini API Key is missing. Returning mock data.");
    return {
      suggestedStatus: Status.PENDING,
      extractedDate: null,
      extractedAmount: null,
      reasoning: "API Key missing. Please check configuration."
    };
  }

  try {
    const prompt = `
      You are a debt collection assistant analyzing a call transcript or note.
      Transcript: "${transcript}"
      
      Classify the status based strictly on these rules from the user's ledger:
      1. "FAKE_COMMITMENT" (Red): If the debtor is making excuses that seem untrue, refuses to pay despite promises, or the commitment feels fake.
      2. "DISHONORED" (Pink): If a specific date was promised previously and missed, or a check bounced.
      3. "PARTIAL_PAYMENT" (Blue): If they paid a portion of the debt or are promising a partial amount ("patch-up").
      4. "NO_DUES" (Green): If the debt is fully cleared.
      5. "PENDING": General conversation, valid future promise with no negative signs yet, or insufficient info.

      Also extract:
      - Next promised date (YYYY-MM-DD).
      - Specific amount mentioned (number).
      - Brief reasoning (max 10 words).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedStatus: { type: Type.STRING, enum: Object.values(Status) },
            extractedDate: { type: Type.STRING, nullable: true },
            extractedAmount: { type: Type.NUMBER, nullable: true },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      suggestedStatus: Status.PENDING,
      extractedDate: null,
      extractedAmount: null,
      reasoning: "Failed to analyze transcript."
    };
  }
};