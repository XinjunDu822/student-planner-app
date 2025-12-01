import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import 'reactjs-popup/dist/index.css';
// import { TaskDatabase, CompletedTaskDatabase } from '../DummyData';
import { AddTaskPopup, DisplayTasks, DisplayCompletedTasks, EditTaskPopup, DeleteTaskPopup } from './Tasks';
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


  async function loadTasks(filter = "") {

    var response = await getAllTasks(user, filter);
    
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
  }
  
  useEffect(() => {
    loadTasks();
    const refreshInterval = setInterval(loadTasks, 60000);
    return () => clearInterval(refreshInterval);
  }, [user]);

  const addTask = useCallback(async (title, desc, date, time) =>
  {
    var response = await createTask(user, title, date, time, desc);

    await loadTasks();

    if(response.message)
    {
        return response.message;
    }

    return true;
  }, [loadTasks]);

  const selectTaskToEdit = useCallback((index) =>
  {
    for(let i = 0; i < tasks.length; i++)
    {
        if(tasks[i].id == index)
        {
            setTaskToEdit(tasks[i]);
            return;
        }
    }
    setTaskToEdit(null);

  }, [tasks]);

  const deselectTaskToEdit = useCallback(() => {
    setTaskToEdit(null);
  }, [])

  const editTask_ = async function(id, title, desc, date, time)
  {
    var response = await editTask(user, id, title, date, time, desc);
    await loadTasks();

    if(response.message)
    {
        return response.message;
    }

    return true;
  }

  const selectTaskToDelete = useCallback((index) =>
  {
    for(let i = 0; i < tasks.length; i++)
    {
        if(tasks[i].id == index)
        {
            setTaskToDelete(tasks[i]);
            return;
        }
    }
    setTaskToDelete(null);

  }, [tasks]);

  const deselectTaskToDelete = useCallback(() => {
    setTaskToDelete(null);
  }, [])

  const deleteTask_ = async function(id)
  {
    await deleteTask(user, id);
    await loadTasks();
  }


  const completeTask_ = async function(id)
  {
    await completeTask(user, id);
    await loadTasks(keywords);
  }

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

            {
                ((completedTasks.length) > 0) && (
                    <>
                        <h3>Complete</h3>
                        <DisplayCompletedTasks completedTasks={completedTasks} selectTaskToDelete={selectTaskToDelete}/>
                    </>
                )
            }

            {
                ((completedTasks.length) === 0) && (
                    <>
                        <h3><br/>You have no completed tasks right now.<br/> What a bum...</h3>
                    </>
                )
            }

            </div>

            <div className="todo">

                <h2>My Dashboard</h2>

                <AddTaskPopup addTask = {addTask}/>
                <div>
                    <InputField placeholderText = "Enter keyword" value={keywords} setValue = {setKeywords}/>
                    <button className="button" onClick=
                        {async () => {const ok = await loadTasks(keywords);}}>
                                Search
                    </button>
                    <button className="button" onClick=
                        {async () => {await loadTasks();}}>
                                Reset
                    </button>
                </div >
                {
                    (numLateTasks > 0) && (
                        <>
                            <h3>Late</h3>
                            <DisplayTasks tasks={tasks.slice(0, numLateTasks)} openEditPopup={selectTaskToEdit} openDeletePopup={selectTaskToDelete} completeTask={completeTask_}/>
                        </>
                    )
                }

                {
                    ((tasks.length - numLateTasks) > 0) && (
                        <>
                            <h3>To-do</h3>
                            <DisplayTasks tasks={tasks.slice(numLateTasks)} openEditPopup={selectTaskToEdit} openDeletePopup={selectTaskToDelete} completeTask={completeTask_}/>
                        </>
                    )
                }

                {
                    ((tasks.length - numLateTasks) === 0 && keywords === "") && (
                        <>
                            <h3><br/>You have no new tasks right now.<br/> Get started by creating some!</h3>
                        </>
                    )

                }
                {
                    ((tasks.length - numLateTasks) === 0 && keywords != "") && (
                        <>
                            <h3><br/>You have no tasks that match those keywords<br/> Get started by creating some!</h3>
                        </>
                    )
                }



            {/* <EditTaskPopup task={taskToEdit} editTask={editTask_} closeEditPopup={deselectTaskToEdit} />
  
            <DeleteTaskPopup task={taskToDelete} deleteTask={deleteTask_} closeDeletePopup={deselectTaskToDelete} /> */}


            </div>

        </div>

    </main>
    );
}


