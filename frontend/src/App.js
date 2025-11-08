import logo from './logo.png';
import './App.css';
import Popup from 'reactjs-popup';
import { useState, useMemo } from 'react';
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

  const [sortOption, setSortOption] = useState("dateAsc");
  const [filterOption, setFilterOption] = useState("all");

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


  const filteredTasks = useMemo(() => {
    let temp = tasks.filter((task, index) => {
      if (filterOption === "all") return true;
      if (filterOption === "late") return index < numLateTasks;
      if (filterOption === "completed") return index >= numLateTasks;
    });

    temp.sort((a, b) => {
      if (sortOption === "nameAsc") return a.name.localeCompare(b.name);
      if (sortOption === "nameDesc") return b.name.localeCompare(a.name);
      if (sortOption === "dateAsc") return a.date.localeCompare(b.date);
      if (sortOption === "dateDesc") return b.date.localeCompare(a.date);
      return 0;
    });

    return temp;
  }, [tasks, sortOption, filterOption, numLateTasks]);



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

          {/* Sorting & Filtering Controls */}
          <div className="controls">
            <label>
              Filter:
              <select value={filterOption} onChange={e => setFilterOption(e.target.value)}>
                <option value="all">All</option>
                <option value="late">Late</option>
                <option value="completed">Completed</option>
              </select>
            </label>

            <label>
              Sort:
              <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
                <option value="nameAsc">Name ↑</option>
                <option value="nameDesc">Name ↓</option>
                <option value="dateAsc">Date ↑</option>
                <option value="dateDesc">Date ↓</option>
              </select>
            </label>
          </div>

          <DisplayLateTasks tasks={tasks} numLateTasks={numLateTasks} editTask={editTask} deleteTask={deleteTask}/>

          <DisplayTasks tasks={filteredTasks} numLateTasks={numLateTasks} editTask={editTask} deleteTask={deleteTask}/>

        </div>
      </>
    );
}


