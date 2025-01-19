import axios from "axios";

const API_KEY = process.env.OPENAI_API_KEY || "";

export const transcribe = async (mp3Path: string): Promise<string> => {
  const response = await axios.post(
    "https://api.openai.com/v1/audio/transcriptions",
    {file: mp3Path, model: "whisper-1"},
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.transcript;
};

export default {transcribe};
