// ProfileContent.jsx
import React from 'react';
import '../style/ProfileContent.css';

const ProfileContent = ({ profileData }) => {
    return (
        <main className="profile-content-container">
            <h1 className="profile-content-title">My Profile</h1>
            <div className="profile-content-info">
                <div className="profile-content-info-item">
                    <label>First Name</label>
                    <p>{profileData.firstname}</p>
                </div>
                <div className="profile-content-info-item">
                    <label>Last Name</label>
                    <p>{profileData.lastname}</p>
                </div>
                <div className="profile-content-info-item">
                    <label>Email</label>
                    <p>{profileData.email}</p>
                </div>
                <div className="profile-content-info-item">
                    <label>Phone</label>
                    <p>{profileData.phone}</p>
                </div>
                <div className="profile-content-info-item">
                    <label>Gender</label>
                    <p>{profileData.gender}</p>
                </div>
                <div className="profile-content-info-item">
                    <label>Birthday</label>
                    <p>{new Date(profileData.birthday).toLocaleDateString()}</p>
                </div>
            </div>
        </main>
    );
};

export default ProfileContent;
