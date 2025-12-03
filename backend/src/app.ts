import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.ts";
import taskRouter from "./routes/taskRoutes.ts";
import { authMiddleware } from "./middleware/authMiddleware.ts"; // import middleware

const app = express();

app.use(cors()); //allow frontend to access backend w/ cors
app.use(express.json()); //parse json for node.js to read (express)

app.use("/api", taskRouter); //all our task routes
app.use("/api/auth", authRouter); //all our auth routes

//temp for testing auth middleware
//app.get("/test/protected", authMiddleware, (req, res) => {
//  res.status(200).json({ message: `Hello ${req.user?.name || "Guest"}` });
//});

export default app;
