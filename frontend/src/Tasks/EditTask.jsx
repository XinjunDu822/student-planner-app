import Popup from 'reactjs-popup';
import { useState, useEffect } from 'react';
import { InputField, DateInputField, DateToParams } from '../Utils';


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
    if(!title)
    {
      setError("Please enter a task name.")
      return false;
    }

    var originalDate = task.date;

    var [d, t] = DateToParams(originalDate);

    var response;

    if(t == time && 
      originalDate.getFullYear() === date.getFullYear() &&
      originalDate.getMonth() === date.getMonth() &&
      originalDate.getDate() === date.getDate())
    {
      response = await editTask(task.id, title, desc, null, null);
    }
    else
    {
      response = await editTask(task.id, title, desc, date, time);
    }

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

