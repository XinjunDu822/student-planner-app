import { useState, useEffect, useCallback } from 'react';
import { 
  getTaskData, 
  createTask, 
  editTask, 
  deleteTask, 
  completeTask, 
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


export function useTaskManager(user, logout, filters) {
  const [newTasks, setNewTasks] = useState(null);
  const [totalNewTasks, setTotalNewTasks] = useState(null);
  const [lateTasks, setLateTasks] = useState(null);
  const [totalLateTasks, setTotalLateTasks] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(null);
  const [totalCompletedTasks, setTotalCompletedTasks] = useState(null);

  const [currStreak, setCurrStreak] = useState(null);
  const [bestStreak, setBestStreak] = useState(null);

  const [error, setError] = useState(null);


  const loadTasks = useCallback(async () => {
    const response = await getTaskData(user, filters);
    
    if(response.message)
    {        
      if(response.message === "Unauthorized")
      {
        logout();   
        return;         
      }
      setNewTasks(null);
      setCompletedTasks(null);
      setError(response.message);
      return;
    }

    setNewTasks(response.newTasks.map(normalizeTask));
    setTotalNewTasks(response.totalNewTasks);

    setLateTasks(response.lateTasks.map(normalizeTask));
    setTotalLateTasks(response.totalLateTasks);

    setCompletedTasks(response.completedTasks.map(normalizeTask));
    setTotalCompletedTasks(response.totalCompletedTasks);

    setCurrStreak(response.currStreak);
    setBestStreak(response.bestStreak);
  }, [user, logout, filters]);

  // Load tasks & refresh every minute
  useEffect(() => {
    loadTasks();
    const refreshInterval = setInterval(loadTasks, 60000);
    return () => clearInterval(refreshInterval);
  }, [loadTasks]);

  const addTask = useCallback(async ({title, desc, date, time}) => {
    const response = await createTask(user, title, date, time, desc);
    await loadTasks();
    return response;
  }, [user, loadTasks]);

  const editTask_ = useCallback(async ({id, title, desc, date, time}) => {
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

  return {
    data: {
      newTasks, 
      totalNewTasks, 
      lateTasks,
      totalLateTasks,
      completedTasks, 
      totalCompletedTasks, 
      currStreak, 
      bestStreak, 
      error},
    actions: {
      loadTasks,
      addTask, 
      editTask: editTask_, 
      deleteTask: deleteTask_, 
      completeTask: completeTask_,},
  };
}