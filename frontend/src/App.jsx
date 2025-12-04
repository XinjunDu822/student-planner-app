import './App.css';
import './index.css';
import { useState, useCallback } from 'react';
import 'reactjs-popup/dist/index.css';
import { LoginPage } from './Login/LoginPage';
import { TasksPage } from './Tasks/TasksPage';
import { Header } from './Header';
import { useAuth } from './Auth/Auth';

export default function App() {
  const { user, saveToken, resetToken, isAuthenticated } = useAuth();

  return (
    <>
      <Header user={user} logout={resetToken}/>

      {isAuthenticated ? (
        <TasksPage user={user} logout={resetToken}/>
      ) : (
        <LoginPage saveToken={saveToken}/>
      )}
    </>
  );
}


