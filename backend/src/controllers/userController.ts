//TODO
import { Request, Response, NextFunction } from "express";
import prisma from "../prisma.ts";

// Get user profile
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        // Add more fields as they come
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user info (TODO: add auth check)
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const { email, password } = req.body; // add more fields later

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email, 
        // password update should hash first like authController
      },
    });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};