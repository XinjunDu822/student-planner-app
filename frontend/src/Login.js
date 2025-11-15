import logo from './new_logo_transparent.png';
import './App.css';
import Popup from 'reactjs-popup';
import { useState } from 'react';
import 'reactjs-popup/dist/index.css';
import { InputField } from './Utils';
import { Header } from './Header';


function checkRegisterReqs(username, password)
{
    const usernameTests = [/^.*[a-zA-Z].*[a-zA-Z].*[a-zA-Z].*$/]

    if(!usernameTests.every(r => r.test(username)))
        return false;

    const passwordTests = [/^.*[A-Z].*$/,
                           /^.*[a-z].*$/,
                           /^.*[\d].*$/,
                           /^.{6,}$/
                          ];
    
    if(!passwordTests.every(r => r.test(password)))
        return false;

    return true;
}



export function LoginPopup({login, isLoginValid})
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

  const loginWrapper = (username, password) =>
  {   
    var id = isLoginValid(username, password);
    if(id = null)
    {
        setError("Invalid login!");
        return;
    }

    login(username, id);
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

                      <div className='error-text'>
                          {error} 
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

export function RegisterPopup({login, isUsernameInDatabase, addUser})
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

  const register = (username, password) =>
  {
    if(isUsernameInDatabase(username))
    {
        setError("Username already in use!");
        return false;
    }
    
    if(!checkRegisterReqs(username, password))
    {
        setError("Username and/or password do not satisfy requirements!");
        return false;
    }

    var id = addUser(username, password);
    login(username, id);

    return true;
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

                          Password must have at least six characters, including at least one uppercase letter, lowercase letter, and number.<br/><br/> 
                      </div>

                      <div className='error-text'>
                          {error} 
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

export function LoginPage({login})
{

    

    return (
        <>
        <Header/>

        <main>

            <img className="large-icon" src={logo} alt="Logo"/>

            <div className="wide-button-holder">
                <LoginPopup login={login}/>
                <RegisterPopup login={login}/>
            </div>

        </main>
        </>
    );
};