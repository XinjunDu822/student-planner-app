// import './App.css';
import Popup from 'reactjs-popup';
import { useState, useCallback, useEffect } from 'react';
import 'reactjs-popup/dist/index.css';
import { InputField, DateInputField, DateToParams, FormatTime } from '../Utils';



export function Task({index, data, openEditPopup, openDeletePopup, completeTask, isComplete=false})
{
  var title = data.title; 
  var desc = data.desc; 
  var date = data.date;

  
  var [d, t] = DateToParams(date);
  var time = FormatTime(t);

  return (
    <div className = "task">

      <div>
        {title}
      </div>

      <div>
        {d}  
      </div>

      {
        !isComplete && (
          <>
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

                <button className="button" onClick={() => openEditPopup(index)}><p>Edit</p><p>✎</p></button>

              </div>

              <div>
                <button className="button" onClick={() => openDeletePopup(index)}><p>Delete</p><p>🗑</p></button>
              </div>   

            </div> 
          </>
        )
      }
      

    </div>
  );
}

export function DisplayTasks({tasks, openEditPopup, openDeletePopup, completeTask})
{
    return (
        <div id="TasksList">
        
            {tasks.map
            ((item, index) => 
                  <Task index={item.id} 
                        key={index}
                        data={item} 
                        openEditPopup={openEditPopup}
                        openDeletePopup={openDeletePopup}
                        completeTask={() => completeTask(item.id)}/>
            )
            }


        </div>

    );
} 

export function DisplayCompletedTasks({completedTasks, openDeletePopup})
{
    return (    
      <div id="TasksList">
    
        {completedTasks.slice().map
          ((item, index) => <Task index={item.id} 
                              key={index}
                              data={item}
                              openDeletePopup={openDeletePopup}
                              isComplete={true}/>
          )
        }

      </div>
    );
}


export function AddTaskPopup({addTask})
{
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  
  const [error, setError] = useState("");

  const resetVars = useCallback(() => {

    setError("");

    setTitle("");
    setDesc("");
    setDate("");
    setTime("");
  }, []); 


  const addTaskWrapper = async () => {

    var response = await addTask(title, desc, date, time);

    if(response !== true)
    {
      setError(response);
      return false;
    }
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
                          <InputField placeholderText = "Enter task name" value={title} setValue = {setTitle}/>
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
                                {async () => {const ok = await addTaskWrapper();
                                              if (ok) close();}}>
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


export function EditTaskPopup({task, editTask, closeEditPopup})
{
  const [displayName, setDisplayName] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  
  const [error, setError] = useState(null);

  useEffect(() => {

    if(!task)
      return;

    setError(null);
    setDisplayName(task.title)
    setTitle(task.title);
    var [d, t] = DateToParams(task.date);
    setDate(task.date);
    setTime(t);
    setDesc(task.desc);

  }, [task]);


  const editTaskWrapper = async () => {
    if(/^\s*$/.test(title))
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

    var response = await editTask(task.id, title, desc, date, time);

    if(response !== true)
    {
      setError(response);
      return false;
    }
    return true;
  }

  
  return (
    <div >
      {/* pop up window */}
      <Popup className="task-popup"
          open={!!task} onClose={closeEditPopup}
          modal>
          {
              close => (
                  <div className='modal'>
                      <div className='content'>
                          <h3>Editing {displayName}</h3>
                      </div>

                      <div className="task-popup-content">
                          <InputField placeholderText = "Enter task name" value={title} setValue = {setTitle}/>
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
                              {async () => {const ok = await editTaskWrapper();
                                            if (ok) close();}}>
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


export function DeleteTaskPopup({task, deleteTask, closeDeletePopup})
{
  

  return (
    <div >
      {/* pop up window */}
      <Popup className="task-popup"
          open={!!task} onClose={closeDeletePopup}
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
                              {() => {deleteTask(task.id); close();}}>
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