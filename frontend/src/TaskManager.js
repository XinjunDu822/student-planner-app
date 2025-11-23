import './App.css';
import './index.css';
import { useState, useEffect, useSyncExternalStore } from 'react';
import 'reactjs-popup/dist/index.css';
import { TaskDatabase, CompletedTaskDatabase } from './DummyData';

import { AddTaskPopup, DisplayTasks, DisplayCompletedTasks } from './Tasks';


export function TasksPage() {

  const [numLateTasks, setNumLateTasks] = useState(null);

  const tasks = useSyncExternalStore(TaskDatabase.subscribe.bind(TaskDatabase),
                                    TaskDatabase.getData.bind(TaskDatabase));
  const completedTasks = useSyncExternalStore(CompletedTaskDatabase.subscribe.bind(CompletedTaskDatabase),
                                    CompletedTaskDatabase.getData.bind(CompletedTaskDatabase));


  function countLateTasks() {

    var i = 0;
    var d = new Date();
    for(; i < tasks.length && d >= tasks[i].date; i++) { }

    if(i !== numLateTasks)
    {
        setNumLateTasks(i);
    }
  }
  
  useEffect(() => {
    countLateTasks();    

    const refreshInterval = setInterval(countLateTasks, 60000);
    return () => clearInterval(refreshInterval);
  }, [tasks]);

  const addTask = function(name, desc, date)
  {
    TaskDatabase.add({name: name, 
                          desc: desc, 
                          date: date});
  };

  const editTask = function(i, name, desc, date)
  {
    TaskDatabase.edit(i, {name: name, 
                            desc: desc, 
                            date: date});
  }

  const deleteTask = function(i)
  {
    TaskDatabase.delete(i);
  }


  const completeTask = function(i)
  {
    var task = tasks[i];

    task.date = new Date();

    CompletedTaskDatabase.add(task);

    deleteTask(i);
  }

  return (
    <main>

        <div className="dashboard">

        <div className="completed">


        {
            ((completedTasks.length) > 0) && (
                <>
                    <h3>Complete</h3>
                    <DisplayCompletedTasks completedTasks={completedTasks}/>
                </>
            )
        }

        {
            ((completedTasks) === 0) && (
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
                        <DisplayTasks tasks={tasks.slice(0, numLateTasks)} indexOffset={0} editTask={editTask} deleteTask={deleteTask} completeTask={completeTask}/>
                    </>
                )
            }

            {
                ((tasks.length - numLateTasks) > 0) && (
                    <>
                        <h3>To-do</h3>
                        <DisplayTasks tasks={tasks.slice(numLateTasks)} indexOffset={numLateTasks} editTask={editTask} deleteTask={deleteTask} completeTask={completeTask}/>
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


