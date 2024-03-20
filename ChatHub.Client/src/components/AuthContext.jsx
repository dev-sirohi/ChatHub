import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';
import baseUrl from './constants';

// using the createContext hook to create authcontext
const AuthContext = createContext("");

// now this is a custom hook to access the authentication context
// basically, we could have just called authentication context directly in other files using
// useContext(AuthContext) because that's how things are usually done, 
// but we can also make things more specific by creating our own custom hook and not being dependent on using
// useContext(AuthContext) everytime
export const useAuth = () => useContext(AuthContext);

// now this is just to provide the context to it's children
// this has all the data and functions
// it takes all the children it wraps as parameter
// and provides them with all it's data, functions and context
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // this hook will only run once, when the component is mounted
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        axios.post(baseUrl + "usercrud/setsession", userData).then((response) => {
            console.log("user set in backend");
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    }

    // by using provider and wrapping it around all other components, we will be able to 
    // invoke the context in any context using our custom useAuth hook
    // and the values are the functions and data it provides
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;