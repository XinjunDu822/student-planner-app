import Popup from 'reactjs-popup';
import { useState, useEffect, useCallback } from 'react';
import { CompareDates } from '../../Utils';

import { usePopupForm } from "./PopupForm";
import { PopupDisplay } from "./PopupDisplay";

export function EditTaskPopup({task, editTask, closeEditPopup})
{
  const [displayName, setDisplayName] = useState(null);

  const {
    fields: { title, desc, date, time, error },
    actions: { setTitle, setDesc, setDate, setTime, submit, setForm },
  } = usePopupForm(editTask);

  useEffect(() => {
    if(!task)
      return;

    setDisplayName(task.title);
    setForm(task);
  }, [task]);


  const editTaskWrapper = useCallback(async () => {
    if(!title)
    {
      setError("Please enter a task name.")
      return false;
    }

    var args = {id: task.id, title, desc, date, time};

    //Checks if new date/time are the same as original
    if(CompareDates(date, time, task.date))
    {
      args.date = null;
      args.time = null;
    }

    var result = await submit(args);

    return result;
  }, [title, desc, date, time, submit])

  
  return (
    <div >
      {/* pop up window */}
      <Popup className="task-popup"
          open={!!task} onClose={closeEditPopup}
          modal>
          {
            close => (
                <div className='modal'>
                    <PopupDisplay 
                      popupTitle={`Editing ${displayName}`} 
                      title={title} 
                      setTitle={setTitle} 
                      desc={desc}
                      setDesc={setDesc}
                      date={date}
                      setDate={setDate}
                      time={time}
                      setTime={setTime}
                      error={error}
                      submit={editTaskWrapper}
                      close={close}/>
                </div>
            )
          }
      </Popup>
    </div>
  );
}

