import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../style/EditProfile.css';

const api = 'http://localhost:8080/api/profile';
const updateApi = 'http://localhost:8080/api/edit-account';

const EditProfile = ({ profileData = {}, onSave }) => {
    const [formData, setFormData] = useState({
        firstname: profileData.firstname || '',
        lastname: profileData.lastname || '',
        username: profileData.username || '',
        gender: profileData.gender || '',
        birthday: profileData.birthday ? profileData.birthday.split('T')[0] : '',
        phone: profileData.phone || '',
        email: profileData.email || ''
    });

    const [imagePreview, setImagePreview] = useState(
        profileData.gender === 'male'
            ? '/images/male.jpg'
            : profileData.gender === 'female'
            ? '/images/female.jpg'
            : '/images/default.jpg'
    );

    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!profileData || !profileData.firstname) {
            const fetchProfile = async () => {
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
                    setFormData({
                        ...response.data,
                        birthday: response.data.birthday ? response.data.birthday.split('T')[0] : ''
                    });
                    setImagePreview(response.data.gender === 'male' ? '/images/male.jpg' : '/images/female.jpg');
                } catch (error) {
                    console.error('Error fetching profile:', error);
                    setErrorMessage('Failed to fetch profile data.');
                }
            };

            fetchProfile();
        }
    }, [navigate, profileData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === 'gender') {
            setImagePreview(value === 'male' ? '/images/male.jpg' : value === 'female' ? '/images/female.jpg' : '/images/default.jpg');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');

        try {
            const response = await axios.put(updateApi, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            if (response.status === 200) {
                setErrorMessage('');
                if (onSave) {
                    onSave(formData); // Notify Profile component of the saved profile data
                } else {
                    const updatedResponse = await axios.get(api, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setImagePreview(updatedResponse.data.gender === 'male' ? '/images/male.jpg' : '/images/female.jpg');
                    setFormData({
                        ...updatedResponse.data,
                        birthday: updatedResponse.data.birthday ? updatedResponse.data.birthday.split('T')[0] : ''
                    });
                    navigate('/profile', { replace: true });
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage('Failed to update profile. Please try again.');
        }
    };

    return (
        <div className="edit-profile-container">
            <div className="edit-profile-form-section">
                <h1 className="edit-profile-title">Edit Profile</h1>
                {errorMessage && <p className="edit-profile-error-message">{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <FormGroup label="First Name" name="firstname" value={formData.firstname} onChange={handleChange} />
                    <FormGroup label="Last Name" name="lastname" value={formData.lastname} onChange={handleChange} />
                    <FormGroup label="Username" name="username" value={formData.username} onChange={handleChange} />
                    <FormGroup label="Gender" name="gender" value={formData.gender} onChange={handleChange} type="select" />
                    <FormGroup label="Birthday" name="birthday" value={formData.birthday} onChange={handleChange} type="date" />
                    <FormGroup label="Phone" name="phone" value={formData.phone} onChange={handleChange} type="tel" pattern="[0-9]{10}"/>
                    <FormGroup label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
                    <button type="submit" className="edit-profile-save-btn">Save Changes</button>
                </form>
            </div>
            <div className="edit-profile-right-section">
                <img src={imagePreview} alt="Profile" className="edit-profile-image-preview" onError={(e) => { e.target.src = '/images/default.jpg'; }} />
            </div>
        </div>
    );
};

const FormGroup = ({ label, name, value, onChange, type = 'text' }) => (
    <div className="edit-profile-form-group">
        <label>{label}</label>
        {type === 'select' ? (
            <select name={name} value={value} onChange={onChange} required>
                <option value="" disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
        ) : (
            <input type={type} name={name} value={value} onChange={onChange} required />
        )}
    </div>
);

FormGroup.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string,
};

export default EditProfile;
