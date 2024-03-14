import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import baseUrl from "./constants/constants";

function App() {
  // useEffect changes when the component renders or when the dependency array is modified
  useEffect(() => {
    const userData = {
      username: "devsirohi",
      email: "devsirohi@gmail.com",
      password: "devsirohi"
    };

    axios.post(baseUrl + "usercrud/setuserdata", userData).then((response) => {
      console.log(response.data);
    })
  }, []);

  return (
    <>
      <div>
        <h1>Hello World</h1>
      </div>
    </>
  )
}

export default App
