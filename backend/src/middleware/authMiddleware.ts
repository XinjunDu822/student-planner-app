"use client";

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

//Create Token from userID and name with 30 minute expiry
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
    //check if user made request with a JWT Bearer Token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    //Decode JWT Token using JWT_SECRET key
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
