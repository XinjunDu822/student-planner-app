// src/routes/userRoutes.ts
import { Router } from "express";
import { signup, signin, checkEmail } from "../controllers/userController.ts";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/check-email", checkEmail);

export default router;
