import express from "express";

const app = express();

// Middleware
app.use(express.json());

// Routes
// For now, you can leave empty or add placeholder
// import authRoutes from "./routes/authRoutes";
// app.use("/auth", authRoutes);

export default app;
