import logo from './logo.png';
import './App.css';
import Popup from 'reactjs-popup';
import { useState } from 'react';
import 'reactjs-popup/dist/index.css';
import { InputField } from './Utils';
import { Header } from './Header';


function isUsernameInDataBase(username)
{
    return false;
}

function isLoginValid(username, password)
{
    return true;
}



function LoginPopup({login})
{
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  return (
    <div >
      {/* pop up window */}
      <Popup className="task-popup"
          trigger= {<button className="button"> Login </button>}
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

                      <div className="button-holder">
                        <div>
                            <button className="button" onClick=
                                {() => {if(isLoginValid(user, pwd) && !login(user, pwd)) close();}}>
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

function RegisterPopup({login})
{
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  return (
    <div >
      {/* pop up window */}
      <Popup className="task-popup"
          trigger= {<button className="button"> Create Account </button>}
          modal>
          {
              close => (
                  <div className='modal' style={{margin: '20px'}}>
                      <div className='content'>
                          <h3 style={{textAlign: 'center'}}>Setup your account</h3><br/>

                          Username must have at least three letters.<br/>

                          Password must have at least six characters, including at least one uppercase letter, lowercase letter, and number.<br/> 
                      </div>

                      <div className="task-popup-content">
                          <InputField placeholderText = "Username" value={user} setValue = {setUser}/>
                      </div >

                      <div className="task-popup-content">
                          <InputField placeholderText = "Password" value={pwd} setValue = {setPwd} inputType="password"/>
                      </div >

                      <div className="button-holder">
                        <div>
                            <button className="button" onClick=
                                {() => {if(!isUsernameInDataBase(user, pwd) && !login(user, pwd)) close();}}>
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

export function LoginPage({login})
{
  function LoginWrapper(username, password)
  {
    const usernameTests = [/^.*[a-zA-Z].*[a-zA-Z].*[a-zA-Z].*$/]

    if(!usernameTests.every(r => r.test(username)))
        return 1;

    const passwordTests = [/^.*[A-Z].*$/,
                           /^.*[a-z].*$/,
                           /^.*[\d].*$/,
                           /^.{6,}$/
                          ];
    
    if(!passwordTests.every(r => r.test(password)))
        return 1;

    login(username, password);
  }


  return (
    <>
      <Header/>

      <main>

        <img className="icon" src={process.env.PUBLIC_URL + "/new_logo_transparent.png"} alt="Logo"/>

        <div className="wide-button-holder">
            <LoginPopup login={login}/>
            <RegisterPopup login={LoginWrapper}/>
        </div>

      </main>
    </>
  );
};