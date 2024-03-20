import React, { useEffect, useState } from 'react'
import "./styles/searchbarStyle.scss";
import { AiOutlineGlobal } from "react-icons/ai";
import axios from 'axios';
import baseUrl from './constants';

const SearchBar = ({ friendList, onSearch }) => {
    console.log("this is searchbar running");

    const [searchTerm, setSearchTerm] = useState("");
    const [globalUser, setGlobalUser] = useState("");
    const [isGlobalSearchCalled, setIsGlobalSearchCalled] = useState(false);

    // this useeffect is dynamically changing friendlist based on userinput at each letter
    useEffect(() => {
        // the logic to search in the current friendlist
        console.log("filtering!");
        let filteredFriendList = friendList.filter(friend => friend.Username.toLowerCase().startsWith(searchTerm.toLowerCase()));
        onSearch(filteredFriendList);
    }, [searchTerm]);

    // this useeffect is searching for global user only when the button is clicked
    useEffect(() => {
        if (isGlobalSearchCalled) {
            console.log("searched for global user: " + globalUser);
            let searchInfo = {
                Username: globalUser
            }
            // code to fetch globalUser
            // the issue here was
            // not sending data as another parameter
            // not sending it as a pre-made object (since sending it directly gives it no name and no way to accept in backend)
            // accepting it in backend as a dynamic object instead of a declared object (something related to runtime/compiletime error in dynamic objects in c#)
            // i was changing the searchTerm, but why? i can just directly send the data to friendlist component. changing searchterm only brings unneccessary complications
            axios.post(baseUrl + "usercrud/getuserbyusername", searchInfo).then((response) => {
                console.log("user goit by username: " + response.data);
                onSearch([{ Username: response.data.userFound ? globalUser : "", isNewFriend: !response.data.userAlreadyFriend, requested: response.data.requested, blocked: response.data.blocked }]);
            });
        }
        setIsGlobalSearchCalled(false);
    }, [isGlobalSearchCalled]);

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    }

    const globalSearch = (event) => {
        setGlobalUser(document.getElementById("searchbar-input").value);
        setIsGlobalSearchCalled(true);
    }

    return (
        <div className='search-bar-body'>
            <div className="search-bar">
                <input
                    className='searchbar-input'
                    id='searchbar-input'
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                />
                <div className="icon" onClick={globalSearch}>
                    <AiOutlineGlobal />
                </div>
            </div>
        </div>
    )
}

export default SearchBar;