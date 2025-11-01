import logo from './logo.png';
import './App.css';
import Popup from 'reactjs-popup';
import { useState } from 'react';
import 'reactjs-popup/dist/index.css';

function Task({name})
{
  return (
    <div className = "task" style={{ display: 'flex', gap: '20px', margin: '15px', textAlign: 'left'}}>

      <div style={{ flex: 2, maxWidth: '200px'}}>
        {name} Name
      </div>

      <div style={{ flex: 1, maxWidth: '100px'}}>
        {name} Date  
      </div>

      <div style={{ flex: 3}}>
        {name} Description  
      </div>

      <div>
        <button>Mark Complete</button>
      </div>

      <div>
        <button>Edit</button>
      </div>

      <div>
        <button>Delete</button>
      </div>       

    </div>
  );
}


export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState([]);
  function login()
  {
    setIsLoggedIn(true);
  }

  function addTask()
  {
    setTasks([...tasks, <Task name="Late Task 1"/>]);
  }

  if(!isLoggedIn)

    return (
      <>
        <div className="App">
          <header>
            <h1>Class Planner App</h1>
            <hr></hr>
          </header>        
        </div>

        <div style={{textAlign: 'center'}}>

          <div>
            <button onClick={login}>Login</button>
          </div>

          <div>
            <button>Create Account</button>
          </div>

        </div>

      </>
    );

  return (
      <>
        <div className="App">
          <header>
            <h1>Class Planner App</h1>
            <hr></hr>
          </header>

          <h2>My Dashboard</h2>

          <div >
            {/* pop up window */}
            <Popup className="task-popup"
                trigger= {<button> Add Task </button>}
                modal>
                {
                    close => (
                        <div className='modal'>
                            <div className='content'>
                                Enter task details
                            </div>
                            <div className="task-popup-content">
                                <input className="task-popup-content" type="text" id="myTextInput" placeholder="Enter task name"/>
                            </div >
                            <div className="task-popup-content">
                                <input className="task-popup-content" type="text" id="myTextInput" placeholder="Enter task description"/>
                            </div>
                            <div className="task-popup-content">
                                <input className="task-popup-content" type="text" id="myTextInput" placeholder="Enter due date"/>
                            </div>
                            <div>
                                <button onClick=
                                    {() => {addTask(); close();}}>
                                        Save task
                                </button>
                            </div>
                        </div>
                    )
                }
            </Popup>
          </div>

          <h3>Late</h3>

            <Task name="Late Task 1"/>

            <Task name="Late Task 2"/>

          <h3>To Do</h3>

          <div id="TasksList">
            {tasks}
{/* 
            <Task name="Task 1"/>

            <Task name="Task 2"/>

            <Task name="Task 3"/> */}

          </div>        
        </div>
      </>
    );
}


