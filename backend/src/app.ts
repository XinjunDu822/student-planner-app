import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.ts";
import taskRouter from "./routes/taskRoutes.ts";

const app = express();

app.use(cors());
app.use(express.json());

//app.use("/api", taskRouter);
app.use("/api/auth", authRouter);

export default app;
