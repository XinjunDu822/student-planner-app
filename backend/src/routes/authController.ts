import { Request, Response, NextFunction } from "express";
import prisma from "../prisma.ts";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // store in env in real projects

type Payload = {
  id: string;
  email: string;
};

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const createToken = (payload: Payload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      //creates new account for user
      data: {
        email,
        password: hashedPassword,
      },
    });
    const token = createToken({ id: user.id, email: user.email }); //create token for user after signing in

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: "User Email does not exist" });
    }

    const isValid = comparePassword(password, user.password);

    if (!isValid) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const token = createToken({ id: user.id, email: user.email });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
