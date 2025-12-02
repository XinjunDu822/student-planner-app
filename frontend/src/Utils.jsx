import './App.css';
// import Popup from 'reactjs-popup';
import { useState } from 'react';
import 'reactjs-popup/dist/index.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function addLeadingZero(number) {
  return String(number).padStart(2, '0');
}

export function DateToParams(date)
{

  var mm = addLeadingZero(date.getMonth() + 1);
  var dd = addLeadingZero(date.getDate());
  var yy = addLeadingZero(date.getFullYear().toString().substr(-2));

  var h = addLeadingZero(date.getHours());
  var m = addLeadingZero(date.getMinutes());

  return [`${mm}/${dd}/${yy}`, `${h}:${m}`];
  // return [new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()), `${h}:${m}`]

}

export function FormatTime(time)
{
  if(time === "") return "";

  var [h, m] = time.split(":", 2);

  var p = h < 12 ? "AM" : "PM";

  h = h % 12;

  if(h === 0) h = 12;

  return `${addLeadingZero(h)}:${m} ${p}`;
}


export function InputField({placeholderText, value, setValue, inputType="text"})
{
  const [isEmpty, setIsEmpty] = useState(value === "");

  if(!isEmpty && value === "")
  {
    setIsEmpty(true);
  }


  const handleInputChange = (event) => {
    setValue(event.target.value);
  };

  if(inputType === "time" && isEmpty)
  {
    return <input className="task-popup-content" type="text" placeholder={placeholderText} onClick={() => {setValue("00:00"); setIsEmpty(false)}} readOnly/>;
  }

  return <input className="task-popup-content" type={inputType} value={value} placeholder={placeholderText} onChange={handleInputChange}/>;
};

export function DateInputField({placeholderText, value, setValue, inputType="text"}) 
{
  const [showPicker, setShowPicker] = useState(false);
  // const [selectedDate, setSelectedDate] = useState(null);
  // const [dateValue, setDateValue] = useState("");

  // if(selectedDate == null && value != "")
  // {
    
  //   setSelectedDate();
  // }

  const handleDateSelection = (date) => {

    setValue(date);
    // setSelectedDate(date);
    // setValue(date.toLocaleDateString('en-US', {
    //           year: '2-digit', // 'yy'
    //           month: '2-digit', // 'mm'
    //           day: '2-digit'    // 'dd'
    //         }));
    setShowPicker(false);
  }

  return (

    <div className="datepicker-holder">

     <input className="task-popup-content" placeholder={placeholderText} value={value === "" ? "" : DateToParams(value)[0]} onClick={() => setShowPicker(true)} onChange = {(e) => setValue(e.target.value)} readOnly/>

                {showPicker && (
                  <DatePicker selected = {value} 
                  onChange = {handleDateSelection}
                  // onKeyDown={exitPicker}
                  inline/>
                )}

    </div>
        );
};

export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}