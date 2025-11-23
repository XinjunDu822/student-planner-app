//createTask, editTask, deleteTask

import { Request, Response, NextFunction } from "express";
import prisma from "../prisma.ts";

export const getAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allTasks = await prisma.task.findMany({
      orderBy: { date: "asc" },
    });
    // if (!allTasks)
    // {
    //   res.status(400).json({ message: "User does not have any tasks at the moment" });
    // }
    res.json(allTasks);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, date, desc } = req.body;
    if (!title || !date || !desc) {
      return res
        .status(400)
        .json({ message: "Please enter a title, description and deadline" });
    }
    const task = await prisma.task.create({
      data: {
        title,
        date: new Date(date),
        desc,
      },
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskId = req.params.id;
    const { title, date, desc } = req.body; // add more fields later

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title && { title }),
        ...(date && { deadline: new Date(date) }),
        ...(desc && { desc }),
      },
    });

    res.json(updatedTask);
  } catch (err) {
    res.status(404).json({ message: "Cannot find task" });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskId = req.params.id;
    const { title, date } = req.body; // add more fields later

    const deletedTask = await prisma.task.delete({
      where: { id: taskId },
    });
    res.json({ message: "Task deleted", deletedTask });
  } catch (err) {
    res.status(404).json({ message: "Cannot find task" });
  }
};

//maybe later we can do "getCompletedTasks" or "getDeletedTasks" etc etc
