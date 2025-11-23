import express from "express";
import { signUp, signIn, logout } from "../controllers/authController.ts";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/logout", logout);

export default router;
