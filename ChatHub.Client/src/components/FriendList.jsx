import React from 'react'
import "./styles/friendListStyle.scss";
import reactLogo from "./assets/react.svg";
import axios from 'axios';
import baseUrl from './constants';

const FriendList = ({ friendList }) => {
    // when friend-block clicked, send friendid to chatbox
    // then chatbox will display the last 100 messages

    let data = {
        Username: friendList[0].Username
    }
    const sendFriendRequest = (event) => {
        axios.post(baseUrl + "usercrud/sendfriendrequest", data).then((response) => {
            console.log("friend request sent!");
            // change button type
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
                            <div className="friend-block">
                                <div className="friend-img"><img src={reactLogo} alt="" /></div>
                                <div className="friend-info">
                                    <div className="friend-name">{friend.Username}</div>
                                    <div className="add-friend-btn">
                                        <button type='button' onClick={sendFriendRequest}>Add friend</button>
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