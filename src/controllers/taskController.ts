import {Request, Response} from "express";
import * as taskService from "../services/taskServices";

export const createTask = async (req: Request, res: Response) => {
  try {
    const {clientId, videoUrl, socketId} = req.body;
    const task = await taskService.createTask(clientId, videoUrl, socketId);
    res.status(201).json({success: true, data: task});
  } catch (error) {
    res.status(500).json({success: false, message: error ?? ""});
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const task = await taskService.getTask(id);
    res.status(200).json({success: true, data: task});
  } catch (error) {
    res.status(500).json({success: false, message: error ?? ""});
  }
};
