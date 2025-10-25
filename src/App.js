import logo from './logo.png';
import './App.css';
import { useState } from 'react';


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

  function login()
  {
    setIsLoggedIn(true);
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

          <div>
            <button>Add Task</button>
          </div>

          <h3>Late</h3>

            <Task name="Late Task 1"/>

            <Task name="Late Task 2"/>

          <h3>To Do</h3>

          <div id="TasksList">

            <Task name="Task 1"/>

            <Task name="Task 2"/>

            <Task name="Task 3"/>

          </div>        
        </div>
      </>
    );
}


/* <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </> */