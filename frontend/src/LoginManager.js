import logo from './new_logo_transparent.png';
import './App.css';
import { useState } from 'react';
import 'reactjs-popup/dist/index.css';
import { LoginPopup, RegisterPopup } from './Login';
import { DummyUsers } from './DummyData';


export function LoginPage({login})
{
    const [users, setUsers] = useState(DummyUsers);

    return (
            <main>

                <img className="large-icon" src={logo} alt="Logo"/>

                <div className="wide-button-holder">
                    <LoginPopup login={login}/>
                    <RegisterPopup login={login}/>
                </div>

            </main>
    );
};