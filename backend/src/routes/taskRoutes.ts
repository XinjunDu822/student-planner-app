import express from "express";
import {
  getTaskData,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router = express.Router();

//i commented out authentication for now - marvin
router.get("/dashboard", authMiddleware, getTaskData);
router.post("/task", authMiddleware, createTask);
router.put("/task/:taskId", authMiddleware, updateTask);
router.delete("/task/:taskId", authMiddleware, deleteTask);

export default router;
