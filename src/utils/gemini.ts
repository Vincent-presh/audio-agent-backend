import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/**
 * Generate content using the Gemini API
 * @param prompt The input text prompt for generating content
 * @returns The generated content
 */
export const generateContent = async (prompt: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "Gemini API key is missing. Set GEMINI_API_KEY in the environment variables."
    );
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{text: prompt}],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    // Extract the content from the response
    if (data?.contents && data.contents.length > 0) {
      const parts = data.contents[0]?.parts;
      return parts.map((part: {text: string}) => part.text).join("");
    }

    throw new Error("Unexpected response format from Gemini API.");
  } catch (error) {
    console.error("Error communicating with Gemini API:", error.message);
    throw new Error("Failed to generate content from Gemini API.");
  }
};

export default {generateContent};
