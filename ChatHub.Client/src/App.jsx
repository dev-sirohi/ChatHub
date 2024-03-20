import './App.css';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Home from './components/Home';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import "./components/styles/authStyle.scss";
import AuthProvider from './components/AuthContext';

function App() {
  // here we will use some hook to send data to home as prop
  // the prop will initially be empty in which case home won't show anythin
  // when we click on one of the friends the chat will open on home page
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<SignUp />} />
          <Route path='login' element={<Login />} />
          <Route path='home' element={<Layout><Home /></Layout>} />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App
