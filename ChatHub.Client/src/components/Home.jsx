import React from 'react'
import "./styles/homeStyle.scss";
import { MdEmojiEmotions } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import ChatBox from './ChatBox';

const Home = () => {
    return (
        <div className='home-body'>
            <div className="chat-box">
                <ChatBox />
            </div>
            <div className="chat-bar">
                <div className="emoji-icon"><MdEmojiEmotions /></div>
                <div className="type-input"><input type="text" /></div>
                <div className="send-btn"><button type='button'><IoSend /></button></div>
            </div>
        </div>
    )
}

export default Home;