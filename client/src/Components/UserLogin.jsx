import React, { useState } from 'react';

function UserLogin({setIsLoggedIn}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [confirmationMessage, setConfirmationMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const userData = await response.json();
        console.log('User logged in:', userData);
        if (userData && Object.keys(userData).length > 0) {
          setUser(userData);
          setConfirmationMessage('Login successful!');
          setIsLoggedIn(true)
          setErrorMessage('');
        } else {
          setErrorMessage('User data is empty. Please try again.');
          setConfirmationMessage('');
        }
      } else {
        console.error('Login failed');
        setErrorMessage('Invalid username or password. Please try again.');
        setConfirmationMessage('');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred during login. Please try again.');
      setConfirmationMessage('');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {confirmationMessage && <p style={{ color: 'green' }}>{confirmationMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default UserLogin;