import logo from './logo.png';
import './App.css';
import Popup from 'reactjs-popup';
<<<<<<< Updated upstream
import { useState, useEffect } from 'react';
import 'reactjs-popup/dist/index.css';
import { InputField } from './Utils';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
=======
import { useState, useCallback, useEffect } from 'react';
import 'reactjs-popup/dist/index.css';
import { InputField, DateInputField, DateToParams, TimeToDate, FormatTime } from './Utils';
>>>>>>> Stashed changes


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
        <div>
          <button className="button"><p>Mark Complete</p><p>✓</p></button>
        </div>

        <div>
          <EditTaskPopup editTask={editTask} currentName={name} currentDate={date} currentTime={time} currentDesc={desc} index={index}/>
        </div>

        <div>
          <DeleteTaskPopup deleteTask={deleteTask}/>
        </div>     

      </div> 

    </div>
  );
}

<<<<<<< Updated upstream
export function DisplayLateTasks({tasks, numLateTasks, editTask, deleteTask})
=======
export function DisplayTasks({tasks, editTask, deleteTask, completeTask, indexOffset})
>>>>>>> Stashed changes
{
    return (
        <div id="TasksList">
        
            {tasks.map
            ((item, index) => 
<<<<<<< Updated upstream
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
=======
                  <Task index={index + indexOffset} 
                        key={index + indexOffset}
                        data={item} 
                        editTask={editTask}
                        deleteTask={() => deleteTask(index + indexOffset)}
                        completeTask={() => completeTask(index + indexOffset)}/>
>>>>>>> Stashed changes
            )
            }

<<<<<<< Updated upstream
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
        <h3><br/>You have no new tasks right now.<br/> Get started by creating some!</h3>
=======
        </div>
>>>>>>> Stashed changes
    );
}


export function AddTaskPopup({addTask})
{
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
<<<<<<< Updated upstream
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateValue, setDateValue] = useState("");
  // const [day, setDay] = useState(0);
  // const [month, setMonth] = useState(0);
  // const [year, setYear] = useState(0);
  // const [hour, setHour] = useState(0);
  // const [minute, setMinute] = useState(0);

  function resetVars()
  {
=======
  
  const [error, setError] = useState("");

  const resetVars = useCallback(() => {
    setError("");
>>>>>>> Stashed changes
    setName("");
    setDesc("");
    setDate("");
    setTime("");
  }

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    setDateValue(date.toLocaleDateString());
    setShowPicker(false);
  }

  const addTaskWrapper = () => {
    if(/^\s*$/.test(name))
    {
      setError("Please enter a task name.")
      return false;
    }

    if(/^\s*$/.test(date))    
    {
      setError("Please enter a task date.")
      return false;  
    }

    if(/^\s*$/.test(time))    
    {
      setError("Please enter a task time.")
      return false;  
    }

    var date_ = TimeToDate(date, time);

    if(date_ < new Date())
    {
      setError("Date and time have already passed..")
      return false; 
    }

    addTask(name, desc, date);
    return true;
  }

  return (
    <div >
      {/* pop up window */}
      <Popup className="task-popup"
          // trigger= {<button className="button"><p>Add Task</p><p>+</p></button>}
          trigger= {<button className="button">Add Task</button>}
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

                      <div className="task-popup-content" style={{margin:'0 auto'}}>
                          {/* <select onChange={(e) => {
                              if (e.target.value === "openSchedule") setShowPicker(true);
                              else setShowPicker(false);
                            }}>
                            <option value="">Select option</option>
                            <option value="openSchedule">Open Schedule</option>
                          </select> */}
                          <button onClick=
                              {() => setShowPicker(true)}>
                                  Open Schedule
                          </button>
                          {showPicker && (
                            <DatePicker selected = {selectedDate} 
                            onChange = {handleDateSelection}
                            inline/>
                          )

                          }

                          <input placeholderText = "Selected date will appear here" value={dateValue} onChange = {(e) => setDateValue(e.target.value)}/>
                      </div >

                      <div className="task-popup-content" style={{margin:'0 auto'}}>
                          <InputField placeholderText = "Enter task time: (format: 00:00 am/pm)" value={time} setValue = {setTime}/>
                      </div >

                      <div className='error-text'>
                          {error} 
                      </div>

                      <div className="button-holder">
                        <div>
                            <button className="button" onClick=
<<<<<<< Updated upstream
                                {() => {if(!addTask(name, desc, date, time)){resetVars(); close();}}}>
=======
                                {() => {addTaskWrapper() && close()}}>
>>>>>>> Stashed changes
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
  
  const [error, setError] = useState("");

<<<<<<< Updated upstream
  function resetVars()
  {
=======
  useEffect(() => {
    setError("");
>>>>>>> Stashed changes
    setName(currentName);
    setDesc(currentDesc);
    setDate(currentDate);
    setTime(currentTime);
  }

  const editTaskWrapper = () => {
    if(/^\s*$/.test(name))
    {
      setError("Please enter a task name.")
      return false;
    }

    if(/^\s*$/.test(date))    
    {
      setError("Please enter a task date.")
      return false;  
    }

    if(/^\s*$/.test(time))    
    {
      setError("Please enter a task time.")
      return false;  
    }

    var date_ = TimeToDate(date, time);

    if((date != currentDate || time != currentTime) && date_ < new Date())
    {
      setError("Date and time have already passed.")
      return false; 
    }

    editTask(index, name, desc, date);
    return true;
  }

  return (
    <div >
      {/* pop up window */}
      <Popup className="task-popup"
          trigger= {<button className="button"><p>Edit</p><p>✎</p></button>}
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

                      <div className='error-text'>
                          {error} 
                      </div>

                      <div className="button-holder">
                        <div>
                            <button className="button" onClick=
                              {() => {editTaskWrapper() && close()}}>
                                  Save
                            </button>
                        </div>
                        <div>
                            <button className="button" onClick={close}>
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
          trigger= {<button className="button"><p>Delete</p><p>🗑</p></button>}
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