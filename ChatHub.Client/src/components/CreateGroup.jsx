import axios from 'axios';
import React, { useEffect, useState } from 'react'
import baseUrl from './constants';
import reactLogo from "./assets/react.svg";
import "./styles/createGroup.scss";
import { TiUserAdd } from "react-icons/ti";
import { FaCheckSquare } from "react-icons/fa";



const CreateGroup = ({ friendsList, groupName, setGroupName }) => {

    console.log(friendsList);

    const [friendList, setFriendList] = useState([]);

    useEffect(() => {
        if (friendsList && friendsList.length > 0) {
            setFriendList(friendsList);
        }
    }, [friendsList]);

    const handleAddGroup = (friend) => {
        friend.requested = !friend.requested;

        const updatedList = friendList.map(item =>
            item.Username === friend.Username ? { ...item, requested: friend.requested } : item
        );
        setFriendList(updatedList);
    }

    const handleCreateGroup = () => {
        // we cannot send two different data objects to backend
        let friendsInGroupList = friendList.filter((friend) => friend.requested).map((friend) => {
            let obj = {
                FriendUsername: friend.Username
            }

            return obj;
        });

        console.log(friendsInGroupList);

        let groupChat = {
            Name: groupName
        }

        let groupChatCreator = {
            FriendsInGroupList: friendsInGroupList,
            GroupChatName: groupName
        }

        console.log(groupChatCreator);

        axios.post(baseUrl + "usercrud/creategroup", groupChat).then((response) => {
            console.log("group created");
            axios.post(baseUrl + "usercrud/addgroupmembers", groupChatCreator).then((response) => {
                console.log("group members added!");
            });
        });

        setGroupName("");

        const resetFriendList = friendList.map(friend => ({
            ...friend,
            requested: false
        }));
        setFriendList(resetFriendList);
    }

    const renderFriendButtons = (friend) => {
        console.log("friend is");
        console.log(friend);
        if (friendList.length === 0) {
            return null;
        }

        const addBtn = friend.requested ? <FaCheckSquare /> : <TiUserAdd />

        return (
            <>
                <button className="btn btn-info friends-not-added-btn" type='button' onClick={() => handleAddGroup(friend)}>{addBtn}</button>
            </>
        )
    };

    const renderFriendIcon = (friend) => {
        return (
            <div className="friend-img-block">
                {
                    friend.requested ? <img src={reactLogo} alt="" /> : null
                }
            </div>
        );
    }

    const renderFriendBlock = (friend) => {
        return (
            <div className="friend-block">
                <div className="friend-img"><img src={reactLogo} alt="" /></div>
                <div className="friend-info">
                    <div className="friend-name">{friend.Username}</div>
                </div>
                <div className="friend-btn">
                    {renderFriendButtons(friend)}
                </div>
            </div>
        );
    };

    return (
        <div className='group-info'>
            <div className="friend-added-list">
                {
                    friendList.length > 0 ? friendList.map(renderFriendIcon) : null
                }
            </div>
            <div className="friend-not-added-list">
                {
                    friendList.length > 0 ? friendList.map(renderFriendBlock) : null
                }
            </div>
            <button type='button' onClick={() => handleCreateGroup()}>Create Group</button>
        </div>
    )
}

export default CreateGroup