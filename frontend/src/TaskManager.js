import './App.css';
import './index.css';
import { useState, useEffect } from 'react';
import 'reactjs-popup/dist/index.css';
import { TimeToDate } from './Utils';
import { Header } from './Header';
import { DummyTasks } from './DummyData';

import { AddTaskPopup, DisplayTasks, DisplayLateTasks, DisplayCompletedTasks } from './Tasks';


export function TasksPage() {

  const [numLateTasks, setNumLateTasks] = useState(null);
  
  const [tasks, setTasks] = useState(DummyTasks);

  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {

    var updatedTasks = [...tasks];

    var c = [];

    var i = 0;

    for(; i < updatedTasks.length; i++)
    {
      if(updatedTasks[i].isComplete)
      {
        c.push(updatedTasks[i]);
        updatedTasks.splice(i, 1);
        i--;
      }
    }

    setCompletedTasks(c);
    setTasks(updatedTasks);
  }, []);
  
  useEffect(() => {
    var i = 0;
    var d = new Date();
    for(; i < tasks.length && d >= tasks[i].date; i++) { }
    setNumLateTasks(i);
  }, [tasks]);

  const addTask = function(name, desc, date, time)
  {
    
    if(/^\s*$/.test(name) ||
       /^\s*$/.test(date) ||
       /^\s*$/.test(time))
      return 1;

    var date_ = TimeToDate(date, time);

    var updatedTasks = [...tasks];

    var i = updatedTasks.length;

    updatedTasks.push({name: name, 
                       desc: desc, 
                       date: date_,
                       isComplete: false});

    var j = i - 1;

    while(j >= 0 && date_ < updatedTasks[j].date)
    {
      var temp = updatedTasks[j + 1];
      updatedTasks[j + 1] = updatedTasks[j];
      updatedTasks[j] = temp;
      j--;
    }

    setTasks(updatedTasks);
  };

  const editTask = function(i, name, desc, date, time)
  {
    if(/^\s*$/.test(name) ||
       /^\s*$/.test(date) ||
       /^\s*$/.test(time))
      return 1;

    var date_ = TimeToDate(date, time);

    var updatedTasks = [...tasks];

    updatedTasks[i] = ({name: name, 
                        desc: desc, 
                        date: date_,
                        isComplete: false});

    var j = i - 1;

    while(j >= 0 && date_ < updatedTasks[j].date)
    {
      var temp = updatedTasks[j + 1];
      updatedTasks[j + 1] = updatedTasks[j];
      updatedTasks[j] = temp;
      j--;
    }

    j = i + 1;

    while(j < updatedTasks.length && date_ > updatedTasks[j].date)
    {
      temp = updatedTasks[j - 1];
      updatedTasks[j - 1] = updatedTasks[j];
      updatedTasks[j] = temp;
      j++;
    }

    setTasks(updatedTasks);
  }

  const deleteTask = function(i)
  {
    let updatedTasks = [...tasks];

    updatedTasks.splice(i, 1);

    setTasks(updatedTasks);
  }


  const completeTask = function(i)
  {
    var task = tasks[i];

    task.isComplete = true;
    task.date = new Date();

    var c = [...completedTasks];

    c.push(task);

    setCompletedTasks(c);

    deleteTask(i);
  }

  return (
    <main>

        <div className="dashboard">

        <div className="completed">

            <DisplayCompletedTasks completedTasks={completedTasks}/>

        </div>

        <div className="todo">

            <h2>My Dashboard</h2>

            <AddTaskPopup addTask = {addTask}/>

            <DisplayLateTasks tasks={tasks} numLateTasks={numLateTasks} editTask={editTask} deleteTask={deleteTask} completeTask={completeTask}/>

            <DisplayTasks tasks={tasks} numLateTasks={numLateTasks} editTask={editTask} deleteTask={deleteTask} completeTask={completeTask}/>

        </div>

        </div>

    </main>
    );
}


