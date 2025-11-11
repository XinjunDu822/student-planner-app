import logo from './logo.png';
import './App.css';
import Popup from 'reactjs-popup';
import { useState, useEffect } from 'react';
import 'reactjs-popup/dist/index.css';
import { InputField } from './Utils';


export function Task({index, name, date, time, desc, editTask, deleteTask})
{
  return (
    <div className = "task">

      <div>
        {name}
      </div>

      <div>
        {date}  
      </div>

      <div>
        {time}  
      </div>

      <div>
        {desc}  
      </div>

      <div>
        <button className="button">Mark Complete</button>
      </div>

      <div>
        <EditTaskPopup editTask={editTask} currentName={name} currentDate={date} currentTime={time} currentDesc={desc} index={index}/>
      </div>

      <div>
        <DeleteTaskPopup deleteTask={deleteTask}/>
      </div>       

    </div>
  );
}

export function DisplayLateTasks({tasks, numLateTasks, editTask, deleteTask})
{
    if(numLateTasks > 0)
    {
        return (
        <>
            <h3>Late</h3>

            {tasks.map
            ((item, index) => 
                {
                if(index < numLateTasks)
                {
                    return <Task index={index} 
                            key={index}
                            name={item.name} 
                            desc={item.desc} 
                            date={item.date} 
                            time={item.time} 
                            editTask={editTask}
                            deleteTask={() => deleteTask(index)}/>;
                }
                return null;
                }
            )
            }
        </>
        );
    }
    return null;
}

export function DisplayTasks({tasks, numLateTasks, editTask, deleteTask})
{
    if(tasks.length - numLateTasks > 0)
    {
        return (
            
        <>
            <h3>To Do</h3>

            <div id="TasksList">
            
                {tasks.map
                ((item, index) => 
                    {
                    if(index >= numLateTasks)
                    {
                        return <Task index={index} 
                                key={index}
                                name={item.name} 
                                desc={item.desc} 
                                date={item.date} 
                                time={item.time} 
                                editTask={editTask}
                                deleteTask={() => deleteTask(index)}/>;
                    }
                    return null;
                    }
                )
                }

            </div>
        </>
        );
    }
    return (
        <h3><br/>You have no tasks right now.<br/> Get started by creating some!</h3>
    );
}


export function AddTaskPopup({addTask})
{
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  // const [day, setDay] = useState(0);
  // const [month, setMonth] = useState(0);
  // const [year, setYear] = useState(0);
  // const [hour, setHour] = useState(0);
  // const [minute, setMinute] = useState(0);

  function resetVars()
  {
    setName("");
    setDesc("");
    setDate("");
    setTime("");
  }

  return (
    <div >
      {/* pop up window */}
      <Popup className="task-popup"
          trigger= {<button className="button"> Add Task </button>}
          modal>
          {
              close => (
                  <div className='modal'>
                      <div className='content'>
                          <h3>Add Task</h3>
                      </div>

                      <div className="task-popup-content">
                          <InputField placeholderText = "Enter task name" value={name} setValue = {setName}/>
                      </div >

                      <div className="task-popup-content">
                          <InputField placeholderText = "Enter task description" value={desc} setValue = {setDesc}/>
                      </div >

                      <div className="task-popup-content">
                          <InputField placeholderText = "Enter task date" value={date} setValue = {setDate}/>
                      </div >

                      <div className="task-popup-content">
                          <InputField placeholderText = "Enter task time" value={time} setValue = {setTime}/>
                      </div >

                      <div className="button-holder">
                        <div>
                            <button className="button" onClick=
                                {() => {if(!addTask(name, desc, date, time)){resetVars(); close();}}}>
                                    Save
                            </button>
                        </div>
                        <div>
                            <button className="button" onClick=
                                {() => {resetVars(); close();}}>
                                    Cancel
                            </button>
                        </div>
                      </div>
                  </div>
              )
          }
      </Popup>
    </div>
  );
}


export function EditTaskPopup({editTask, currentName, currentDate, currentTime, currentDesc, index})
{
  const [name, setName] = useState(currentName);
  const [desc, setDesc] = useState(currentDesc);
  const [date, setDate] = useState(currentDate);
  const [time, setTime] = useState(currentTime);
  
  // const [day, setDay] = useState(0);
  // const [month, setMonth] = useState(0);
  // const [year, setYear] = useState(0);
  // const [hour, setHour] = useState(0);
  // const [minute, setMinute] = useState(0);

  function resetVars()
  {
    setName(currentName);
    setDesc(currentDesc);
    setDate(currentDate);
    setTime(currentTime);
  }

  return (
    <div >
      {/* pop up window */}
      <Popup className="task-popup"
          trigger= {<button className="button">Edit</button>}
          modal>
          {
              close => (
                  <div className='modal'>
                      <div className='content'>
                          <h3>Editing {currentName}</h3>
                      </div>

                      <div className="task-popup-content">
                          <InputField placeholderText = "Enter task name" value={name} setValue = {setName}/>
                      </div >

                      <div className="task-popup-content">
                          <InputField placeholderText = "Enter task description" value={desc} setValue = {setDesc}/>
                      </div >

                      <div className="task-popup-content">
                          <InputField placeholderText = "Enter task date" value={date} setValue = {setDate}/>
                      </div >

                      <div className="task-popup-content">
                          <InputField placeholderText = "Enter task time" value={time} setValue = {setTime}/>
                      </div >

                      <div className="button-holder">
                        <div>
                            <button className="button" onClick=
                              {() => {if(!editTask(index, name, desc, date, time)) close();}}>
                                  Save
                            </button>
                        </div>
                        <div>
                            <button className="button" onClick=
                                {() => {resetVars(); close();}}>
                                  Cancel
                            </button>
                        </div>
                      </div>
                  </div>
              )
          }
      </Popup>
    </div>
  );
}


export function DeleteTaskPopup({deleteTask})
{

  return (
    <div >
      {/* pop up window */}
      <Popup className="task-popup"
          trigger= {<button className="button">Delete</button>}
          modal>
          {
              close => (
                  <div className='modal'>
                      <div className='content'>
                          <h3>Are you sure you want to delete this task?</h3>
                      </div>

                      <div className="button-holder">
                        <div>
                            <button className="button" onClick=
                              {() => {deleteTask(); close();}}>
                                  Yes
                            </button>
                        </div>
                        <div>
                            <button className="button" onClick=
                                {() => {close();}}>
                                  No
                            </button>
                        </div>
                      </div>
                  </div>
              )
          }
      </Popup>
    </div>
  );
}