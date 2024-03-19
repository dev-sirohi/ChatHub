import React from 'react'
import "./styles/navbarStyle.scss";
import { BsThreeDotsVertical } from "react-icons/bs";
import ReactLogo from "./assets/react.svg";
import { FaSearch } from "react-icons/fa";

const Navbar = () => {
    return (
        <div className='navbar-body'>
            <div className="navbar-left">
                <div className="navbar-friend-img"><img src={ReactLogo} alt="" /></div>
                <div className="navbar-friend-info">
                    <div className="navbar-friend-name">Dev</div>
                    <div className="navbar-friend-status">online</div>
                </div>
            </div>
            <div className="navbar-right">
                <div className="options"><FaSearch /></div>
                <div className="options"><BsThreeDotsVertical /></div>
            </div>
        </div>
    )
}

export default Navbar;