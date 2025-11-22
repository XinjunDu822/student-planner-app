//createTask, editTask, deleteTask

import { Request, Response, NextFunction } from "express";
import prisma from "../prisma.ts";
import { title } from "process";

export const getAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => 
{
  try {
    const allTasks = await prisma.task.findMany({orderBy: {deadline: 'asc'}});
    // if (!allTasks)
    // {
    //   res.status(400).json({ message: "User does not have any tasks at the moment" });
    // }
    res.json(allTasks);
  }
  
  catch (err) {
    res.status(500).json({ message: "Server Error" });
  }

};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => 
{
  try {
    const { title, deadline, description} = req.body;
    if (!title || !deadline || !description)
    {
      return res.status(400).json({ message: "Please enter a title, description and deadline" });
    }
    const task = await prisma.task.create({
      data: {
        title,
        deadline: new Date(deadline),
        description,
      },
    }
  );
  res.json(task);
  }
  catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => 
{
    try {
    const taskId = req.params.id;
    const { title, deadline, description} = req.body; // add more fields later

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title && { title }),
        ...(deadline && { deadline: new Date(deadline) }),
        ...(description && { description }),
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
) => 
{
try {
    const taskId = req.params.id;
    const { title, deadline } = req.body; // add more fields later

    const deletedTask = await prisma.task.delete({
      where: { id: taskId },
    });
    res.json({ message: "Task deleted", deletedTask});
  } catch (err) {
    res.status(404).json({ message: "Cannot find task" });
  }
};

//maybe later we can do "getCompletedTasks" or "getDeletedTasks" etc etc
