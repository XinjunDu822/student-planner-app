//createTask, editTask, deleteTask

import { Request, Response, NextFunction } from "express";
import prisma from "../prisma.ts";

function TimeToDate(date: string, time: string) {
  if (!time || time == undefined) {
    return new Date(date);
  }
  const [h, m] = time.split(":", 2);
  var date_ = new Date(date);
  date_.setHours(+h, +m, 0, 0);
  return date_;
}

export const getAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id; // Assuming you have auth middleware that adds user to req
    // const { keyword } = req.query;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // const keywordFilter = keyword
    // ? {
    //     title: {
    //         contains: keyword,
    //         // mode: "insensitive", // case-insensitive search
    //       },
    //   }
    // :{};

    //get all of user's nonComplete Tasks
    const allTasks = await prisma.task.findMany({
      where: {
        userID: userId,
        isComplete: false,
      },
      orderBy: {
        date: "asc",
      },
    });

    //get all of user's Complete Tasks
    const allCompletedTasks = await prisma.task.findMany({
      where: {
        userID: userId,
        isComplete: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    // const tasks = keyword
    //   ? allTasks.filter(
    //       (task) =>
    //         task.title.toLowerCase().includes(String(keyword).toLowerCase()) ||
    //         task.desc.toLowerCase().includes(String(keyword).toLowerCase())
    //     )
    //   : allTasks;

    // const completedTasks = keyword
    //   ? allCompletedTasks.filter(
    //       (task) =>
    //         task.title.toLowerCase().includes(String(keyword).toLowerCase()) ||
    //         task.desc.toLowerCase().includes(String(keyword).toLowerCase())
    //     )
    //   : allCompletedTasks;

    return res
      .status(200)
      .json({ tasks: allTasks, completedTasks: allCompletedTasks });
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
    //extract info in request
    const userId = req.user?.id;
    const { title, date, time, desc } = req.body;

    //no JWT Token
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    //Check for no missing inputs
    if (!title) {
      return res.status(400).json({ message: "Please enter a task name." });
    }

    if (!date) {
      return res.status(400).json({ message: "Please enter a task date." });
    }

    if (!time) {
      return res.status(400).json({ message: "Please enter a task time." });
    }

    //parse Date
    var date_ = TimeToDate(date, time);

    //valid date
    if (!date_) {
      return res.status(400).json({ message: "Please enter a valid date." });
    }

    //date is not already passed
    if (date_ < new Date()) {
      return res
        .status(400)
        .json({ message: "Date and time have already passed." });
    }

    //create the task in the database
    const task = await prisma.task.create({
      data: {
        userID: userId,
        title: title,
        date: date_,
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
    //extract reuqest data
    const userId = req.user?.id;
    const { taskId } = req.params;
    const { title, date, time, desc, isComplete } = req.body;

    //no JWT Token
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    //no params
    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required." });
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    //task doesnt exist in DB
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    //task in db doesn't belong to user
    if (existingTask.userID !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    var date_;

    //update date after parsing and valid future date
    if (date != undefined) {
      date_ = TimeToDate(date, time);

      if (time != undefined && date_ < new Date()) {
        return res
          .status(400)
          .json({ message: "Date and time have already passed." });
      }
    }

    // Build update object with only provided fields
    const updateData: any = {};
    if (title != undefined) updateData.title = title;
    if (date_ != undefined) updateData.date = date_;
    if (desc != undefined) updateData.desc = desc;
    if (isComplete != undefined) updateData.isComplete = isComplete;

    const updatedTask = await prisma.task.update({
      //update object
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

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { date } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }

    if (!date) {
      return res.status(400).json({ message: "Invalid date" });
    }

    var date_;

    try {
      date_ = new Date(date);
    } catch (err) {
      return res.status(400).json({ message: "Invalid date" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { lastLate: date_ },
    });
    return res.status(200).json({ date: date_ });
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

    await prisma.user.update({
      where: { id: userId },
      data: { bestStreak: streak },
    });
    return res.status(200).json({ streak: streak });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};
