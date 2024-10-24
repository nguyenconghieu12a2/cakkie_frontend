import React, { useState } from 'react';
import './Register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = 'http://localhost:8080/api/register';

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
      <div className="form-section">
        <h1>Welcome!</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <i className="icon user-icon"></i>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="First Name"
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              <i className="icon user-icon"></i>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Last Name"
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              <i className="icon user-icon"></i>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
              />
            </label>
          </div>
          <div className="form-group gender-birthday">
            <label className="gender-label">
              <i className="icon gender-icon"></i>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="birthday-label">
              <i className="icon calendar-icon"></i>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                placeholder="Birthday"
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              <i className="icon email-icon"></i>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              <i className="icon phone-icon"></i>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              <i className="icon lock-icon"></i>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </label>
          </div>
          {message && <p>{message}</p>}
          <button type="submit" className="register-btn">
            REGISTER
          </button>

          <div className="back-to-login">
            <a href="/login">Back to Login</a>
          </div>
        </form>

        
      </div>

      <div className="right-section">
        <div className="image-section">
          <img src="/images/logos.jpg" alt="Dessert" />
        </div>
      </div>
    </div>
  );
};

export default Register;
