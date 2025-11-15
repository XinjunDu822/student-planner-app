import { Router } from "express";

const router = Router();

// placeholder route
router.get("/", (req, res) => {
  res.send("Auth route working");
});

export default router;
