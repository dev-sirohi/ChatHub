import React, { useEffect, useState } from 'react'
import MiniProfile from './MiniProfile';
import SearchBar from './SearchBar';
import FriendList from './FriendList';
import "./styles/sidebarStyle.scss"
import { IoMdSettings } from "react-icons/io";
import { SlUserFollow } from "react-icons/sl";
import axios from 'axios';
import baseUrl from './constants';

const Sidebar = () => {

    const [friendList, setFriendList] = useState([]);
    const [filteredFriendList, setFilteredFriendList] = useState([]);

    useEffect(() => {
        axios.get(baseUrl + "usercrud/getuserfriends").then((response) => {
            console.log("Setting friends to friendlist");
            let data = response.data;
            let objList = data.map((friend) => (
                {
                    Username: friend.Username,
                    isNewFriend: false
                }
            ));
            setFriendList(objList);
            setFilteredFriendList(objList);
            console.log("Showing friendList: ");
            console.log(objList);
        })
    }, []);

    const handleSearch = (friendList) => {
        setFilteredFriendList(friendList);
    }

    return (
        <div className='sidebar-body'>
            <div className="sidebar-top">
                <div className="sidebar-navbar">
                    <div className="brand">ChatHub</div>
                    <div className="navbar-items">
                        <div className="requests"><SlUserFollow />(2)</div>
                        <div className="options"><IoMdSettings /></div>
                    </div>
                </div>
                <div className="under-brand">
                    <MiniProfile />
                    <SearchBar friendList={friendList} onSearch={handleSearch} />
                    <p>*Please enter the exact username for global search ↑</p>
                </div>
            </div>
            <div className="sidebar-mid">
                <FriendList friendList={filteredFriendList} />
            </div>
        </div >
    )
}

export default Sidebar;