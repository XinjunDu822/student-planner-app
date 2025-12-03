import { useState, useEffect, useCallback } from 'react';

import { TaskDisplay } from './TaskDisplay';
import { AddTaskPopup } from './AddTask';
import { EditTaskPopup } from './EditTask';
import { DeleteTaskPopup } from './DeleteTask';

import { getAllTasks, createTask, editTask, deleteTask, completeTask, updateLastLate, updateBestStreak } from "./TaskService";
import { getUser } from "../Login/AuthService";
import { InputField} from '../Utils';

export function TasksPage({user, logout}) {

  const [numLateTasks, setNumLateTasks] = useState(null);

  const [currStreak, setCurrStreak] = useState(null);
  const [bestStreak, setBestStreak] = useState(null);
  const [keywords, setKeywords] = useState("");

  const [tasks, setTasks] = useState(null);

  const [taskToEdit, setTaskToEdit] = useState(null);

  const [taskToDelete, setTaskToDelete] = useState(null);

  const [error, setError] = useState(null);

  const [completedTasks, setCompletedTasks] = useState(null);


  const loadTasks = useCallback(async () => {

    var response = await getAllTasks(user);
    
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

    var tasks_ = response.tasks;
    var completedTasks_ = response.completedTasks;

    for(var i = 0; i < tasks_.length; i++)
    {
        tasks_[i].date = new Date(tasks_[i].date);
    }

    for(var i = 0; i < completedTasks_.length; i++)
    {
        completedTasks_[i].date = new Date(completedTasks_[i].date);
    }

    setTasks(tasks_);
    setCompletedTasks(completedTasks_);

    var i = 0;
    var d = new Date();
    for(; i < tasks_.length && d >= tasks_[i].date; i++) { }

    setNumLateTasks(i);

    var lastLate = null;

    if(i > 0)
    {
        lastLate = tasks_[i - 1].date;
    }

    var user_ = await getUser(user);

    if(user_.lastLate)
    {
        var serverLastLate = new Date(user_.lastLate);

        if(lastLate != null && lastLate > serverLastLate)
        {
            await updateLastLate(user, lastLate);
        }
        else
        {
            lastLate = serverLastLate;
        }
    }

    var streak = 0;
    
    if(lastLate == null)
    {
        streak = completedTasks_.length;
    }
    else
    {
        for(; streak < completedTasks_.length && completedTasks_[streak].date > lastLate; streak++) { }
    }

    setCurrStreak(streak);

    var bestStreak = user_.bestStreak;

    if(streak > bestStreak)
    {
        bestStreak = streak;
        await updateBestStreak(user, bestStreak);
    }

    setBestStreak(bestStreak);
  }, [user, logout]);
  
  useEffect(() => {
    loadTasks();
    const refreshInterval = setInterval(loadTasks, 60000);
    return () => clearInterval(refreshInterval);
  }, [user, loadTasks]);

  const addTask = useCallback(async (title, desc, date, time) =>
  {
    var response = await createTask(user, title, date, time, desc);

    await loadTasks();

    return response;

  }, [user, loadTasks]);

  const getTask = useCallback((index) =>
  {
    if(!!index)
    {
        for(let i = 0; i < tasks.length; i++)
        {
            if(tasks[i].id == index)
            {
                return tasks[i];
            }
        }
    }
    return null;

  }, [tasks]);


  const editTask_ = useCallback(async (id, title, desc, date, time) =>
  {
    var response = await editTask(user, id, title, date, time, desc);
    await loadTasks();

    return response;

  }, [user, loadTasks]);


  const deleteTask_ = useCallback(async (id) =>
  {
    await deleteTask(user, id);
    await loadTasks();
  }, [user, loadTasks]);

  const completeTask_ = useCallback(async (id) =>
  {
    await completeTask(user, id);
    await loadTasks();
  }, [user, loadTasks]);


  if(tasks == null || completedTasks == null)
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

        <div className="dashboard">

            <div className="completed">

                <h3>Current streak</h3>

                <div className="streak">
                    {currStreak}
                </div>

                <h3>Best: {bestStreak}</h3><br/>
                
                <hr/><br/>

                <TaskDisplay header={"Complete"} 
                            emptyText={["You have no completed tasks right now.", "What a bum..."]}
                            emptySearchText={["No new matching completed tasks."]}
                            keywords={keywords} 
                            tasks={completedTasks} 
                            displayCompleted={true}/>

            </div>

            <div className="todo">
               
                <div className="dashboard-bar">

                    <div>
                        <h2>My Dashboard</h2>
                    </div>

                    <div>
                        <InputField placeholderText = "Enter keyword(s)" value={keywords} setValue = {setKeywords}/>
                    </div>
                
                </div >

                <AddTaskPopup addTask = {addTask}/>


                <TaskDisplay header={"Late"} 
                            keywords={keywords} 
                            emptyText={null}
                            emptySearchText={null}
                            tasks={tasks.slice(0, numLateTasks)} 
                            openEditPopup={(index) => setTaskToEdit(getTask(index))} 
                            openDeletePopup={(index) => setTaskToDelete(getTask(index))} 
                            completeTask={completeTask_}/>

                <TaskDisplay header={"To-do"} 
                            emptyText={["You have no new tasks right now.", "Get started by creating some!"]}
                            emptySearchText={["No new matching tasks."]}
                            keywords={keywords} 
                            tasks={tasks.slice(numLateTasks)} 
                            openEditPopup={(index) => setTaskToEdit(getTask(index))} 
                            openDeletePopup={(index) => setTaskToDelete(getTask(index))} 
                            completeTask={completeTask_}/>


            <EditTaskPopup task={taskToEdit} editTask={editTask_} closeEditPopup={() => setTaskToEdit(null)} />
  
            <DeleteTaskPopup task={taskToDelete} deleteTask={deleteTask_} closeDeletePopup={() => setTaskToDelete(null)} />


            </div>

        </div>

    </main>
    );
}


