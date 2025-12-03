import './App.css';
import './index.css';
import { useState, useCallback } from 'react';
import 'reactjs-popup/dist/index.css';
import { LoginPage } from './Login/LoginPage';
import { TasksPage } from './Tasks/TasksPage';
import { Header } from './Header';
import { logout as authLogout } from "./Login/AuthService";


export default function App() {
  const [user, setUser] = useState(null);

  const login = useCallback((user) => {
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await authLogout(user);
  }, [user]);

  return (
    <>
      <Header user={user} logout={logout}/>

      {user ? (
        <TasksPage user={user} logout={logout}/>
      ) : (
        <LoginPage login={login}/>
      )}
    </>
  );
}


