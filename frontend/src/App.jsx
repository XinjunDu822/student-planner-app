import './App.css';
import './index.css';
import { useState } from 'react';
import 'reactjs-popup/dist/index.css';
import { LoginPage } from './Login/LoginPage';
import { TasksPage } from './Tasks/TasksPage';
import { Header } from './Header';
import { logout } from "./Login/AuthService";


export default function App() {
  const [user, setUser] = useState(null);

  const login = function(user)
  {
    setUser(user);
  };

  const logout_ = async function()
  {
    setUser(null);
    await logout(user);
  };

  if(user === null)
  {
    return (<>
              <Header/>
              <LoginPage login={login}/>
            </>
    );
  }

  return (<>
            <Header user={user} logout={logout_}/>
            <TasksPage user={user} logout={logout_}/>
          </>
  );

}


