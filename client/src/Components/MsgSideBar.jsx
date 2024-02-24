import React from 'react';

function MsgSideBar({ users, onSelectUser }) {
  return (
    <div className="sidebar">
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => onSelectUser(user)}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MsgSideBar;