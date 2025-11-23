import express from "express";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router = express.Router();

//i commented out authentication for now - marvin
router.get("/dashboard", /*authMiddleware,*/ getAllTasks);
router.post("/task", /*authMiddleware,*/ createTask);
router.put("/task/:id", /*authMiddleware,*/ updateTask);
router.delete("/task/:id", /*authMiddleware,*/ deleteTask);

export default router;
