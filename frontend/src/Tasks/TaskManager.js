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
import { getUser } from '../Auth/AuthService';


const normalizeTask = (task) => ({
  ...task,
  date: new Date(task.date)
});

const countLateTasks = (tasks) => {
  const now = new Date();
  let count = 0;
  while (count < tasks.length && now >= tasks[count].date) {
    count++;
  }
  return count;
};

const calculateStreak = (completed, lastLate) => {
  if (!lastLate) return completed.length;

  let streak = 0;
  while (streak < completed.length && completed[streak].date > lastLate) {
    streak++;
  }
  return streak;
};


export function useTaskManager(user, logout) {
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

    const tasksArr = response.tasks.map(normalizeTask);
    const completedArr = response.completedTasks.map(normalizeTask);

    setTasks(tasksArr);
    setCompletedTasks(completedArr);

    // Calculate late tasks
    const lateCount = countLateTasks(tasksArr);
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
    const streak = calculateStreak(completedArr, lastLate);    
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
    data: {tasks, completedTasks, numLateTasks, currStreak, bestStreak, error},
    actions: {addTask, editTask: editTask_, deleteTask: deleteTask_, completeTask: completeTask_,},
    selectors: {getTaskById},
    reload: {loadTasks}
  };
}