import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserDetailEdit({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(`/api/check_session`);
        if (response.ok) {
          const userData = await response.json();
          setUserId(userData.id);
        } else {
          console.error('Failed to fetch user ID');
        }
      } catch (error) {
        console.error('Error during user ID fetch:', error);
      }
    };

    fetchUserId();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/user/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setEditedUser({
          username: userData.username,
          password: userData.password,
        });
      } else {
        console.error('Failed to fetch user details.');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleInputChange = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/edituser/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });

      if (response.ok) {
        const updatedUserData = await response.json();
        setUser(updatedUserData);
        setEditing(false);
        alert('User details updated successfully!');
        setErrorMessage('');
      } else {
        console.error('Failed to update user details.');
        setErrorMessage('Error updating user details. Please try again.');
      }
    } catch (error) {
      console.error('Error during user details update:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!isConfirmed) {
      // If not confirmed, show a confirmation dialog
      const userConfirmed = window.confirm('Are you sure you want to delete your profile? This action cannot be undone.');
      if (!userConfirmed) {
        return;
      }

      // If confirmed, set the state
      setIsConfirmed(true);
      return;
    }

    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('User deleted successfully!');
        setErrorMessage('');
        setUser(null);
        setIsLoggedIn(false);
        navigate('/'); // Use navigate to navigate to the home page
      } else {
        console.error('Failed to delete user.');
        setErrorMessage('Error deleting user. Please try again.');
      }
    } catch (error) {
      console.error('Error during user deletion:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  if (!user || !editedUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Details</h2>
      <p>
        Username:{' '}
        {editing ? (
          <input
            type="text"
            name="username"
            value={editedUser.username || ''}
            onChange={handleInputChange}
          />
        ) : (
          editedUser.username || ''
        )}
      </p>
      <p>
        Password:{' '}
        {editing ? (
          <input
            type="password"
            name="password"
            value={editedUser.password || ''}
            onChange={handleInputChange}
          />
        ) : (
          '********'
        )}
      </p>
      <button onClick={handleEditToggle}>
        {editing ? 'Cancel Edit' : 'Edit'}
      </button>
      {editing && <button onClick={handleSave}>Save</button>}
      {!isConfirmed && <button onClick={() => setIsConfirmed(true)}>Delete User</button>}
      {isConfirmed && <button onClick={() => { handleDelete(); navigate('/'); }}>Confirm Deletion</button>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default UserDetailEdit;
