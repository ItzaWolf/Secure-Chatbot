import React, { useState } from 'react';

function UserLogout({ handleLogout }) {
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogoutClick = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'DELETE',
            })

            if (response.ok) {
                handleLogout();
                setConfirmationMessage('Logout successful!');
                setErrorMessage('');
            } else {
                setErrorMessage('Logout failed. No user is signed in.');
                setConfirmationMessage('');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            setErrorMessage('An error occurred during logout. Please try again.');
            setConfirmationMessage('');
        }
    }

    return (
        <div>
            <h2>Logout</h2>
            <button onClick={handleLogoutClick}>Logout</button>
            {confirmationMessage && <p style={{ color: 'green' }}>{confirmationMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    )
}

export default UserLogout;