import React, { useEffect, useState } from 'react'
import Sidebar from "./Sidebar";
import Navbar from './Navbar';
import "./styles/layoutStyle.scss"
import { useAuth } from './AuthContext';
import axios from 'axios';
import baseUrl from './constants';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [toLogout, setToLogout] = useState(false);

    useEffect(() => {
        if (toLogout) {
            console.log("logging out");
            logout();
            navigate("/login");
            setToLogout(false);
        }
    }, [toLogout]);

    let userData = JSON.stringify(user);
    useEffect(() => {
        axios.post(baseUrl + "usercrud/setsession", userData, {
            headers: {
                'Content-Type': 'application/json' // Set Content-Type header
            }
        }).then((response) => {
            console.log("user set to backend in layout reload");
            setIsLoading(false);
        })
    }, [isLoading]);

    return (
        isLoading
            ?
            <p>Loading...</p>
            :
            <div className='layout-body'>
                <div className="sidebar"><Sidebar onLogout={setToLogout} /></div>
                <div className='not-sidebar'>
                    <div className="navbar"><Navbar /></div>
                    <div className="main-content">{children}</div>
                </div>
            </div>
    )
}

export default Layout;