import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css'; // Import CSS for the design

const api = 'http://localhost:8080/api/profile'; // Backend API route

const Profile = ({ onLogout }) => {
    const [profileData, setProfileData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            let token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');

            if (!token) {
                setErrorMessage('You are not logged in. Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
                return;
            }

            try {
                const response = await axios.get(api, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfileData(response.data);
                setImagePreview(response.data.image); // Set profile image
            } catch (error) {
                console.error('Error fetching profile:', error);
                setErrorMessage('Failed to fetch profile data.');
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogoutClick = () => {
        onLogout();
        navigate('/');
    };

    // Render error message or loading state
    if (errorMessage) {
        return <div className="error-message">{errorMessage}</div>;
    }

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-sidebar">
                <img src={imagePreview || profileData.image} alt="Profile" className="profile-avatar" />
                <h2 className="username">{profileData.username}</h2>
                <button onClick={handleLogoutClick} className="logout-btn">LOGOUT</button>
            </div>

            <div className="profile-content">
                <h1>My Profile</h1>
                <div className="profile-info">
                    <div className="info-item">
                        <label>Name</label>
                        <p>{profileData.firstname} {profileData.lastname}</p>
                    </div>
                    <div className="info-item">
                        <label>Email</label>
                        <p>{profileData.email}</p>
                    </div>
                    <div className="info-item">
                        <label>Phone</label>
                        <p>{profileData.phone}</p>
                    </div>
                    <div className="info-item">
                        <label>Gender</label>
                        <p>{profileData.gender}</p>
                    </div>
                    <div className="info-item">
                        <label>Birthday</label>
                        <p>{new Date(profileData.birthday).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
