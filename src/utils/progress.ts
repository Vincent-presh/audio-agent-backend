import {Socket} from "socket.io";
import Task, {TaskDocument} from "../models/taskModel";

export const updateTaskProgress = async (
  taskId: string,
  status: string,
  progress: number,
  message: string
): Promise<TaskDocument | null> => {
  const task = await Task.findByIdAndUpdate(
    taskId,
    {
      status,
      progress,
      $push: {logs: {message, timestamp: new Date()}},
    },
    {new: true}
  );

  const app = require("../app").app;
  const io = app.get("io") as Socket;
  io.emit(`task-update-${taskId}`, {
    status,
    progress,
    message,
    taskId,
  });

  return task;
};
