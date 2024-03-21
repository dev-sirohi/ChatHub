import React from 'react'
import "./styles/miniProfileStyle.scss";
import ReactLogo from './assets/react.svg';
import { useAuth } from './AuthContext';

const MiniProfile = () => {
    const { user } = useAuth();

    return (
        <div className='mini-profile-body'>
            <div className="mini-profile-top">
                <img src={ReactLogo} alt="" />
            </div>
            <div className="mini-profile-bottom">
                <p>{user.Username}</p>
            </div>
        </div>
    )
}

export default MiniProfile;