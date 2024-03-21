import React, { useEffect, useState } from 'react'
import "./styles/friendListStyle.scss";
import reactLogo from "./assets/react.svg";
import axios from 'axios';
import baseUrl from './constants';
import { TiUserAdd } from "react-icons/ti";
import { MdBlock, MdCheckCircle } from 'react-icons/md';
import { FaCheckSquare } from "react-icons/fa";

const FriendList = ({ friendList }) => {
    // when friend-block clicked, send friendid to chatbox
    // then chatbox will display the last 100 messages

    console.log(friendList);

    const [isBlocked, setIsBlocked] = useState(false);
    const [requested, setRequested] = useState(false);

    useEffect(() => {
        if (friendList.length > 0) {
            setIsBlocked(friendList[0].blocked);
            setRequested(friendList[0].requested);
        }
    }, [friendList]);


    let data = {
        Username: friendList.length == 0 ? "" : friendList[0].Username
    }

    const handleFriendRequest = () => {
        setRequested(!requested);
        axios.post(baseUrl + (!requested ? "usercrud/sendfriendrequest" : "usercrud/removefriendrequest"), data).then((response) => {
            console.log("user request " + (!requested ? "added" : "removed"));
        });
    }

    const blockUser = () => {
        setIsBlocked(!isBlocked);
        axios.post(baseUrl + (!isBlocked ? "usercrud/blockuser" : "usercrud/unblockuser"), data).then((response) => {
            console.log("user " + (!isBlocked ? "blocked" : "unblocked"));
        });
    }

    const renderFriendButtons = () => {
        if (friendList.length === 0) {
            return null;
        }

        const addBtn = requested ? <FaCheckSquare /> : <TiUserAdd />;
        const blockBtn = isBlocked ? <MdCheckCircle /> : <MdBlock />;

        return (
            <>
                <button className="global-user-btns" type='button' onClick={() => handleFriendRequest}>{addBtn}</button>
                <button className="global-user-btns" type='button' onClick={() => blockUser}>{blockBtn}</button>
            </>
        )
    };

    const renderFriendBlock = (friend) => {
        if (friend.isNewFriend) {
            return (
                <div className="friend-block">
                    <div className="friend-img"><img src={reactLogo} alt="" /></div>
                    <div className="global-user-info">
                        <div className="friend-name">{friend.Username}</div>
                        <div>
                            {renderFriendButtons()}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="friend-block">
                    <div className="friend-img"><img src={reactLogo} alt="" /></div>
                    <div className="friend-info">
                        <div className="friend-name">{friend.Username}</div>
                        <p>Last Message</p>
                    </div>
                </div>
            );
        }
    };

    const renderNoUsersFound = () => (
        <div className="no-users-found">No Users Found</div>
    );

    return (
        <div className="friend-list">
            {
                friendList.length > 0 ? friendList.map(renderFriendBlock) : renderNoUsersFound()
            }
        </div>
    )
}

export default FriendList;