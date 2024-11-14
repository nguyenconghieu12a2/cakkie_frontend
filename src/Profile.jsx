import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProfileContent from './components/ProfileContent';
import MyAddress from './components/MyAddress';
import EditProfile from './components/EditProfile';
import ChangePassword from './components/ChangePassword';
import './style/Profile.css';

const api = '/api/profile';

const Profile = ({ onLogout }) => {
    const [profileData, setProfileData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [imagePreview, setImagePreview] = useState('/images/default-avatar.png');
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [activeComponent, setActiveComponent] = useState('profile');
    const [reloadKey, setReloadKey] = useState(0);
    const navigate = useNavigate();

    const fetchProfile = useCallback(async () => {
        const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');

        if (!token) {
            setErrorMessage('You are not logged in. Redirecting to login...');
            setTimeout(() => navigate('/login'), 1000);
            return;
        }

        try {
            const response = await axios.get(api, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfileData(response.data);
            updateImagePreview(response.data);
            localStorage.setItem('email', response.data.email);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setErrorMessage('Failed to fetch profile data.');
        }
    }, [navigate]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile, reloadKey]);

    const updateImagePreview = (data) => {
        setImagePreview(
            data.image 
                ? `/images/${data.image}` 
                : data.gender === 'male' 
                    ? '/images/male.jpg' 
                    : '/images/female.jpg'
        );
    };

    const handleLogoutClick = () => {
        onLogout();
        localStorage.removeItem('email');
        localStorage.removeItem('jwt');
        navigate('/');
    };

    const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

    const handleSaveProfile = (updatedData) => {
        setProfileData(updatedData);
        updateImagePreview(updatedData);
        setActiveComponent('profile'); // Switch back to ProfileContent after saving
        setReloadKey((prevKey) => prevKey + 1); // Increment reloadKey to trigger a re-render
    };

    const handlePasswordChange = () => setActiveComponent('profile');

    const refreshAddresses = () => {
        setReloadKey((prevKey) => prevKey + 1); // Update key to force re-fetch
    };

    const renderSidebar = () => (
        <aside className="profile-page-sidebar">
            <img
                src={imagePreview}
                alt="Profile"
                className="profile-page-avatar"
                onError={(e) => { e.target.src = '/images/default-avatar.png'; }}
            />
            <h2 className="profile-page-username">{profileData?.username}</h2>

            <button onClick={toggleProfileMenu} className="profile-page-btn">
                MY ACCOUNT
                <span className={`profile-page-arrow-icon ${isProfileMenuOpen ? 'open' : ''}`}>▶</span>
            </button>

            {isProfileMenuOpen && (
                <ul className="profile-page-options">
                    <li onClick={() => setActiveComponent('profile')} className="profile-page-option">
                        MY PROFILE
                    </li>
                    <li onClick={() => setActiveComponent('editProfile')} className="profile-page-option">
                        EDIT ACCOUNT
                    </li>
                    <li onClick={() => setActiveComponent('changePassword')} className="profile-page-option">
                        CHANGE PASSWORD
                    </li>
                </ul>
            )}

            <button onClick={() => setActiveComponent('address')} className="profile-page-btn">
                MY ADDRESS
            </button>

            <div className="profile-page-logout-section">
                <button onClick={handleLogoutClick} className="profile-page-logout-btn">
                    LOGOUT
                </button>
            </div>
        </aside>
    );

    const renderMainContent = () => {
        switch (activeComponent) {
            case 'profile':
                return <ProfileContent profileData={profileData} />;
            case 'address':
                return <MyAddress userId={profileData?.id} reloadKey={reloadKey} refreshAddresses={refreshAddresses}/>;
            case 'editProfile':
                return <EditProfile profileData={profileData} onSave={handleSaveProfile} />;
            case 'changePassword':
                return <ChangePassword onPasswordChange={handlePasswordChange} />;
            default:
                return null;
        }
    };

    if (errorMessage) {
        return <div className="profile-page-error-message text-center mt-3">{errorMessage}</div>;
    }

    if (!profileData) {
        return <div className="profile-page-loading-message text-center mt-3">Loading...</div>;
    }

    return (
        <div className="profile-page-layout">
            {renderSidebar()}
            <main className="profile-page-main-content">
                {renderMainContent()}
            </main>
        </div>
    );
};

export default Profile;