import React from 'react'
import Sidebar from "./Sidebar";
import Navbar from './Navbar';
import "./styles/layoutStyle.scss"

const Layout = ({ children }) => {
    return (
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