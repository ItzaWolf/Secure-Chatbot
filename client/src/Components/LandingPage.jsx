import React from 'react';
import { Navigate } from 'react-router-dom';
import UserSignUp from './UserSignUp';
import UserLogin from './UserLogin';

function LandingPage({ isLoggedIn }) {
  if (isLoggedIn) {
    return <Navigate to="/home" />;
  }

  return (
    <div>
      <h1>Welcome to Chatbot!</h1>
      <p>Please sign up or log in to continue</p>
      <div>
        <UserSignUp />
        <br/>
        <UserLogin />
      </div>
    </div>
  );
}

export default LandingPage;