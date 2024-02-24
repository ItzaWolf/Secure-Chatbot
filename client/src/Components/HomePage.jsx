import React, { useState, useEffect } from 'react';
import MsgChatbox from './MsgChatbox';
import MsgSideBar from './MsgSideBar';

function Homepage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch session information to check if the user is logged in
    fetch('/check_session')
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          setIsLoggedIn(false);
          throw new Error('User not logged in');
        }
      })
      .then((userData) => {
        setIsLoggedIn(true);
        setSelectedUser(userData);
      })
      .catch((error) => console.error('Error fetching session:', error));
  }, []);

  useEffect(() => {
    // Fetch messages for the selected user if user is logged in
    if (selectedUser && isLoggedIn) {
      setIsLoading(true);
      fetch(`/api/users/${selectedUser.id}/messages`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch messages');
          }
          return res.json();
        })
        .then((data) => {
          // Combine messages_sent and messages_received into one array
          const allMessages = [...data.messages_sent, ...data.messages_received];
          setMessages(allMessages);
        })
        .catch((error) => {
          setError(error.message);
          console.error('Error fetching messages:', error);
        })
        .finally(() => setIsLoading(false));
    }
  }, [selectedUser, isLoggedIn]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    // Reset error when a new user is selected
    setError(null);
  };

  return (
    <div className="homepage">
      <MsgSideBar onSelectUser={handleSelectUser} />
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <MsgChatbox messages={messages.length > 0 ? messages : [{ content: "No messages" }]} />
      )}
    </div>
  );
}

export default Homepage;
