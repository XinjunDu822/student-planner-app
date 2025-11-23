import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.ts";
import taskRouter from "./routes/taskRoutes.ts";
import { authMiddleware } from "./middleware/authMiddleware.ts"; // import middleware

const app = express();

app.use(cors());
app.use(express.json());

//app.use("/api", taskRouter);
app.use("/api/auth", authRouter);

//temp
app.get("/test/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: `Hello ${req.user?.name || "Guest"}` });
});


export default app;
