export function Header()
{
    return (
        <header>
<<<<<<< Updated upstream
            <h1>Class Planner App</h1>
            <hr></hr>
=======
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
                                    {user.usr}
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
>>>>>>> Stashed changes
        </header>     
    );
}