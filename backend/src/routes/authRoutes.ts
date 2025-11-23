import express from "express"; 
import { signUp, signIn, getUser, logout } from "../controllers/authController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts"; // import middleware

const router = express.Router();

// Public routes
router.post("/sign-up", signUp);
router.post("/sign-in", signIn);

// Protected route: requires the user to be logged in
router.get("/get-user", authMiddleware, getUser);
router.post("/logout", authMiddleware, logout);

export default router;
