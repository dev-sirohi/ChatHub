import React from 'react'
import "./styles/miniProfileStyle.scss";
import ReactLogo from './assets/react.svg';

const MiniProfile = () => {
    return (
        <div className='mini-profile-body'>
            <div className="mini-profile-top">
                <img src={ReactLogo} alt="" />
            </div>
            <div className="mini-profile-bottom">
                <p>Username</p>
            </div>
        </div>
    )
}

export default MiniProfile;