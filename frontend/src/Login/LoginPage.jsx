import logo from '../new_logo_transparent.png';
import { LoginPopup } from './Login';
import { RegisterPopup } from './Register';


export function LoginPage({saveToken})
{
    return (
        <main>
            <img className="large-icon" src={logo} alt="Logo"/>

            <div className="wide-button-holder">
                <LoginPopup saveToken={saveToken}/>
                <RegisterPopup saveToken={saveToken}/>
            </div>
        </main>
    );
};