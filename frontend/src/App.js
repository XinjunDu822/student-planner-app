import logo from './logo.png';
import './App.css';
import './index.css';
import Popup from 'reactjs-popup';
import { useState, useEffect } from 'react';
import 'reactjs-popup/dist/index.css';
import { InputField, TimeToDate } from './Utils';
import { LoginPage } from './Login';
import { Header } from './Header';
import { AddTaskPopup, DisplayTasks, DisplayLateTasks, DisplayCompletedTasks } from './Tasks';


function GenericTask(name, isLate = false, isComplete = false)
{
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  if(isLate)
  {
    d.setDate(d.getDate() - 1);
  }
  else
  {
    d.setDate(d.getDate() + 1);
  }
  return {name: name, 
          desc: name + " description", 
          date: d,
          isComplete: isComplete};
};

export default function App() {

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const [numLateTasks, setNumLateTasks] = useState(null);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState([GenericTask("Late Task 1", true),
                                      GenericTask("Late Task 2", true),
                                      GenericTask("Generic Task 1"),
                                      GenericTask("Generic Task 2")]);

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
    console.log("Set NumLateTasks to " + i);
  }, [tasks]);

  const login = function(username, password)
  {
    setUsername(username);
    setPassword(password);
    setIsLoggedIn(true);
  };

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

    var j = i + 1;

    while(j < updatedTasks.length && date_ > updatedTasks[j].date)
    {
      var temp = updatedTasks[j - 1];
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


  if(!isLoggedIn)

    return <LoginPage login={login}/>;

  return (
      <>
        <Header user={username}/>

        <main>

          <div className="dashboard">

            <div className="todo">

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
      </>
    );
}


