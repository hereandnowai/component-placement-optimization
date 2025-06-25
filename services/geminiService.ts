
import { GoogleGenAI, GenerateContentResponse, GenerateContentParameters } from "@google/genai";
import { GEMINI_MODEL_TEXT } from '../constants';

// For App environments, API_KEY should be handled by a backend proxy or secure environment configuration.
// Directly embedding API keys in frontend code is insecure for production apps.
// process.env.API_KEY is a placeholder for how it might be accessed in a Node.js-like build environment,
// but for a pure frontend app, this needs careful consideration.
const API_KEY = process.env.API_KEY;


if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set. Gemini features will be limited or non-functional.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); // The '!' asserts API_KEY is non-null after the check

const getBaseSystemInstruction = (languageName: string = 'English') => {
  return `You are Caramel, an expert AI assistant for PCB (Printed Circuit Board) layout optimization. Your goal is to help users design efficient and reliable PCBs for agricultural electronic devices. Provide concise, actionable advice and data. For layout suggestions, provide coordinates as JSON. PCB dimensions are 500x350 units. Ensure all suggested coordinates (x, y) for components are within these boundaries: x between 0 and (500 - componentWidth), y between 0 and (350 - componentHeight). Please provide your response in ${languageName}. If you are providing advice or explanations, use ${languageName}. If you are providing JSON data, the keys and string values within the JSON should also be in ${languageName} if it makes sense for the content (e.g., advice text within JSON), otherwise, standard technical terms or IDs can remain in English.`;
};


const generateText = async (prompt: string, language: string = 'en'): Promise<GenerateContentResponse> => {
  if (!API_KEY) {
    return {
      text: "Gemini API key not configured. Cannot process text request.",
      candidates: [],
    } as unknown as GenerateContentResponse;
  }
  const languageName = language === 'fr' ? 'French' : language === 'de' ? 'German' : language === 'es' ? 'Spanish' : 'English';
  try {
    const params: GenerateContentParameters = {
      model: GEMINI_MODEL_TEXT,
      contents: prompt, // Prompt might also need to specify language for user input context
      config: {
        systemInstruction: getBaseSystemInstruction(languageName),
        temperature: 0.5,
        topP: 0.9,
        topK: 40,
      }
    };
    const response: GenerateContentResponse = await ai.models.generateContent(params);
    return response;
  } catch (error) {
    console.error('Error calling Gemini API (generateText):', error);
    return {
      text: `Error communicating with AI for text: ${error instanceof Error ? error.message : 'Unknown error'}.`,
      candidates: [],
    } as unknown as GenerateContentResponse;
  }
};

const generateStructuredResponse = async (prompt: string, language: string = 'en'): Promise<any> => {
  if (!API_KEY) {
    return { error: "Gemini API key not configured. Cannot process structured request." };
  }
  const languageName = language === 'fr' ? 'French' : language === 'de' ? 'German' : language === 'es' ? 'Spanish' : 'English';
  try {
    const params: GenerateContentParameters = {
      model: GEMINI_MODEL_TEXT,
      contents: prompt, // Prompt might also need to specify language for user input context
      config: {
        systemInstruction: getBaseSystemInstruction(languageName),
        responseMimeType: "application/json",
        temperature: 0.3,
        topP: 0.8,
        topK: 30,
      }
    };
    const response: GenerateContentResponse = await ai.models.generateContent(params);
    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    try {
      const parsedData = JSON.parse(jsonStr);
      return parsedData;
    } catch (e) {
      console.error("Failed to parse JSON response:", e, "Raw response:", response.text);
      // Attempt to return AI's textual advice if JSON parsing fails but text exists.
      const adviceFromText = response.text.includes("advice") ? response.text : "AI returned an invalid JSON structure.";
      return { error: "AI returned an invalid JSON structure or non-JSON advice.", details: (e as Error).message, rawText: response.text, advice: adviceFromText };
    }
  } catch (error) {
    console.error('Error calling Gemini API (generateStructuredResponse):', error);
    return { error: `Error communicating with AI for structured data: ${error instanceof Error ? error.message : 'Unknown error'}.` };
  }
};

export const geminiService = {
  generateText,
  generateStructuredResponse,
};
