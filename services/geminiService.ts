import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateMovieMetadata = async (title: string, language: string) => {
  if (!apiKey) {
    console.warn("No API Key available for Gemini.");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a JSON object for a movie titled "${title}". 
      Include a short description (max 50 words) in ${language}, 
      a predicted rating (number 0-10), year of release (number), 
      director, and a list of 3 main cast members.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            rating: { type: Type.NUMBER },
            year: { type: Type.NUMBER },
            director: { type: Type.STRING },
            cast: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["description", "rating", "year", "director", "cast"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;

  } catch (error) {
    console.error("Error generating metadata:", error);
    return null;
  }
};

export const getNearbyCinemas = async (lat: number, lng: number) => {
  if (!apiKey) {
    console.warn("No API Key available for Gemini.");
    return null;
  }

  try {
    // Using gemini-2.5-flash with googleMaps tool as requested
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Find 5 popular movie theaters or cinemas near me. Provide a brief summary of why they are popular.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      }
    });

    return {
      text: response.text,
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };

  } catch (error) {
    console.error("Error fetching cinemas:", error);
    return null;
  }
};