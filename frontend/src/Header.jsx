import logo from './new_logo_transparent.png';
import { useState, useEffect, useRef } from 'react';
import { getUser } from "./Login/AuthService";

export function Header({ user, logout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState( );
  const profileRef = useRef(null);

  // Fetch username when user changes
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
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
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
              className={`profile${isOpen ? ' clicked' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <img className="icon" src={logo} alt="Logo" />
              <div className="username">{name}</div>
            </div>

            {isOpen && (
              <button
                className="button"
                onClick={() => {
                  logout();
                  setIsOpen(false);
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
