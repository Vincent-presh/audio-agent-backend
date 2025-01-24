import * as progressUtils from "../utils/progress";
import whisper from "../utils/whisper";
import fs from "fs";
import path from "path";
import axios from "axios";
import llmService from "./llmService";
import ytdl from "@distube/ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

// Set FFmpeg path explicitly
ffmpeg.setFfmpegPath(ffmpegPath!);

export const processVideo = async (
  taskId: string,
  videoUrl: string,
  socketId: string
): Promise<{
  description?: string;
  chapters?: string[];
  transcript?: string;
}> => {
  let description = "";
  let chapters: string[] = [];
  let transcript = "";

  try {
    await progressUtils.updateTaskProgress(
      taskId,
      "in-progress",
      10,
      "Downloading video..."
    );
    const mp3Path = await convertToMp3(videoUrl);

    await progressUtils.updateTaskProgress(
      taskId,
      "in-progress",
      40,
      "Transcribing audio..."
    );
    transcript = await whisper.transcribe(mp3Path);

    await progressUtils.updateTaskProgress(
      taskId,
      "in-progress",
      60,
      "Generating description..."
    );
    description = await llmService.generateDescription(transcript);

    await progressUtils.updateTaskProgress(
      taskId,
      "in-progress",
      80,
      "Dividing transcript into chapters..."
    );
    chapters = await llmService.divideIntoChapters(transcript);

    await progressUtils.updateTaskProgress(
      taskId,
      "completed",
      100,
      "Task completed successfully."
    );
  } catch (error) {
    await progressUtils.updateTaskProgress(
      taskId,
      "failed",
      100,
      `Task failed: ${error?.message || error || ""}`
    );
    throw new Error(`Task failed: ${error?.message || "Unknown error"}`);
  }

  return {description, chapters, transcript};
};

const TEMP_DIR = path.join(__dirname, "../../temp");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, {recursive: true});
}

export const convertToMp3 = async (videoUrl: string): Promise<string> => {
  const isYouTube =
    videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  const videoFileName = `video_${Date.now()}.${isYouTube ? "mp4" : "mp4"}`;
  const audioFileName = `audio_${Date.now()}.mp3`;
  const videoPath = path.join(TEMP_DIR, videoFileName);
  const audioPath = path.join(TEMP_DIR, audioFileName);

  // Step 1: Download using appropriate method
  if (isYouTube) {
    await downloadYouTubeVideo(videoUrl, videoPath);
  } else {
    await downloadVideo(videoUrl, videoPath); // Your original download function
  }

  // Step 2: Convert the video to MP3
  await new Promise<void>((resolve, reject) => {
    ffmpeg(videoPath)
      .toFormat("mp3")
      .on("end", () => {
        console.log(`Audio saved to ${audioPath}`);
        resolve();
      })
      .on("error", (err: any) => {
        console.error("Error converting video to MP3:", err);
        reject(err);
      })
      .save(audioPath);
  });

  // Step 3: Clean up the video file
  fs.unlinkSync(videoPath);

  return audioPath;
};

const downloadYouTubeVideo = async (url: string, outputPath: string) => {
  const stream = ytdl(url, {quality: "highestaudio"});
  const writer = fs.createWriteStream(outputPath);
  stream.pipe(writer);
  return new Promise<void>((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

const downloadVideo = async (
  url: string,
  outputPath: string
): Promise<void> => {
  const writer = fs.createWriteStream(outputPath);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  return new Promise<void>((resolve, reject) => {
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};
