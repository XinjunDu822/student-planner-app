import { Request, Response, NextFunction } from "express";
import prisma from "../prisma.ts";
import { createToken } from "../middleware/authMiddleware.ts";
import bcrypt from "bcryptjs";

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

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, password } = req.body; //get user body submitted info

    if (!name || !password) {
      //check if user left something blank
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    if (!checkRegisterReqs(name, password)) {
      //REGEX check for valid user/pwd
      return res.status(400).json({
        message: "Username and/or password do not satisfy requirements!",
      });
    }

    const existingUser = await prisma.user.findUnique({
      //search DB if user exists
      where: {
        name,
      },
    });

    if (existingUser) {
      //cannot create another user with same name
      return res.status(409).json({ message: "Username already in use." });
    }

    const hashedPassword = await hashPassword(password); //hash pwd for privacy

    const user = await prisma.user.create({
      //create new user in DB with new data
      data: {
        name,
        password: hashedPassword,
      },
    });

    const token = createToken({ id: user.id, name: user.name }); //create token for user after signing in

    return res.status(200).json({ token }); //return JWT Token for user
  } catch (err) {
    return res.status(500).json({ message: "Server Error" }); //error if failed
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
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const logout = (req: Request, res: Response) => {
  // If using cookies:
  // res.clearCookie("token");

  // Stateless JWT approach: just respond
  return res.status(200).json({ message: "Logged out successfully." });
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }

    return res.status(200).json({
      name: req.user?.name,
      // lastLate: user.lastLate,
      bestStreak: user.bestStreak,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};
