import './App.css';
import Popup from 'reactjs-popup';
import { useState } from 'react';
import 'reactjs-popup/dist/index.css';
import { InputField } from './Utils';
import { signUp, signIn } from "./AuthService";
import { jwtDecode } from "jwt-decode";

export function LoginPopup({login})
{
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  const [error, setError] = useState("");

  const reset = () =>
  {
    setError("");
    setUser("");
    setPwd("");
  }

  const loginWrapper = async (username, password) =>
  {   
    var response = await signIn(username, password);

    if(!response.token)
    {
        setError(response.message);
        return;
    }

    login(response.name);
  }


  return (
    <div >
      {/* pop up window */}
      <Popup className="task-popup"
          trigger= {<button className="button"> Login </button>} onClose={reset}
          modal>
          {
              close => (
                  <div className='modal'  style={{textAlign: 'center', margin: '20px'}}>
                      <div className='content'>
                          <h3>Welcome Back</h3>
                      </div>

                      <div className="task-popup-content">
                          <InputField placeholderText = "Username" value={user} setValue = {setUser}/>
                      </div >

                      <div className="task-popup-content">
                          <InputField placeholderText = "Password" value={pwd} setValue = {setPwd} inputType="password"/>
                      </div >

                      <div className='error-text'>
                          {error} 
                      </div>

                      <div className="button-holder">
                        <div>
                            <button className="button" onClick=
                                {() => loginWrapper(user, pwd)}>
                                    Sign In
                            </button>
                        </div>
                        <div>
                            <button className="button" onClick=
                                {close}>
                                    Back
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

export function RegisterPopup({login, addUser})
{
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  const [error, setError] = useState("");

  const reset = () =>
  {
    setError("");
    setUser("");
    setPwd("");
  }

  const register = async (username, password) =>
  {
    var response = await signUp(username, password);

    if(!response.token)
    {
        setError(response.message);
        return;
    }

    login(response.name);
  }


  return (
    <div >
      {/* pop up window */}
      <Popup className="task-popup"
          trigger= {<button className="button"> Create Account </button>} onClose={reset}
          modal>
          {
              close => (
                  <div className='modal' style={{margin: '20px'}}>
                      <div className='content'>
                          <h3 style={{textAlign: 'center'}}>Setup your account</h3><br/>

                          Username must have at least three letters.<br/>

                          Password must have at least six characters, including at least one uppercase letter, one lowercase letter, one number, and one special character.<br/><br/> 
                      </div>

                      <div className="task-popup-content">
                          <InputField placeholderText = "Username" value={user} setValue = {setUser}/>
                      </div >

                      <div className="task-popup-content">
                          <InputField placeholderText = "Password" value={pwd} setValue = {setPwd} inputType="password"/>
                      </div >

                      <div className='error-text'>
                          {error} 
                      </div>


                      <div className="button-holder">
                        <div>
                            <button className="button" onClick=
                                {() => register(user, pwd)}>
                                    Register
                            </button>
                        </div>
                        <div>
                            <button className="button" onClick=
                                {close}>
                                    Back
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