import Popup from 'reactjs-popup';
import { useState, useCallback } from 'react';
import { InputField } from '../Utils';
import { signIn as serverSignIn } from "../Auth/AuthService";
import { useLoginForm } from "./LoginForm";

export function LoginPopup({saveToken})
{
  const {
    fields: { username, password, error },
    actions: { setUsername, setPassword, submit, reset },
  } = useLoginForm(serverSignIn, saveToken);

  return (
    <div >
      <Popup className="task-popup"
        trigger= {<button className="button"> Login </button>} 
        onClose={reset}
        modal
      >
        {close => (
          <div className='modal'>
            <div className='content'>
              <h3>Welcome Back</h3>
            </div>

            <div className="task-popup-content">
              <InputField 
                placeholderText="Username" 
                value={username} 
                setValue={setUsername}
              />
            </div >

            <div className="task-popup-content">
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
                Sign In
              </button>
              
              <button className="button" onClick={submit}>
                Back
              </button>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
}