import logo from './new_logo_transparent.png';
import './App.css';
import { useState, useEffect } from 'react';
import { getUser } from "./Login/AuthService";

export function Header({ user, logout }) {
  const [isClicked, setIsClicked] = useState(false);
  const [name, setName] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const getUsername = async () => {
      if (!user) {
        setName(null);
        return;
      }
      const response = await getUser(user);
      setName(response.name || null);
    };
    getUsername();
  }, [user]);

  // Handle global click to close dropdown
  useEffect(() => {
    const handleGlobalClick = (event) => {
      // Only close dropdown if clicked outside the profile div
      const profileDiv = document.querySelector('.profile');
      if (profileDiv && !profileDiv.contains(event.target)) {
        setIsClicked(false);
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return (
    <header>
      <div className="banner">
        <div className="title">
          <h1>Student Planner App</h1>
        </div>
        {user && (
          <div className="profile-holder">
            <div
              className={`profile${isClicked ? ' clicked' : ''}`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => setIsClicked(!isClicked)}
            >
              <img className="icon" src={logo} alt="Logo" />
              <div className="username">{name}</div>
            </div>

            {isClicked && (
              <button
                className="button"
                onClick={() => {
                  logout();
                  setIsClicked(false);
                }}
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
