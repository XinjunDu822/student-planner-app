//createTask, editTask, deleteTask

import { Request, Response, NextFunction } from "express";
import prisma from "../prisma.ts";

export const getAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {res.json({ message: "Hello world" });};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {res.json({ message: "Hello world" });};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {res.json({ message: "Hello world" });};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {res.json({ message: "Hello world" });};

//maybe later we can do "getCompletedTasks" or "getDeletedTasks" etc etc
