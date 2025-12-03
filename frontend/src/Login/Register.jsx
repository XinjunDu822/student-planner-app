import Popup from 'reactjs-popup';
import { useState } from 'react';
import 'reactjs-popup/dist/index.css';
import { InputField } from '../Utils';
import { signUp } from "./AuthService";

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

    login(response.token);
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