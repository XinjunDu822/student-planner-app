'use client';

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request type
declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string; name: string };
  }
}

// middleware/authMiddleware.ts
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

type Payload = {
  id: string;
  name: string;
};

export const createToken = (payload: Payload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "30m",
  });
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      name: string;
    };
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
