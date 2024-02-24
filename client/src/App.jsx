import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './Components/HomePage';
import UserSignUp from './Components/UserSignUp';
import UserLogin from './Components/UserLogin';
import UserLogout from './Components/UserLogout';
import UserDetailEdit from './Components/UserDetailEdit';
import LandingPage from './Components/LandingPage';

function App() {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/check_session')
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return null;
        }
      })
      .then((userData) => {
        if (userData && userData.username) {
          setUser(userData);
          setIsLoggedIn(true);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error during check session:', error);
        setIsLoggedIn(false);
        setIsLoading(false);
      });
  }, []);

  function handleNewUser(newUser) {
    setUser(newUser);
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    console.log('User has been logged out!')
  }

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or any other loading indicator
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
              <LandingPage
                  setIsLoggedIn={setIsLoggedIn}
                  handleNewUser={handleNewUser} />}
        />
        <Route path="/signup" element={<UserSignUp handleNewUser={handleNewUser} />} />
        <Route path="/login" element={<UserLogin setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/logout" element={<UserLogout handleLogout={handleLogout} />} />
        <Route path="/edituser" element={<UserDetailEdit setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App