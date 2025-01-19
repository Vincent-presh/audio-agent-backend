import {Router} from "express";
import multer from "multer";
import * as clientController from "../controllers/clientController";

const router = Router();

router.post("/", clientController.createClient); // Create a new client
router.get("/:id", clientController.getClientById); // Get a single client by ID
router.get("/", clientController.getClients); // Get all clients

export default router;
