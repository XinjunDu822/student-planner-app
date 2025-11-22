import "dotenv/config";
import express from "express";
import cors from "cors";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./controllers/taskController.ts";
import userRoutes from "./routes/userRoutes.ts";


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", getAllTasks);
app.use("/api", createTask);
app.use("/api", updateTask);
app.use("/api", deleteTask);
app.use("/users", userRoutes);


export default app;
