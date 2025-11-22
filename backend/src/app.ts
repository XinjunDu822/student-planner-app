import express from "express";
import cors from "cors";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./controllers/taskController.ts";
import { signIn, signUp } from "./controllers/authController.ts";

const app = express();

app.use(cors());
app.use(express.json());

//task routes
app.use("/api", getAllTasks);
app.use("/api", createTask);
app.use("/api", updateTask);
app.use("/api", deleteTask);

//auth routes
app.use("/api", signIn);
app.use("/api", signUp);

export default app;
