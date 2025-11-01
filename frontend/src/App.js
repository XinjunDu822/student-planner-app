import logo from './logo.png';
import './App.css';
import Popup from 'reactjs-popup';
import { useState, useEffect } from 'react';
import 'reactjs-popup/dist/index.css';
import { InputField } from './Utils';
import { LoginPage } from './Login';
import { AddTaskPopup, DisplayTasks, DisplayLateTasks } from './Tasks';


function GenericTask(name)
{
  return {name: name, 
          desc: name + " description", 
          date: "00-00-00", 
          time: "00:00 AM"};
};

export default function App() {

  const [numLateTasks, setNumLateTasks] = useState(2);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState([GenericTask("Late Task 1"),
                                      GenericTask("Late Task 2"),
                                      GenericTask("Generic Task 1"),
                                      GenericTask("Generic Task 2")]);


  function login(username, password)
  {
    setIsLoggedIn(true);
  };

  function addTask(name, desc, date, time)
  {
    if(/^\s*$/.test(name) ||
       /^\s*$/.test(desc) ||
       /^\s*$/.test(date) ||
       /^\s*$/.test(time))
      return 1;

    let updatedTasks = [...tasks];

    updatedTasks.push({name: name, 
                       desc: desc, 
                       date: date, 
                       time: time})

    setTasks(updatedTasks);
  };

  function editTask(i, name, desc, date, time)
  {
    if(/^\s*$/.test(name) ||
       /^\s*$/.test(desc) ||
       /^\s*$/.test(date) ||
       /^\s*$/.test(time))
      return 1;

    let updatedTasks = [...tasks];

    updatedTasks[i] = ({name: name, 
                        desc: desc, 
                        date: date, 
                        time: time})

    setTasks(updatedTasks);
  }

  function deleteTask(i)
  {
    let updatedTasks = [...tasks];

    updatedTasks.splice(i, 1);

    if(i < numLateTasks)
    {
      setNumLateTasks(numLateTasks-1);
    }

    setTasks(updatedTasks);
  }


  


  if(!isLoggedIn)

    return <LoginPage login={login}/>;

  return (
      <>
        <div className="App">
          <header>
            <h1>Class Planner App</h1>
            <hr></hr>
          </header>

          <h2>My Dashboard</h2>

          <AddTaskPopup addTask = {addTask}/>

          <DisplayLateTasks tasks={tasks} numLateTasks={numLateTasks} editTask={editTask} deleteTask={deleteTask}/>

          <DisplayTasks tasks={tasks} numLateTasks={numLateTasks} editTask={editTask} deleteTask={deleteTask}/>

        </div>
      </>
    );
}


