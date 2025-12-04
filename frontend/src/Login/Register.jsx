import Popup from 'reactjs-popup';
import { useState, useCallback } from 'react';
import { InputField } from '../Utils';
import { signUp as serverSignUp } from "../Auth/AuthService";
import { useLoginForm } from "./LoginForm";


export function RegisterPopup({saveToken})
{
  const {
    fields: { username, password, error },
    actions: { setUsername, setPassword, submit, reset },
  } = useLoginForm(serverSignUp, saveToken);

  return (
    <div >
      <Popup className="task-popup"
        trigger= {<button className="button">Create Account</button>} 
        onClose={reset}
        modal
      >
        {close => (
          <div className='modal'>
            <div className='content'>
              <h3>Setup your account</h3>
              <br/>
              <p>Username must have at least three letters.</p>
              <p>
                Password must have at least six characters and include:
                <br />• One uppercase letter
                <br />• One lowercase letter
                <br />• One number
                <br />• One special character
              </p>
              <br/> 
            </div>

            <div className="task-popup-content username-field">
              <InputField 
                placeholderText="Username" 
                value={username} 
                setValue={setUsername}
              />
            </div >

            <div className="task-popup-content password-field">
              <InputField 
                placeholderText="Password" 
                value={password} 
                setValue={setPassword} 
                inputType="password"
              />
            </div >

            <div className='error-text'>
              {error} 
            </div>

            <div className="button-holder">
              <button className="button" onClick={submit}>
                Register
              </button>
              
              <button className="button" onClick={close}>
                Back
              </button>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
}