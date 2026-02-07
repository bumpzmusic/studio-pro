import { GoogleGenAI } from "@google/genai";
import { GeneratedImage, AspectRatio } from "../types";

const GEMINI_MODEL = "gemini-2.5-flash-image";

export const generateStyledImage = async (
  base64Image: string,
  mimeType: string,
  stylePrompt: string,
  additionalNotes: string,
  aspectRatio: AspectRatio = "1:1"
): Promise<GeneratedImage> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is available.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Construct a robust prompt for the model
  const fullPrompt = `
    Act as a world-class professional product photographer and photo editor.
    I am providing an image of a product.
    
    Your task:
    1. Analyze the product in the image.
    2. Generate a new version of this image that looks like a high-end professional studio photograph.
    3. Maintain the visual identity of the main product exactly as it is (do not hallucinate a different product).
    4. Apply the following style strictly: "${stylePrompt}".
    ${additionalNotes ? `5. Additional requirements: ${additionalNotes}` : ""}
    
    Ensure the lighting, shadows, and background are consistent with top-tier e-commerce photography.
    Return only the image.
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: fullPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio
        }
      }
    });

    // Extract the image from the response
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned from Gemini API.");
    }

    const parts = candidates[0].content.parts;
    let foundImage: GeneratedImage | null = null;

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        foundImage = {
          data: part.inlineData.data,
          mimeType: part.inlineData.mimeType || "image/png",
        };
        break; 
      }
    }

    if (!foundImage) {
      throw new Error("The model did not return an image. It might have refused the prompt or returned text only.");
    }

    return foundImage;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};