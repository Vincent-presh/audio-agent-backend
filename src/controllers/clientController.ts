import {Request, Response} from "express";
import Client from "../models/clientModel";
import {ApiResponse} from "../types/ResponseType";

// Create a new client
export const createClient = async (
  req: Request,
  res: Response<ApiResponse<typeof Client>>
): Promise<void> => {
  try {
    const {name} = req.body;
    const formatDocument = req.file?.path; // File path from multer

    if (!name || !formatDocument) {
      res.status(400).json({
        success: false,
        message: "Name and format document are required.",
      });
      return;
    }

    const client = new Client({name, formatDocument});
    await client.save();

    res.status(201).json({
      success: true,
      data: client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "An error occurred.",
    });
  }
};

// Get a single client by ID
export const getClientById = async (
  req: Request,
  res: Response<ApiResponse<typeof Client>>
): Promise<void> => {
  try {
    const {id} = req.params;
    const client = await Client.findById(id);

    if (!client) {
      res.status(404).json({
        success: false,
        message: "Client not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "An error occurred.",
    });
  }
};

// Get all clients
export const getClients = async (
  req: Request,
  res: Response<ApiResponse<(typeof Client)[]>>
) => {
  try {
    const clients = await Client.find();
    res.status(200).json({
      success: true,
      data: clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "An error occurred.",
    });
  }
};
