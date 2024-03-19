import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";
import axios from 'axios';
import baseUrl from './constants';
import { Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        // create data
        const userData = {
            username: username,
            password: password
        }
        // send data to api
        // axios already parses it
        axios.post(baseUrl + "usercrud/authenticateuser", userData).then((response) => {
            let data = response.data;
            alert(data.authenticateMessage);
            if (data.authenticated) {
                // login and move to main chat page
                navigate("/home");
            } else {
                // clear fields
            }
        })

        // reset the fields
        setUsername("");
        setPassword("");
    }

    return (
        <div className="wrapper">
            <form onSubmit={handleSubmit}>
                <div className="data-box">
                    <div className="input-box">
                        <input type="text" id='username' placeholder='Username' value={username} onChange={handleUsernameChange} required />
                        <div className="icon-box"><FaUser className='icon' /></div>
                    </div>
                    <div className="input-box">
                        <input type="password" id='password' placeholder='Password' value={password} onChange={handlePasswordChange} required />
                        <div className="icon-box"><FaLock className='icon' /></div>
                    </div>
                </div>

                <button type='submit'>Submit</button>

                <div className="register-link">
                    <a href="#">Forgot Password</a>
                    <p>Don't have an account? <Link to="/">SignUp</Link></p>
                </div>
            </form>
        </div>
    )
}

export default Login;