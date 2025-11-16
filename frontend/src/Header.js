import logo from './new_logo_transparent.png';
import './App.css';
import 'reactjs-popup/dist/index.css';
import { useState, useEffect } from 'react';

export function Header({user, logout})
{

    const [isClicked, setIsClicked] = useState(false);

    const [isHovering, setIsHovering] = useState(false);

    function GlobalClickDetector() {

        useEffect(() => {
                const handleGlobalClick = (event) => {
                    if(isClicked || isHovering)
                    {
                        setIsClicked(!isClicked);
                    }
                };

                document.addEventListener('click', handleGlobalClick);

                // Clean up the event listener when the component unmounts
                return () => {
                document.removeEventListener('click', handleGlobalClick);
                };
            }, []);

    };

    return (
        <header>
            <div className="banner">
                <div className="title">
                    <h1>Class Planner App</h1>
                </div>
                {
                    user != null && (

                        <div className='profile-holder'>

                            <div className={"profile" + ((isClicked) ? " clicked" : "") }
                                    onMouseEnter={() => setIsHovering(true)}
                                    onMouseLeave={() => setIsHovering(false)}>
                                <GlobalClickDetector/>
                                <img className="icon" src={logo} alt="Logo"/>

                                <div className="username">
                                    {user}
                                </div>

                            </div>

                            {isClicked && (
                                <button className="button" onClick={() => {logout(); setIsClicked(false)}}>
                                    Logout
                                </button>
                            )}

                        </div>
                    )
                }
            </div>
        </header>     
    );
}