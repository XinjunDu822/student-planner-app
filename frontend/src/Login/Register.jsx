import Popup from 'reactjs-popup';
import { useState, useCallback } from 'react';
import { InputField } from '../Utils';
import { signUp } from "./AuthService";

export function RegisterPopup({login})
{
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const reset = useCallback(() => {
    setError("");
    setUser("");
    setPwd("");
  }, []);

  const register = useCallback(async () => {
    const response = await signUp(user, pwd);

    if(!response.token)
    {
      setError(response.message);
      return;
    }

    login(response.token);
  }, [user, pwd, login]);

  return (
    <div >
      <Popup className="task-popup"
        trigger= {<button className="button">Register</button>} 
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

            <div className="task-popup-content">
              <InputField 
                placeholderText = "Username" 
                value={user} 
                setValue={setUser}
              />
            </div >

            <div className="task-popup-content">
              <InputField 
                placeholderText = "Password" 
                value={pwd} 
                setValue={setPwd} 
                inputType="password"
              />
            </div >

            <div className='error-text'>
              {error} 
            </div>

            <div className="button-holder">
              <button className="button" onClick={() => register(user, pwd)}>
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