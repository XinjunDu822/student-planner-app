import { useState, useEffect, useCallback } from 'react';
import { 
  getAllTasks, 
  createTask, 
  editTask, 
  deleteTask, 
  completeTask, 
  updateLastLate, 
  updateBestStreak 
} from './TaskService';
import { getUser } from '../Login/AuthService';

export function useTasks(user, logout) {
  const [tasks, setTasks] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(null);

  const [numLateTasks, setNumLateTasks] = useState(null);
  const [currStreak, setCurrStreak] = useState(null);
  const [bestStreak, setBestStreak] = useState(null);

  const [error, setError] = useState(null);

  const loadTasks = useCallback(async () => {
    const response = await getAllTasks(user);
    
    if(!response.tasks)
    {        
      if(response.message === "Unauthorized")
      {
        logout();   
        return;         
      }
      setTasks(null);
      setCompletedTasks(null);
      setError(response.message);
      return;
    }

    const tasksArr = response.tasks.map(task => ({ ...task, date: new Date(task.date) }));
    const completedArr = response.completedTasks.map(task => ({ ...task, date: new Date(task.date) }));

    setTasks(tasksArr);
    setCompletedTasks(completedArr);

    // Calculate late tasks
    const now = new Date();
    var lateCount = 0;
    while(lateCount < tasksArr.length && now >= tasksArr[lateCount].date)
    {
      lateCount++;
    }

    setNumLateTasks(lateCount);

    let lastLate = lateCount > 0 ? tasksArr[lateCount - 1].date : null;

    // Fetch user record
    var userInfo = await getUser(user);

    if(userInfo.lastLate)
    {
      const serverLastLate = new Date(userInfo.lastLate);

      if(lastLate && lastLate > serverLastLate)
      {
        await updateLastLate(user, lastLate);
      }
      else
      {
        lastLate = serverLastLate;
      }
    }

    // Calculate streak
    let streak = 0;
    
    if(!lastLate)
    {
      streak = completedArr.length;
    }
    else
    {
      while(streak < completedArr.length && completedArr[streak].date > lastLate)
      {
        streak++;
      }
    }

    setCurrStreak(streak);

    // Update best streak
    let best = userInfo.bestStreak;
    if(streak > best)
    {
      best = streak;
      await updateBestStreak(user, best);
    }
    setBestStreak(best);
  }, [user, logout]);

  // Load tasks & refresh every minute
  useEffect(() => {
    loadTasks();
    const refreshInterval = setInterval(loadTasks, 60000);
    return () => clearInterval(refreshInterval);
  }, [loadTasks]);

  const addTask = useCallback(async (title, desc, date, time) => {
    const response = await createTask(user, title, date, time, desc);
    await loadTasks();
    return response;
  }, [user, loadTasks]);


  const editTask_ = useCallback(async (id, title, desc, date, time) => {
    const response = await editTask(user, id, title, date, time, desc);
    await loadTasks();
    return response;
  }, [user, loadTasks]);


  const deleteTask_ = useCallback(async (id) => {
    await deleteTask(user, id);
    await loadTasks();
  }, [user, loadTasks]);

  const completeTask_ = useCallback(async (id) => {
    await completeTask(user, id);
    await loadTasks();
  }, [user, loadTasks]);

  const getTaskById = useCallback((id) => {
    if(!id || !tasks)
    {
        return null;
    }
    return tasks.find(task => task.id === id) || null;
  }, [tasks]);

  return {
    tasks,
    completedTasks,
    numLateTasks,
    currStreak,
    bestStreak,
    error,
    addTask,
    editTask_,
    deleteTask_,
    completeTask_,
    getTaskById,
    loadTasks
  };
}