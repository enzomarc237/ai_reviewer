
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { CODE_REVIEW_PROMPT_TEMPLATE } from '../constants';

// IMPORTANT: API_KEY is expected to be set in the environment (process.env.API_KEY)
// The problem statement assumes process.env.API_KEY is pre-configured and accessible.
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    // ai remains null, reviewCode will throw an error
  }
} else {
  console.warn("Gemini API Key (API_KEY) is not configured in process.env. Code review functionality will be disabled.");
}

export const reviewCode = async (code: string, language: string): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini API client is not initialized. This is likely due to a missing or invalid API_KEY.");
  }

  const model = ai.models; 
  const prompt = CODE_REVIEW_PROMPT_TEMPLATE(language, code);

  try {
    const response: GenerateContentResponse = await model.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    // Directly return the text, assuming it's Markdown or plain text as requested in the prompt.
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        // More specific error messages can be helpful
        if (error.message.includes("API key not valid") || error.message.includes("API_KEY_INVALID")) {
             throw new Error("Invalid Gemini API Key. Please check your API_KEY environment variable.");
        }
         if (error.message.includes("Quota exceeded")) {
            throw new Error("Gemini API quota exceeded. Please check your quota or try again later.");
        }
        throw new Error(`Failed to get review from Gemini: ${error.message}`);
    }
    // Fallback for non-Error objects
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};
