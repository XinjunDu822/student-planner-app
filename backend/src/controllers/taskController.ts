//createTask, editTask, deleteTask

import { Request, Response, NextFunction } from "express";
import prisma from "../prisma.ts";
import { start } from "repl";

// Prisma supports dates between year 1 and 9999
const MIN_DATE = new Date("0001-01-01T00:00:00.000Z");
const MAX_DATE = new Date("9999-12-31T23:59:59.999Z");
const MAX_RENDERED_TASKS = 100;

function TimeToDate(date: string, time: string) {
  if (!time || time == undefined) {
    return new Date(date);
  }
  const [h, m] = time.split(":", 2);
  var date_ = new Date(date);
  date_.setHours(+h, +m, 0, 0);
  return date_;
}

function ParseKeywords(keywords: unknown)
{
  if(!keywords)
  {
    keywords = [];
  }
  else if(!Array.isArray(keywords))
  {
    keywords = [keywords];
  }

  return (keywords as unknown[]).map(keyword => {
    const key = String(keyword);
    return {
      OR: [
        {
          title: {
            contains: key,
            // mode: 'insensitive',
          },
        },
        {
          desc: {
            contains: key,
            // mode: 'insensitive',
          },
        }
      ]
    };
  });
}

function ParseDateRange(start: unknown, end: unknown)
{
  var startDate = start ? new Date(String(start)) : MIN_DATE;
  
  var endDate = end ? new Date(String(end)) : null;
  
  endDate?.setDate(endDate.getDate() + 1);

  endDate = endDate ?? MAX_DATE;

  return {startDate, endDate};
}

export const getTaskData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id; // Assuming you have auth middleware that adds user to req

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }


    //Parsing queries 
    const keyMatches = ParseKeywords(req.query.keywords);

    const {startDate, endDate} = ParseDateRange(req.query.after, req.query.before)
 
    var now = new Date();

    var numTasksToDo = 0;

    //get all of user's incomplete, non-late tasks that satisfy the filters
    const newTasks = await prisma.task.findMany({
      where: {
        userID: userId,
        isComplete: false,
        AND: keyMatches,
        date: {
          gte: startDate && now < startDate ? startDate : now,
          lt: endDate,
        }
      },
      orderBy: {
        date: "asc",
      },
      take: MAX_RENDERED_TASKS,
    });

    numTasksToDo += newTasks.length;

    // Get total number of new tasks
    const totalNewTasks = await prisma.task.count({
      where: {
        userID: userId,
        isComplete: false,
        date: {
          gte: now,
        }
      }
    });

    //get late tasks
    const lateTasks = await prisma.task.findMany({
      where: {
        userID: userId,
        isComplete: false,
        AND: keyMatches,
        date: {
          gte: startDate,
          lt: endDate && endDate < now ? endDate : now,
        }
      },
      orderBy: {
        date: "asc",
      },
      take: MAX_RENDERED_TASKS - numTasksToDo,
    });

    numTasksToDo += lateTasks.length;

    const totalLateTasks = await prisma.task.count({
      where: {
        userID: userId,
        isComplete: false,
        date: {
          lt: now,
        }
      }
    });

    //get complete tasks
    const completedTasks = await prisma.task.findMany({
      where: {
        userID: userId,
        isComplete: true,
        AND: keyMatches,
      },
      orderBy: {
        date: "desc",
      },
      take: Math.max(10, numTasksToDo),
    });

    const totalCompletedTasks = await prisma.task.count({
      where: {
        userID: userId,
        isComplete: true,
      }
    });

    var lastLate = user.createdAt;

    var lastLateTask = await prisma.task.findFirst({
      where: {
        userID: userId,
        isComplete: false,
        date: {
          lt: now,
        }
      },
      orderBy: {
        date: "desc",
      },
    });

    if(lastLateTask)
    {
      lastLate = lastLateTask.date;
    }

    if(lastLate < user.lastLate)
    {
      lastLate = user.lastLate;
    }

    const currStreak = await prisma.task.count({
      where: {
        userID: userId,
        isComplete: true,
        date: {
          gt: lastLate,
        }
      }
    });

    var bestStreak = user.bestStreak;

    if(currStreak > bestStreak)
    {
      bestStreak = currStreak;
    }

    await prisma.user.update({
      where: { id: userId },
      data: { lastLate: lastLate, bestStreak: bestStreak },
    });

    return res
      .status(200)
      .json({ newTasks, 
              totalNewTasks,
              lateTasks,
              totalLateTasks,
              completedTasks,
              totalCompletedTasks,
              currStreak,
              bestStreak });
  } catch (err: unknown) {
    return res.status(500).json({ message: String(err) });
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
    //extract task and JWT Token
    const userId = req.user?.id;
    const { taskId } = req.params;

    //no JWT Token
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    //no task entered
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

    //check task belongs to user
    if (existingTask.userID !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    //delete task
    await prisma.task.delete({
      where: { id: taskId },
    });

    return res.status(200).json({ message: "Task deleted successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};
