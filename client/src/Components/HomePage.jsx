import React from 'react';
import UserLogout from './UserLogout';

function HomePage({ handleLogout }) {
  return (
    <div>
      <h1>Welcome to the HomePage</h1>
      <UserLogout/>
    </div>
  );
}

export default HomePage;
