import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const api = 'http://localhost:8080/api/login'; // Backend API endpoint for login

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make POST request to login endpoint
      const response = await axios.post(api, {
        email: formData.email,
        password: formData.password
      });

      const { jwt } = response.data; // Assuming your backend returns a response like { jwt: "token_here" }

      // Store the JWT in localStorage/sessionStorage depending on 'rememberMe'
      if (formData.rememberMe) {
        localStorage.setItem('jwt', jwt);
      } else {
        sessionStorage.setItem('jwt', jwt);
      }

      setMessage('Login successful!');
      console.log('JWT Token:', jwt);

      // Trigger the parent callback to update login state
      onLoginSuccess();

      // Redirect to homepage or profile page after login
      navigate('/');
    } catch (error) {
      // Handle error based on the response
      if (error.response && error.response.status === 400) {
        setMessage('Invalid email or password');
      } else {
        setMessage('Login failed');
      }
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="form-section">
        <h1>WELCOME BACK!</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <i className="icon user-icon"></i>
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
          <div className="options">
            <label>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />{' '}
              Remember me
            </label>
            <a href="/forgot-password" className="forgot-password">
              Forgot password?
            </a>
          </div>
          {message && <p className="message">{message}</p>}
          <button type="submit" className="login-btn">
            LOGIN
          </button>
        </form>
        <div className="register-section">
          <p>
            Don’t have an account? <a href="/register">Register</a>
          </p>
        </div>
      </div>

      <div className="image-section">
        <img src="/images/logos.jpg" alt="Dessert" />
      </div>
    </div>
  );
};

export default Login;
