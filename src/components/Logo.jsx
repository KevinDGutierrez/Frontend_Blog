import logo from '../assets/img/Logo.png';

export const Logo = ({ text }) => {
    return (
        <div className="auth-form-logo-container">
            <img src={ logo } alt="Logo" style={{width: "150px", height: "150px"}}/>
            <span>{ text }</span>
        </div>
    )
}