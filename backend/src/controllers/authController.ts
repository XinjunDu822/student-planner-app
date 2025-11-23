import { Request, Response, NextFunction } from "express";
import prisma from "../prisma.ts";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // store in env in real projects

type Payload = {
  id: string;
  name: string;
};

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

const checkRegisterReqs = (username: string, password: string): boolean => {
  const usernameTests = [/(?=(?:.*[A-Za-z]){3,})/];

  if (!usernameTests.every((r) => r.test(username))) return false;

  const passwordTests = [/[A-Z]/, /[a-z]/, /\d/, /[^a-zA-Z\d]/, /.{6,}/];

  if (!passwordTests.every((r) => r.test(password))) return false;

  return true;
};

export const createToken = (payload: Payload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    if (!checkRegisterReqs(name, password)) {
      return res.status(400).json({
        message: "Username and/or password do not satisfy requirements!",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        name,
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Username already in use." });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
      },
    });

    const token = createToken({ id: user.id, name: user.name }); //create token for user after signing in

    return res.status(200).json({ name: name, token: token });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    const user = await prisma.user.findUnique({
      where: { name },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    const token = createToken({ id: user.id, name: user.name });
    return res.status(200).json({ name: name, token: token });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};
