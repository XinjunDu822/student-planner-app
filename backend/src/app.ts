import express from "express";
import cors from "cors";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./controllers/taskController";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", getAllTasks);
app.use("/api", createTask);
app.use("/api", updateTask);
app.use("/api", deleteTask);

export default app;
