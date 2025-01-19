import Task from "../models/taskModel";
import * as videoService from "./videoService";

export const createTask = async (
  clientId: string,
  videoUrl: string,
  socketId: string
) => {
  try {
    const newTask = await Task.create({clientId, videoUrl, status: "pending"});
    const {description, chapters, transcript} = await videoService.processVideo(
      newTask.id,
      videoUrl,
      socketId
    );

    if (!description || !chapters || !transcript) {
      throw new Error("Failed to process video.");
    }
    newTask.description = description;
    newTask.chapters = chapters;
    newTask.transcript = transcript;
    newTask.status = "completed";
    await newTask.save();
    return newTask;
  } catch (error) {
    console.log("🚀 ~ file: taskServices.ts:23 ~ createTask ~ error:", error);
  }
};

export const getTask = async (id: string) => {
  return await Task.findById(id);
};
