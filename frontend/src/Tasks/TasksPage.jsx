import { useState, useEffect, useCallback } from 'react';

import { TaskDisplay } from './TaskDisplay';
import { AddTaskPopup } from './AddTask';
import { EditTaskPopup } from './EditTask';
import { DeleteTaskPopup } from './DeleteTask';

import { 
  getAllTasks, 
  createTask, 
  editTask, 
  deleteTask, 
  completeTask, 
  updateLastLate, 
  updateBestStreak 
} from "./TaskService";

import { getUser } from "../Login/AuthService";
import {InputField, DateInputField} from '../Utils';

export function TasksPage({user, logout}) {

  const [tasks, setTasks] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(null);

  const [numLateTasks, setNumLateTasks] = useState(null);
  const [currStreak, setCurrStreak] = useState(null);
  const [bestStreak, setBestStreak] = useState(null);

  const [keywords, setKeywords] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [error, setError] = useState(null);


  const loadTasks = useCallback(async () => {
    const response = await getAllTasks(user);
    
    if(!response.tasks)
    {        
        if(response.message == "Unauthorized")
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

  const getTaskById = useCallback((id) =>
  {
    if(!id || !tasks)
    {
        return null;
    }
    return tasks.find(task => task.id === id) || null;
  }, [tasks]);


  if(!tasks || !completedTasks)
  {
    if(error)
    {
      return (
        <main>
          <div>
            <h3><br/>Error fetching tasks<br/>{error}</h3>
          </div>
        </main>
      );
    }

    return (
      <main>
        <div>
          <h3><br/>Loading tasks...</h3>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="dashboard">

        <div className="completed">
          <h3>Current streak</h3>

          <div className="streak">
            {currStreak}
          </div>

          <h3>Best: {bestStreak}</h3>
          
          <br/>      
          <hr/>
          <br/>

          <TaskDisplay 
            header={"Complete"} 
            tasks={completedTasks}
            keywords={keywords}
            displayCompleted
            emptyText={["You have no completed tasks right now.", "What a bum..."]}
            emptySearchText={["No new matching completed tasks."]}           
          />

        </div>

        <div className="todo">
            
          <div className="dashboard-bar">

            <h2>My Dashboard</h2>

            <div>
              <InputField 
                placeholderText = "Enter keyword(s)" 
                value={keywords} 
                setValue={setKeywords}
              />
            </div>

            <div>
              <div className="date-range">
                <DateInputField 
                  placeholderText = "Start date" 
                  value={startDate} 
                  setValue={setStartDate} 
                  emptyOnExit
                /> 
                
                <DateInputField 
                  placeholderText = "End date" 
                  value={endDate} 
                  setValue={setEndDate} 
                  emptyOnExit
                />
              </div>
            </div>
        </div >

        <AddTaskPopup addTask={addTask}/>

        <TaskDisplay 
          header={"Late"} 
          keywords={keywords} 
          startDate={startDate} 
          endDate={endDate}
          emptyText={null}
          emptySearchText={null}
          tasks={tasks.slice(0, numLateTasks)} 
          openEditPopup={(index) => setTaskToEdit(getTaskById(index))} 
          openDeletePopup={(index) => setTaskToDelete(getTaskById(index))} 
          completeTask={completeTask_}
        />

        <TaskDisplay 
          header={"To-do"} 
          emptyText={["You have no new tasks right now.", "Get started by creating some!"]}
          emptySearchText={["No new matching tasks."]}
          keywords={keywords} 
          startDate={startDate} 
          endDate={endDate}
          tasks={tasks.slice(numLateTasks)} 
          openEditPopup={(index) => setTaskToEdit(getTaskById(index))} 
          openDeletePopup={(index) => setTaskToDelete(getTaskById(index))} 
          completeTask={completeTask_}
        />


        <EditTaskPopup 
          task={taskToEdit} 
          editTask={editTask_} 
          closeEditPopup={() => setTaskToEdit(null)}
        />

        <DeleteTaskPopup 
          task={taskToDelete} 
          deleteTask={deleteTask_} 
          closeDeletePopup={() => setTaskToDelete(null)}
        />

        </div>
      </div>
    </main>
  );
}


