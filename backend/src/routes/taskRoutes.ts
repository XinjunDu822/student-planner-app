import express from "express";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  updateLastLate,
  updateBestStreak
} from "../controllers/taskController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router = express.Router();

//i commented out authentication for now - marvin
router.get("/dashboard", authMiddleware, getAllTasks);
router.post("/task", authMiddleware, createTask);
router.put("/task/:taskId", authMiddleware, updateTask);
router.delete("/task/:taskId", authMiddleware, deleteTask);

router.put("/late/", authMiddleware, updateLastLate);
router.put("/streak/", authMiddleware, updateBestStreak);

export default router;
