import React, { useState } from 'react';

function UserLogin({setIsLoggedIn}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('User logged in:', userData);
        if (userData && Object.keys(userData).length > 0) {
          setIsLoggedIn(true);
          setConfirmationMessage('Login successful!');
          setErrorMessage('');
        } else {
          setErrorMessage('User data is empty. Please try again.');
          setConfirmationMessage('');
        }
      } else {
        console.error('Login failed');
        setErrorMessage('Invalid username, email, or password. Please try again.');
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
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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