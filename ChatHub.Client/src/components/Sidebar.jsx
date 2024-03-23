import React, { useEffect, useState } from 'react'
import MiniProfile from './MiniProfile';
import SearchBar from './SearchBar';
import FriendList from './FriendList';
import "./styles/sidebarStyle.scss"
import { IoMdSettings } from "react-icons/io";
import { SlUserFollow } from "react-icons/sl";
import axios from 'axios';
import baseUrl from './constants';
import reactLogo from "./assets/react.svg";
import { TiUserAdd } from "react-icons/ti";
import { MdBlock, MdCheckCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import CreateGroup from './CreateGroup';

const Sidebar = ({ onLogout }) => {
    console.log("this is sidebar running");

    const navigate = useNavigate();

    const [friendList, setFriendList] = useState([]);
    const [filteredFriendList, setFilteredFriendList] = useState([]);
    const [requestList, setRequestList] = useState([]);
    const [isRequestListChanged, setIsRequestListChanged] = useState(false);
    const [reloadSidebar, setReloadSidebar] = useState(true);

    useEffect(() => {
        console.log("initiating getuserfriends");
        axios.get(baseUrl + "usercrud/getuserfriends").then((response) => {
            console.log("Setting friends to friendlist");
            let data = response.data;
            let objList = data.map((friend) => (
                {
                    Username: friend.FriendUsername,
                    isNewFriend: false,
                    requested: false,
                    blocked: false
                }
            ));
            setFriendList(objList);
            setFilteredFriendList(objList);
            console.log("Showing friendList: ");
            console.log(objList);
        })
    }, [isRequestListChanged]);

    useEffect(() => {
        console.log("initiating getuserrequests");
        axios.get(baseUrl + "usercrud/getuserrequests").then((response) => {
            console.log("requests fetched");
            let data = response.data;
            console.log(data);
            // axios will accept both strings and object
            // if it's string, it will automatically convert it to object
            // but if it's object, it might change the casing of variables (from FriendId to friendId)
            let objList = data.map((request) => (
                {
                    Id: request.FriendId,
                    Username: request.FriendUsername
                }
            ));
            console.log(objList);
            setRequestList(objList);
        });
    }, [isRequestListChanged]);

    useEffect(() => {

    }, [reloadSidebar]);

    const handleSearch = (friendList) => {
        setFilteredFriendList(friendList);
    }

    const handleLogout = () => {
        onLogout(true);
    }

    const handleAccountSettings = () => {
        // account settings

    }

    const handleCreateGroup = () => {
        // create group
    }

    const handleAcceptRequest = (request) => {
        // accept request
        let friendInfo = {
            friendId: request.Id
        };
        console.log("accepting request");
        axios.post(baseUrl + "usercrud/acceptrequest", friendInfo).then((response) => {
            console.log("request accepted");
            setIsRequestListChanged(!isRequestListChanged);
        });
    }

    const handleRejectRequest = (request) => {
        // reject request
        let friendInfo = {
            friendId: request.Id
        };
        console.log("rejecting request");
        axios.post(baseUrl + "usercrud/rejectrequest", friendInfo).then((response) => {
            console.log("request rejected");
            setIsRequestListChanged(!isRequestListChanged);
        });
    }

    const renderFriendButtons = (request) => {
        if (requestList.length === 0) {
            return null;
        }

        const acceptBtn = <TiUserAdd />;
        const rejectBtn = <MdBlock />;

        return (
            <>
                <button className="request-btns" type='button' onClick={() => handleAcceptRequest(request)}>{acceptBtn}</button>
                <button className="request-btns" type='button' onClick={() => handleRejectRequest(request)}>{rejectBtn}</button>
            </>
        )
    };

    const renderRequestBlock = (request) => {
        return (
            <div className="request-block">
                <div className="request-img"><img src={reactLogo} alt="" /></div>
                <div className="request-info">
                    <div className="request-name">{request.Username}</div>
                    <div>
                        {renderFriendButtons(request)}
                    </div>
                </div>
            </div>
        );
    };

    const renderNoRequests = () => (
        <div className="no-requests">No Pending Requests</div>
    );

    return (
        <div className='sidebar-body'>
            <div className="sidebar-top">
                <div className="sidebar-navbar">
                    <div className="brand">ChatHub</div>
                    <div className="navbar-items">
                        <div className="requests">
                            <button className="btn btn-warning" type="button" data-bs-toggle="offcanvas" data-bs-target="#requests-offcanvas" aria-controls="offcanvasExample">
                                <SlUserFollow />{requestList.length}
                            </button>
                        </div>
                        <div className="options">
                            <div className="dropdown">
                                <button className="btn btn-info" type="button" data-bs-toggle="dropdown">
                                    <IoMdSettings />
                                </button>
                                <ul className="dropdown-menu">
                                    <li><button className="btn btn-primary logout-btn" type='button' data-bs-toggle="offcanvas" data-bs-target="#account-offcanvas" onClick={() => handleAccountSettings}>Account Settings</button></li>
                                    <li><button className="btn btn-primary logout-btn" type='button' data-bs-toggle="offcanvas" data-bs-target="#groups-offcanvas" onClick={handleCreateGroup}>Create Group</button></li>
                                    <li><button className="btn btn-danger logout-btn" type='button' onClick={handleLogout}>Logout</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="under-brand">
                    <div className="mini-profile">
                        <MiniProfile />
                    </div>
                    <div className="search-bar">
                        <SearchBar friendList={friendList} onSearch={handleSearch} />
                    </div>
                    <div className="search-bar-tip">
                        <p>*Please enter the exact username for global search ↑</p>
                    </div>
                </div>
            </div >
            <div className="sidebar-mid">
                <FriendList friendList={filteredFriendList} />
            </div>

            {/* OFFCANVASES */}

            <div className="offcanvas offcanvas-start" tabindex="-1" id="requests-offcanvas">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="requests-offcanvas-label">Friend Requests</h5>
                    {
                        // I had an issue here
                        // I directly changed the value of sidebarreload on onClick
                        // when this component renders, the onclick handler is execute (because js needs to first execute all the functions and all to store them in dom)
                        // so it was causing an infinite loop (because it was reloading the sidebar and subsequently itself and then again the handler)
                        // when i wrapped it inside a function, it took account of the function, but it didn't run it until the button was actually clicked
                    }
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" onClick={() => setReloadSidebar(!reloadSidebar)}></button>
                </div>
                <div className="offcanvas-body">
                    {
                        requestList.length > 0 ? requestList.map(renderRequestBlock) : renderNoRequests()
                    }
                </div>
            </div>

            <div className="offcanvas offcanvas-start" tabindex="-1" id="account-offcanvas">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="options-offcanvas-label">Account Settings</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    Hello
                </div>
            </div>

            <div className="offcanvas offcanvas-start" tabindex="-1" id="groups-offcanvas">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="options-offcanvas-label">Create Group</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <div className="create-group-body">
                        <div className="create-group-top">
                            <label htmlFor="group-name-input">Enter group name: </label>
                            <input type="text" id='group-name-input' />
                        </div>
                        <div className="create-group-bottom">
                            <CreateGroup friendsList={friendList} groupName={groupName} />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Sidebar;