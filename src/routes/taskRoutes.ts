import {Router} from "express";
import * as taskController from "../controllers/taskController";

const router = Router();

router.post("/", taskController.createTask);
router.get("/:id", taskController.getTask);

export default router;
