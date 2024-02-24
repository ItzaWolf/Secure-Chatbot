import React from 'react';

function MsgChatbox({ user }) {
  return (
    <div className="chatbox">
      <h2>Chatbox</h2>
      <h3>Messages Sent</h3>
      <ul>
        {user.messages_sent.map((message) => (
          <li key={message.id}>
            <strong>To: {message.recipient.username}</strong> - {message.content}
          </li>
        ))}
      </ul>
      <h3>Messages Received</h3>
      <ul>
        {user.messages_received.map((message) => (
          <li key={message.id}>
            <strong>From: {message.author.username}</strong> - {message.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MsgChatbox;
