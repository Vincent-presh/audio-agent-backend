import gemini from "../utils/gemini";

/**
 * Generate a description from a transcript using Gemini
 * @param transcript The podcast transcript
 * @returns A generated description
 */
export const generateDescription = async (
  transcript: string
): Promise<string> => {
  const prompt = `Summarize the following podcast transcription into a description:\n${transcript}`;
  return await gemini.generateContent(prompt);
};

/**
 * Divide the transcript into chapters using Gemini
 * @param transcript The podcast transcript
 * @returns A list of chapters
 */
export const divideIntoChapters = async (
  transcript: string
): Promise<string[]> => {
  const prompt = `Divide the following podcast transcript into chapters with titles:\n${transcript}`;
  const content = await gemini.generateContent(prompt);
  return content.split("\n").filter((line) => line.trim().length > 0);
};

export default {generateDescription, divideIntoChapters};
