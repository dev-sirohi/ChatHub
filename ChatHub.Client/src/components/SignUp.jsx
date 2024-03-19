import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from 'axios';
import baseUrl from './constants';
import { Link } from 'react-router-dom';

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        // create data
        const userData = {
            username: username,
            email: email,
            password: password
        }
        // send data to api
        axios.post(baseUrl + "usercrud/setuserdata", userData).then((response) => {
            console.log(response.data);

            // take to login page
            navigate('/login');
        })

        // reset the fields
        setUsername("");
        setEmail("");
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
                        <input type="text" id='email' placeholder='Email' value={email} onChange={handleEmailChange} required />
                        <div className="icon-box"><MdEmail className='icon' /></div>
                    </div>
                    <div className="input-box">
                        <input type="password" id='password' placeholder='Password' value={password} onChange={handlePasswordChange} required />
                        <div className="icon-box"><FaLock className='icon' /></div>
                    </div>
                </div>

                <button type='submit'>Submit</button>

                <div className="register-link">
                    <a href="#">Forgot Password</a>
                    <p>Already have an account? <Link to="login">Login</Link></p>
                </div>
            </form>
        </div>
    )
}

export default SignUp;