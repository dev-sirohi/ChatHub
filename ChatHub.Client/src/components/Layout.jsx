import React, { useEffect, useState } from 'react'
import Sidebar from "./Sidebar";
import Navbar from './Navbar';
import "./styles/layoutStyle.scss"
import { useAuth } from './AuthContext';
import axios from 'axios';
import baseUrl from './constants';

const Layout = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    console.log("this is layout running");
    console.log(localStorage.getItem('user'));
    let userData = JSON.parse(localStorage.getItem('user'));
    console.log(userData);
    useEffect(() => {
        axios.post(baseUrl + "usercrud/setsession", userData).then((response) => {
            console.log("user set to backend in layout reload");
            setIsLoading(false);
        });
    }, []);

    return (
        isLoading
            ?
            <p>Loading...</p>
            :
            <div className='layout-body'>
                <div className="sidebar"><Sidebar /></div>
                <div className='not-sidebar'>
                    <div className="navbar"><Navbar /></div>
                    <div className="main-content">{children}</div>
                </div>
            </div>
    )
}

export default Layout;