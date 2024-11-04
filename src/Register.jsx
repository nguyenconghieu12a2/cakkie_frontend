import React, { useState } from 'react';
import './style/Register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = '/api/register';

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    gender: '',
    birthday: '',
    email: '',
    phone: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(api, formData);
      setMessage('Registration successful!');
      console.log('Success:', data);
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage('User already exists');
      } else {
        setMessage('Registration failed');
      }
      console.error('Error:', error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-section">
        <h1 className="register-heading">Welcome!</h1>
        <form onSubmit={handleSubmit}>
          {message && <p className="register-message">{message}</p>}
          <div className="register-form-group">
            <i className="register-icon fas fa-user"></i>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="First Name"
              required
            />
          </div>
          <div className="register-form-group">
            <i className="register-icon fas fa-user"></i>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Last Name"
              required
            />
          </div>
          <div className="register-form-group">
            <i className="register-icon fas fa-user"></i>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </div>
          <div className="register-form-group register-gender-birthday">
            <div className="register-gender-label">
              <i className="register-icon fas fa-venus-mars"></i>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="register-birthday-label">
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="register-form-group">
            <i className="register-icon fas fa-envelope"></i>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="register-form-group">
            <i className="register-icon fas fa-phone"></i>
            <input
              type="tel"
              name="phone"
              pattern="[0-9]{10}"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              required
            />
          </div>
          <div className="register-form-group">
            <i className="register-icon fas fa-lock"></i>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
              required
            />
          </div>
          <button type="submit" className="register-btn">REGISTER</button>
          <div className="register-back-to-login">
            <a href="/login">Back to Login</a>
          </div>
        </form>
      </div>
      <div className="register-right-section">
        <div className="register-image-section">
          <img src="/images/logos.jpg" alt="Dessert" />
        </div>
      </div>
    </div>
  );
};

export default Register;
