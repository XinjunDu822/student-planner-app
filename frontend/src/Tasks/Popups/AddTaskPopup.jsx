import Popup from 'reactjs-popup';
import { usePopupForm } from "./PopupForm";
import { PopupDisplay } from "./PopupDisplay";
import { createTask } from '../TaskService';

export function AddTaskPopup({user, reload})
{
  const {
    fields: { title, desc, date, time, error },
    actions: { setTitle, setDesc, setDate, setTime, submit, setForm },
  } = usePopupForm(createTask, reload);

  return (
    <div >
      {/* pop up window */}
      <Popup className="task-popup"
          // trigger= {<button className="button"><p>Add Task</p><p>+</p></button>}
          trigger= {<button className="button">Add Task</button>} onClose={setForm}
          modal>
          {
            close => (
              <div className='modal'>
                <PopupDisplay 
                  popupTitle="Add Task" 
                  title={title} 
                  setTitle={setTitle} 
                  desc={desc}
                  setDesc={setDesc}
                  date={date}
                  setDate={setDate}
                  time={time}
                  setTime={setTime}
                  error={error}
                  submit={() => submit({user, title, date, time, desc})}
                  close={close}
                />
              </div>
            )
          }
      </Popup>
    </div>
  );
}
