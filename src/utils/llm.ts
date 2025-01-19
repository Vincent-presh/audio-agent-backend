import axios from "axios";

const API_KEY = process.env.OPENAI_API_KEY || "";

export const generateDescription = async (
  transcript: string
): Promise<string> => {
  const response = await axios.post(
    "https://api.openai.com/v1/completions",
    {
      model: "gpt-4",
      prompt: `Summarize the following podcast transcription into a description:\n${transcript}`,
      max_tokens: 200,
    },
    {headers: {Authorization: `Bearer ${API_KEY}`}}
  );
  return response.data.choices[0].text.trim();
};

export const divideIntoChapters = async (
  transcript: string
): Promise<string[]> => {
  const response = await axios.post(
    "https://api.openai.com/v1/completions",
    {
      model: "gpt-4",
      prompt: `Divide the following transcription into chapters:\n${transcript}`,
      max_tokens: 500,
    },
    {headers: {Authorization: `Bearer ${API_KEY}`}}
  );
  return response.data.choices[0].text.trim().split("\n");
};

export default {generateDescription, divideIntoChapters};
