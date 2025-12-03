import './App.css';
import { useState, useEffect, useCallback } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const addLeadingZero = (number) => String(number).padStart(2, '0');
//Separates date object into date portion and time portion and return both
export function DateToParams(date)
{
  var mm = addLeadingZero(date.getMonth() + 1);
  var dd = addLeadingZero(date.getDate());
  var yy = addLeadingZero(date.getFullYear().toString().substr(-2));

  var h = addLeadingZero(date.getHours());
  var m = addLeadingZero(date.getMinutes());

  return [`${mm}/${dd}/${yy}`, `${h}:${m}`];
}

//Parses date military time into AM/PM format
export function FormatTime(time)
{
  if(!time) return "";

  let [h, m] = time.split(":", 2);
  h = Number(h);

  var p = h < 12 ? "AM" : "PM";

  h = h % 12 || 12;

  return `${addLeadingZero(h)}:${m} ${p}`;
}

//Custom input component that accomodates time 
export function InputField({
  placeholderText, 
  value, 
  setValue, 
  inputType="text"})
{
  const handleInputChange = (event) => setValue(event.target.value);

  if(inputType === "time" && !value)
  {
    return (
      <input 
        className="task-popup-content" 
        type="text" 
        value=""
        placeholder={placeholderText} 
        onClick={() => setValue("00:00")} 
        readOnly
      />
    );
  }

  return (
    <input 
      className="task-popup-content" 
      type={inputType} 
      value={value} 
      placeholder={placeholderText} 
      onChange={handleInputChange}
    />
  );
};

//Custom input component for picking dates
export function DateInputField({
  placeholderText, 
  value, 
  setValue, 
  emptyOnExit=false}) 
{
  const [isOpen, setIsOpen] = useState(false);

  const closePicker = useCallback(() => {
    setIsOpen(false);
    if(emptyOnExit)
    {
      setValue("");
    } 
  }, [emptyOnExit, setValue]);

  const onEscape = useCallback((event) => {
    if (event.key === 'Escape' && isOpen) {
      closePicker();
    }
  }, [isOpen, closePicker]);

  useEffect(() => {
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [onEscape]);

  const handleDateSelection = (date) => {
    setValue(date);
    setIsOpen(false);
  }

  return (

    <div className="datepicker-holder">
     <input 
        className="task-popup-content" 
        placeholder={placeholderText} 
        value={value ? DateToParams(value)[0] : ""} 
        onClick={() => setIsOpen(true)} 
        readOnly/>

        {isOpen && (
          <DatePicker
            selected={value} 
            onChange={handleDateSelection}
            onClickOutside={closePicker}
            inline
          />
        )}
    </div>
  );
}; 
