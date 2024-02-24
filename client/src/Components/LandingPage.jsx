import React from 'react';
import UserSignUp from './UserSignUp';
import UserLogin from './UserLogin';

function LandingPage({ handleNewUser, setIsLoggedIn }) {
  return (
    <div>
      <div>Welcome to Chatbot, Sign up or Log in!</div>
        <div>
          <UserSignUp handleNewUser={handleNewUser} />
          <br/>
          <UserLogin setIsLoggedIn={setIsLoggedIn} />
        </div>
    </div>
  );
}

export default LandingPage;
