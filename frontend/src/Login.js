import logo from './logo.png';
import './App.css';
import Popup from 'reactjs-popup';
import { useState } from 'react';
import 'reactjs-popup/dist/index.css';
import { InputField } from './Utils';

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
          trigger= {<button> Login </button>}
          modal>
          {
              close => (
                  <div className='modal'  style={{textAlign: 'center', margin: '20px'}}>
                      <div className='content'>
                          <h3>Welcome Back</h3>
                      </div>

                      <div className="task-popup-content" style={{margin:'0 auto'}}>
                          <InputField placeholderText = "Username" value={user} setValue = {setUser}/>
                      </div >

                      <div className="task-popup-content" style={{margin:'0 auto'}}>
                          <InputField placeholderText = "Password" value={pwd} setValue = {setPwd} inputType="password"/>
                      </div >

                      <div style={{ display: 'flex', gap: '10px', justifyContent:'center'}}>
                          <button onClick=
                              {() => {if(isLoginValid(user, pwd) && !login(user, pwd)) close();}}>
                                  Sign In
                          </button>
                          <button onClick=
                              {close}>
                                  Back
                          </button>
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
          trigger= {<button> Create Account </button>}
          modal>
          {
              close => (
                  <div className='modal' style={{margin: '20px'}}>
                      <div className='content'>
                          <h3 style={{textAlign: 'center'}}>Setup your account</h3><br/>

                          Username must have at least three letters.<br/>

                          Password must have at least six characters, including at least one uppercase letter, lowercase letter, and number.<br/> 
                      </div>

                      <div className="task-popup-content" style={{margin:'0 auto'}}>
                          <InputField placeholderText = "Username" value={user} setValue = {setUser}/>
                      </div >

                      <div className="task-popup-content" style={{margin:'0 auto'}}>
                          <InputField placeholderText = "Password" value={pwd} setValue = {setPwd} inputType="password"/>
                      </div >

                      <div style={{ display: 'flex', gap: '10px', justifyContent:'center'}}>
                          <button onClick=
                              {() => {if(!isUsernameInDataBase(user, pwd) && !login(user, pwd)) close();}}>
                                  Register
                          </button>
                          <button onClick=
                              {close}>
                                  Back
                          </button>
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
      <div className="App">
        <header>
          <h1>Class Planner App</h1>
          <hr></hr>
        </header>        
      </div>

      <div style={{textAlign: 'center'}}>

        <div>
            <LoginPopup login={login}/>
        </div>

        <div>
            <RegisterPopup login={LoginWrapper}/>
        </div>

      </div>
    </>
  );
};