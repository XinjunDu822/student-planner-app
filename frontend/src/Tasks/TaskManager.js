import { useState, useEffect, useSyncExternalStore } from 'react';
import 'reactjs-popup/dist/index.css';
// import { TaskDatabase, CompletedTaskDatabase } from '../DummyData';
import { AddTaskPopup, DisplayTasks, DisplayCompletedTasks } from './Tasks';
import { getAllTasks, createTask, editTask, deleteTask, completeTask, updateLastLate, updateBestStreak } from "./TaskService";


export function TasksPage({user}) {

  const [numLateTasks, setNumLateTasks] = useState(null);

  const [currStreak, setCurrStreak] = useState(null);
  const [bestStreak, setBestStreak] = useState(null);


  const [tasks, setTasks] = useState(null);

  const [error, setError] = useState(null);

  const [completedTasks, setCompletedTasks] = useState(null);


  async function loadTasks() {

    var response = await getAllTasks(user);

    console.log(response);
    
    if(!response.tasks)
    {
        setTasks(null);
        setCompletedTasks(null);
        setError(response.message);
        return;
    }

    setTasks(response.tasks);
    setCompletedTasks(response.completedTasks);

    var i = 0;
    var d = new Date();
    for(; i < response.tasks.length && d >= response.tasks[i].date; i++) { }

    if(i !== numLateTasks)
    {
        setNumLateTasks(i);
    }

    var streak = 0;

    if(i > 0)
    {
        var lastLate = tasks[i - 1].date;
        await updateLastLate(user, lastLate);

        for(; streak < response.completedTasks.length && response.completedTasks[streak] > lastLate; streak++) { }
    }
    else
    {
        streak = response.completedTasks.length;
    }

    setCurrStreak(streak);

    var bestStreakResponse = await updateBestStreak(user, streak);

    if(bestStreakResponse.streak)
    {
        setBestStreak(bestStreakResponse.streak);
    }
    
  }
  
  useEffect(() => {
    loadTasks();
    const refreshInterval = setInterval(loadTasks, 60000);
    return () => clearInterval(refreshInterval);
  }, [user]);

  const addTask = async function(name, desc, date)
  {
    console.log(name);
    console.log(desc);
    console.log(date);
    var response = await createTask(user, name, date, desc);

    console.log(response.message);

    await loadTasks();
  };

  const editTask_ = async function(id, name, desc, date)
  {
    await editTask(user, id, name, date, desc);
    await loadTasks();
  }

  const deleteTask_ = async function(id)
  {
    await deleteTask(user, id);
    await loadTasks();
  }


  const completeTask_ = async function(id)
  {
    await completeTask(user, id);
    await loadTasks();
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

            <h3>Your current streak</h3>

            <streak>{currStreak}</streak>

            <h3>Best: {bestStreak}</h3><br/>
            
            <hr/><br/>

            {
                ((completedTasks.length) > 0) && (
                    <>
                        <h3>Complete</h3>
                        <DisplayCompletedTasks completedTasks={completedTasks}/>
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

                {
                    (numLateTasks > 0) && (
                        <>
                            <h3>Late</h3>
                            <DisplayTasks tasks={tasks.slice(0, numLateTasks)} editTask={editTask_} deleteTask={deleteTask_} completeTask={completeTask_}/>
                        </>
                    )
                }

                {
                    ((tasks.length - numLateTasks) > 0) && (
                        <>
                            <h3>To-do</h3>
                            <DisplayTasks tasks={tasks.slice(numLateTasks)} editTask={editTask_} deleteTask={deleteTask_} completeTask={completeTask_}/>
                        </>
                    )
                }

                {
                    ((tasks.length - numLateTasks) === 0) && (
                        <>
                            <h3><br/>You have no new tasks right now.<br/> Get started by creating some!</h3>
                        </>
                    )
                }

                

            </div>

        </div>

    </main>
    );
}


