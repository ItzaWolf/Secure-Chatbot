import React, { useState } from 'react';

function UserSignUp({ handleNewUser }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  
    const handleSignUp = async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        });
  
        if (response.ok) {
          const newUser = await response.json();
          handleNewUser(newUser);
          setConfirmationMessage("User created successfully! Please Login.");
          setErrorMessage("")
        } else if (response.status === 409) {
          setErrorMessage("Username already exists. Please choose a different username.");
          setConfirmationMessage("")
        } else {
          setErrorMessage("Failed to create user.");
          setConfirmationMessage("")
        }
      } catch (error) {
        console.error("Error during sign up:", error);
        setErrorMessage("An error occurred. Please try again.");
        setConfirmationMessage("")
      }
    };
  
    return (
      <div>
        <h2>Sign Up</h2>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button onClick={handleSignUp}>Sign Up</button>
        </div>
        {confirmationMessage && <p style={{ color: 'green' }}>{confirmationMessage}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
    );
  }
  
  export default UserSignUp;