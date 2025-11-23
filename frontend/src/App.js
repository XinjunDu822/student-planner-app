import './App.css';
import './index.css';
import { useState } from 'react';
import 'reactjs-popup/dist/index.css';
import { LoginPage } from './LoginManager';
import { TasksPage } from './TaskManager';
import { Header } from './Header';

export default function App() {
  const [user, setUser] = useState(null);

  const login = function(user)
  {
    setUser(user);
  };

  const logout = function()
  {
    setUser(null);
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
            <Header user={user} logout={logout}/>
            <TasksPage/>
          </>
  );

}


