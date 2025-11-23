//createTask, editTask, deleteTask

import { Request, Response, NextFunction } from "express";
import prisma from "../prisma.ts";

export const getAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id; // Assuming you have auth middleware that adds user to req

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tasks = await prisma.task.findMany({
      where: {
        userID: userId,
        isComplete: false,
      },
      orderBy: {
        date: "asc",
      },
    });

    const completedTasks = await prisma.task.findMany({
      where: {
        userID: userId,
        isComplete: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return res.status(200).json({ tasks: tasks,
                                  completedTasks: completedTasks                            
                                });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { title, date, desc } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title || !date) {
      return res.status(400).json({ message: "Title and date are required." });
    }

    const task = await prisma.task.create({
      data: {
        userID: userId,
        title: title,
        date: new Date(date),
        desc: desc || "",
      },
    });

    return res.status(201).json({ task });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { taskId } = req.params;
    const { title, date, desc, isComplete } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required." });
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    if (existingTask.userID !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Build update object with only provided fields
    const updateData: any = {};
    if (title != undefined) updateData.title = title;
    if (date != undefined) updateData.date = new Date(date);
    if (desc != undefined) updateData.desc = desc;
    if (isComplete != undefined) updateData.isComplete = isComplete;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    return res.status(200).json({ task: updatedTask });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { taskId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required." });
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    if (existingTask.userID !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return res.status(200).json({ message: "Task deleted successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};


export const updateLastLate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { date } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }
    
    if (date > user.lastLate) {
      await prisma.user.update({
        where: { id: userId },
        data: { lastLate: date },
      });
      return res.status(200).json({ date: date });
    }

    return res.status(200).json({ date: user.lastLate });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const updateBestStreak = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { streak } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }

    if (streak > user.bestStreak) {
      await prisma.user.update({
        where: { id: userId },
        data: { bestStreak: streak },
      });
      return res.status(200).json({ streak: streak });
    }

    return res.status(200).json({ streak: user.bestStreak });

  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};