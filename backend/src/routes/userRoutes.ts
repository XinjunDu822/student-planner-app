// src/routes/userRoutes.ts
import { Router } from "express";
import { signup, signin, checkEmail, getUser, updateUser, deleteUser } from "../controllers/userController.ts";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/check-email", checkEmail);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
