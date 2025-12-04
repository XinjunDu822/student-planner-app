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
//all our routes, requires JWT Token with authMiddleware
router.get("/dashboard", authMiddleware, getTaskData);
router.post("/task", authMiddleware, createTask);
router.put("/task/:taskId", authMiddleware, updateTask);
router.delete("/task/:taskId", authMiddleware, deleteTask);

//merged into getTaskData, one general endpoint
//router.put("/late/", authMiddleware, updateLastLate);
//router.put("/streak/", authMiddleware, updateBestStreak);

export default router;
