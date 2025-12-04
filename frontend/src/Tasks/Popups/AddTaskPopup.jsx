import Popup from 'reactjs-popup';
import { useState, useCallback } from 'react';
import { InputField, DateInputField } from '../../Utils';

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

    if(response.message)
    {
      setError(response.message);
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
