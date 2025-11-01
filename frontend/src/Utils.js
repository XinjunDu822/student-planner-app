import './App.css';
import Popup from 'reactjs-popup';
import { useState } from 'react';
import 'reactjs-popup/dist/index.css';

export function InputField({placeholderText, value, setValue, styles, inputType="text"})
{
  const handleInputChange = (event) => {
    setValue(event.target.value);
  };

  return <input className="task-popup-content" type={inputType} value={value} placeholder={placeholderText} onChange={handleInputChange} style={styles}/>;
};