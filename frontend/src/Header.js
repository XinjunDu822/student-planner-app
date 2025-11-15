import logo from './new_logo_transparent.png';
import './App.css';
import 'reactjs-popup/dist/index.css';

export function Header({user})
{
    return (
        <header>
            <div className="banner">
                <h1>Class Planner App</h1>

                {
                    user != null && (

                        <div className='profile'>
                            <img className="icon" src={logo} alt="Logo"/>

                            <div className="username">
                                {user}
                            </div>
                        </div>
                    )
                }
            </div>
        </header>     
    );
}