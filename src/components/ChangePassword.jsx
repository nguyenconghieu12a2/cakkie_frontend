import React, { useState } from 'react';
import axios from 'axios';
import '../style/ChangePassword.css';

const changePasswordApi = 'http://localhost:8080/api/change-password';

const ChangePassword = ({ onPasswordChange }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
        const email = localStorage.getItem('email');

        if (!email) {
            setMessage('Email not found in localStorage.');
            return;
        }

        try {
            const response = await axios.put(
                changePasswordApi,
                { email, currentPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                setMessage('Password changed successfully');
                setCurrentPassword('');
                setNewPassword('');
                setTimeout(() => {
                    if (onPasswordChange) {
                        onPasswordChange();
                    }
                }, 500);
            }
        } catch (error) {
            const errorMessage = error.response ? error.response.data : 'An unexpected error occurred.';
            setMessage(errorMessage);
        }
    };

    return (
        <div className="change-password-container">
            <h2 className="change-password-title">Change Password</h2>
            {message && <p className="change-password-message">{message}</p>}
            <form onSubmit={handleSubmit} className="change-password-form">
                <div className="change-password-form-group">
                    <label>Current Password</label>
                    <input
                        type="password"
                        className="change-password-input"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="change-password-form-group">
                    <label>New Password</label>
                    <input
                        type="password"
                        className="change-password-input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
                        required
                    />
                </div>
                <button type="submit" className="change-password-btn">Change Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;
