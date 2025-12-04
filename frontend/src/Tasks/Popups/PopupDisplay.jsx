import { InputField, DateInputField } from '../../Utils';

export function PopupDisplay({popupTitle, title, setTitle, desc, setDesc, date, setDate, time, setTime, error, submit, close})
{
  return (
    <>
      <div className='content'>
        <h3>{popupTitle}</h3>
      </div>

      <div className="task-popup-content">
        <InputField placeholderText="Enter task name" value={title} setValue={setTitle}/>
      </div >

      <div className="task-popup-content">
        <InputField placeholderText="Enter task description" value={desc} setValue={setDesc}/>
      </div >

      <div className="task-popup-content">
        <DateInputField placeholderText="Enter task date" value={date} setValue={setDate}/>          
      </div >

      <div className="task-popup-content">
        <InputField placeholderText="Enter task time" value={time} setValue={setTime} inputType="time"/>
      </div >

      <div className='error-text'>
        {error} 
      </div>

      <div className="button-holder">
        <div>
          <button className="button" onClick={async () => {const ok = await submit(); if (ok) close();}}>
            Save
          </button>
        </div>
        <div>
          <button className="button" onClick={close}>
              Cancel
          </button>
        </div>
      </div>
    </>
  );
}
