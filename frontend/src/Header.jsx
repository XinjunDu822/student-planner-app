import logo from './new_logo_transparent.png';
import './App.css';
import { useState, useEffect } from 'react';
import { getUser } from "./Login/AuthService";

export function Header({user, logout})
{
    const [isClicked, setIsClicked] = useState(false);

    const [name, setName] = useState(null);

    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const getUsername = async () => {
            if(user == null)
            {
                setName(null);
                return;
            }

            var response = await getUser(user);
            if(!response.name)
            {
                setName(null);
                return;
            }
            setName(response.name);
        }
        getUsername();
    }, [user]);


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
                    <h1>Student Planner App</h1>
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
                                    {name}
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