import logo from './new_logo_transparent.png';
import './App.css';
import Popup from 'reactjs-popup';
import { useState } from 'react';
import 'reactjs-popup/dist/index.css';
import { Header } from './Header';
import { LoginPopup, RegisterPopup } from './Login';
import { DummyUsers } from './DummyData';


export function LoginPage({login})
{
    const [users, setUsers] = useState(DummyUsers);

    const isUsernameInDatabase = (username) => {

        for(var i = 0; i < users.length; i++)
        {
            if(users[i].usr == username)
                return true;
        }

        return false;
    }

    const addUser = (username, password) => {

        var updatedUsers = [...users];

        var id = updatedUsers.length + 1;

        updatedUsers.push({id: id, usr: username, pwd: password});

        setUsers(updatedUsers);

        return updatedUsers[updatedUsers.Length - 1];
    }

    const isLoginValid = (username, password) => {
        
        for(var i = 0; i < users.length; i++)
        {
            if(users[i].usr == username)
            {
                if(users[i].pwd == password)
                    return users[i];
                break;
            }
        }

        return null;
    }


    return (
            <main>

                <img className="large-icon" src={logo} alt="Logo"/>

                <div className="wide-button-holder">
                    <LoginPopup login={login} isLoginValid={isLoginValid}/>
                    <RegisterPopup login={login} isUsernameInDatabase={isUsernameInDatabase} addUser={addUser}/>
                </div>

            </main>
    );
};