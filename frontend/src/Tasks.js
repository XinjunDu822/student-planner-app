import './App.css';
import Popup from 'reactjs-popup';
import { useState, useCallback, useEffect } from 'react';
import 'reactjs-popup/dist/index.css';
import { InputField, DateInputField, DateToParams, TimeToDate, FormatTime } from './Utils';


export function CompletedTask({index, data})
{
  var name = data.name; 
  var date = data.date;
  var [d, t] = DateToParams(date);
  // var time = FormatTime(t);

  return (
    <div className = "task">

      <div>
        {name}
      </div>

      <div>
        {d}  
      </div>

      {/* <div>
        {time}  
      </div> */}

      {/* <div>
        {desc}  
      </div> */}

      {/* <div>
        <div>
          <button className="button" onClick={completeTask}><p>Mark Complete</p><p>✓</p></button>
        </div>

        <div>
          <EditTaskPopup editTask={editTask} currentName={name} currentDate={date} currentTime={t} currentDesc={desc} index={index}/>
        </div>

        <div>
          <DeleteTaskPopup deleteTask={deleteTask}/>
        </div>     

      </div>  */}

    </div>
  );
}


export function Task({index, data, editTask, deleteTask, completeTask})
{
  var name = data.name; 
  var desc = data.desc; 
  var date = data.date;
  var [d, t] = DateToParams(date);
  var time = FormatTime(t);

  return (
    <div className = "task">

      <div>
        {name}
      </div>

      <div>
        {d}  
      </div>

      <div>
        {time}  
      </div>

      <div>
        {desc}  
      </div>

      <div>
        <div>
          <button className="button" onClick={completeTask}><p>Mark Complete</p><p>✓</p></button>
        </div>

        <div>
          <EditTaskPopup editTask={editTask} currentName={name} currentDate={date} currentTime={t} currentDesc={desc} index={index}/>
        </div>

        <div>
          <DeleteTaskPopup deleteTask={deleteTask}/>
        </div>     

      </div> 

    </div>
  );
}

export function DisplayTasks({tasks, editTask, deleteTask, completeTask, indexOffset})
{
    return (
        <div id="TasksList">
        
            {tasks.map
            ((item, index) => 
                  <Task index={index + indexOffset} 
                        key={index + indexOffset}
                        data={item} 
                        editTask={editTask}
                        deleteTask={() => deleteTask(index + indexOffset)}
                        completeTask={() => completeTask(index + indexOffset)}/>
            )
            }

        </div>
    );
}

export function DisplayCompletedTasks({completedTasks})
{
    if(completedTasks.length > 0)
    {
        return (
            
        <>
            <h3>Completed Tasks</h3>

            <div id="TasksList">
            
                {completedTasks.slice().reverse().map
                  ((item, index) => <CompletedTask index={index} 
                                      key={index}
                                      data={item}/>
                  )
                }

            </div>
        </>
        );
    }
    return (
        <h3><br/>You have no completed tasks right now.<br/> What a bum...</h3>
    );
}


export function AddTaskPopup({addTask})
{
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  
  const [error, setError] = useState("");

  const resetVars = useCallback(() => {
    setError("");
    setName("");
    setDesc("");
    setDate("");
    setTime("");
  }, []); 

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
          trigger= {<button className="button">Add Task</button>} onClose={resetVars}
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
                          <DateInputField placeholderText = "Enter task date" value={date} setValue = {setDate}/>          
                      </div >

                      <div className="task-popup-content">
                          <InputField placeholderText = "Enter task time" value={time} setValue = {setTime} inputType = "time"/>
                      </div >

                      <div className='error-text'>
                          {error} 
                      </div>

                      <div className="button-holder">
                        <div>
                            <button className="button" onClick=
                                {() => {addTaskWrapper() && close()}}>
                                    Save
                            </button>
                        </div>
                        <div>
                            <button className="button" onClick=
                                {() => close()}>
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

  const resetVars = useCallback(() => {
    setError("");
    setName(currentName);
    setDesc(currentDesc);
    setDate(currentDate);
    setTime(currentTime);
  }, [currentName, currentDesc, currentDate, currentTime]); 

  useEffect(() => {
    resetVars();
  }, [currentName, currentDesc, currentDate, currentTime]); 

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
                          <DateInputField placeholderText = "Enter task date" value={date} setValue = {setDate}/>          
                      </div >

                      <div className="task-popup-content">
                          <InputField placeholderText = "Enter task time" value={time} setValue = {setTime} inputType = "time"/>
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