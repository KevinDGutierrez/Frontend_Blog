import { useState } from "react";
import { Logo } from './Logo';
import { Input } from "./Input";
import { useNavigate } from 'react-router-dom';
import {
    validateUsername,
    validateEmail,
    validatePassword,
    validateConfirPassword,
    validateUsernameMessage,
    emailValidationMessage,
    validatePasswordMessage,
    passwordConfirmationMessage,
    validatePhone
} from '../shared/validators';
import { useRegister } from "../shared/hooks";
import videoRegister from "../assets/video/login.mp4";

export const Register = ({ switchAuthHandler }) => {
    const { register, isLoading } = useRegister();
    const navigate = useNavigate();

    const [formState, setFormState] = useState({
        name: {
            value: '',
            isValid: true, 
            showError: false,
        },
        surname: {
            value: '',
            isValid: true,
            showError: false,
        },
        username: {
            value: '',
            isValid: false,
            showError: false,
        },
        email: {
            value: '',
            isValid: false,
            showError: false,
        },
        password: {
            value: '',
            isValid: false,
            showError: false,
        },
        passwordConfir: {
            value: '',
            isValid: false,
            showError: false,
        },
        phone: {
            value: '',
            isValid: false,
            showError: false,
        }
    });

    const handleInputValueChange = (value, field) => {
        setFormState((prevState) => ({
            ...prevState,
            [field]: {
                ...prevState[field],
                value
            }
        }));
    };

    const handleInputValidationOnBlur = (value, field) => {
        let isValid = false;
        switch (field) {
            case 'name':
            case 'surname':
                isValid = true;
                break;
            case 'username':
                isValid = validateUsername(value);
                break;
            case 'email':
                isValid = validateEmail(value);
                break;
            case 'password':
                isValid = validatePassword(value);
                break;
            case 'passwordConfir':
                isValid = validateConfirPassword(formState.password.value, value);
                break;
            case 'phone':
                isValid = validatePhone(value);
                break;
            default:
                break;
        }
        setFormState((prevState) => ({
            ...prevState,
            [field]: {
                ...prevState[field],
                isValid,
                showError: !isValid
            }
        }));
    };

    const handleRegister = (event) => {
        event.preventDefault();

        const data = {
            name: formState.name.value,
            surname: formState.surname.value,
            username: formState.username.value,
            email: formState.email.value,
            password: formState.password.value,
            phone: formState.phone.value,
            role: "EMPLOYEE"
        };

        console.log("Datos enviados:", data);
        register(data);
        navigate('/dashboard');
    };

    const isSubmitButtonDisable = isLoading ||
        !formState.email.isValid ||
        !formState.username.isValid ||
        !formState.password.isValid ||
        !formState.passwordConfir.isValid ||
        !formState.phone.isValid;

    return (
        <div className="login-container">
            <div className="video-background">
                <video autoPlay loop muted playsInline>
                    <source src={videoRegister} type="video/mp4" />
                </video>
            </div>
            <Logo text={'Register Storage G1'} />
            <form className="auth-form">
                <Input
                    field='name'
                    label='Name'
                    value={formState.name.value}
                    onChangeHandler={handleInputValueChange}
                    type='text'
                    onBlurHandler={handleInputValidationOnBlur}
                    showErrorMessage={false}
                />
                <Input
                    field='surname'
                    label='Surname'
                    value={formState.surname.value}
                    onChangeHandler={handleInputValueChange}
                    type='text'
                    onBlurHandler={handleInputValidationOnBlur}
                    showErrorMessage={false}
                />
                <Input
                    field='username'
                    label='Username'
                    value={formState.username.value}
                    onChangeHandler={handleInputValueChange}
                    type='text'
                    onBlurHandler={handleInputValidationOnBlur}
                    showErrorMessage={formState.username.showError}
                    validationMessage={validateUsernameMessage}
                />
                <Input
                    field='email'
                    label='Email'
                    value={formState.email.value}
                    onChangeHandler={handleInputValueChange}
                    type='text'
                    onBlurHandler={handleInputValidationOnBlur}
                    showErrorMessage={formState.email.showError}
                    validationMessage={emailValidationMessage}
                />
                <Input
                    field='password'
                    label='Password'
                    value={formState.password.value}
                    onChangeHandler={handleInputValueChange}
                    type='password'
                    onBlurHandler={handleInputValidationOnBlur}
                    showErrorMessage={formState.password.showError}
                    validationMessage={validatePasswordMessage}
                />
                <Input
                    field='passwordConfir'
                    label='Password Confirmation'
                    value={formState.passwordConfir.value}
                    onChangeHandler={handleInputValueChange}
                    type='password'
                    onBlurHandler={handleInputValidationOnBlur}
                    showErrorMessage={formState.passwordConfir.showError}
                    validationMessage={passwordConfirmationMessage}
                />
                <Input
                    field='phone'
                    label='Phone'
                    value={formState.phone.value}
                    onChangeHandler={handleInputValueChange}
                    type='text'
                    onBlurHandler={handleInputValidationOnBlur}
                    showErrorMessage={formState.phone.showError}
                    validationMessage="El número de teléfono debe tener 8 caracteres"
                />
                <button onClick={handleRegister} disabled={isSubmitButtonDisable}>
                    Register
                </button>
            </form>
            <span onClick={switchAuthHandler} className="auth-form-switch-label">
                already have an account ? sign up
            </span>
        </div>
    );
};
