import React from 'react'
import "./styles/friendListStyle.scss";
import reactLogo from "./assets/react.svg";
import axios from 'axios';
import baseUrl from './constants';
import { TiUserAdd } from "react-icons/ti";
import { MdBlock } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

const FriendList = ({ friendList }) => {
    // when friend-block clicked, send friendid to chatbox
    // then chatbox will display the last 100 messages

    console.log(friendList);

    let data = {
        Username: friendList.length == 0 ? "" : friendList[0].Username
    }

    const sendFriendRequest = (event) => {
        axios.post(baseUrl + "usercrud/sendfriendrequest", data).then((response) => {
            console.log("friend request sent!");
            // change button type
        });
    }

    const blockUser = (event) => {
        console.log("user block initiated");
        axios.post(baseUrl + "usercrud/blockuser", data).then((response) => {
            console.log("user blocked");
        });
    }

    return (
        <div className="friend-list">
            {
                friendList.map((friend) => (
                    friend.isNewFriend
                        ?
                        friend.Username === ""
                            ?
                            <div className="no-user-found">No Users Found</div>
                            :
                            friend.requested
                                ?
                                <div className="friend-block">
                                    <div className="friend-img"><img src={reactLogo} alt="" /></div>
                                    <div className="global-user-info">
                                        <div className="friend-name">{friend.Username}</div>
                                        <div>
                                            <button id='add-user-btn' className='global-user-btns' type='button' onClick={sendFriendRequest}><TiUserAdd /></button>
                                            <button id='block-user-btn' className='global-user-btns' type='button' onClick={blockUser}><FaCheckCircle /></button>
                                        </div>
                                    </div>
                                </div>
                                :
                                friend.blocked
                                    ?
                                    <div className="friend-block">
                                        <div className="friend-img"><img src={reactLogo} alt="" /></div>
                                        <div className="global-user-info">
                                            <div className="friend-name">{friend.Username}</div>
                                            <div>
                                                <button id='block-user-btn' className='global-user-btns' type='button' onClick={blockUser}><MdBlock /></button>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className="friend-block">
                                        <div className="friend-img"><img src={reactLogo} alt="" /></div>
                                        <div className="global-user-info">
                                            <div className="friend-name">{friend.Username}</div>
                                            <div>
                                                <button id='add-user-btn' className='global-user-btns' type='button' onClick={sendFriendRequest}><TiUserAdd /></button>
                                                <button id='block-user-btn' className='global-user-btns' type='button' onClick={blockUser}><MdBlock /></button>
                                            </div>
                                        </div>
                                    </div>
                        :
                        <div className="friend-block">
                            <div className="friend-img"><img src={reactLogo} alt="" /></div>
                            <div className="friend-info">
                                <div className="friend-name">{friend.Username}</div>
                                <div className="friend-last-message">{
                                    <p>Last Message</p>
                                    // code to display the last message
                                }</div>
                            </div>
                        </div>
                ))
            }
        </div>
    )
}

export default FriendList;