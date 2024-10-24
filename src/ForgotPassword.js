import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Replace this with actual API call for password recovery
    console.log('Recovery email sent to:', email);
    
    // You can display a success message
    setMessage('A password recovery email has been sent. Please check your inbox.');
  };

  return (
    <div className="forgot-password-container">
      <h1>Forgot Password</h1>
      <p>Enter your email address below and we will send you instructions on how to reset your password.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <button type="submit" className="submit-btn">Send Recovery Email</button>

        <div className="back-to-login">
          <a href="/">Back to Login</a>
        </div>
      </form>

      {/* Display message after submitting the form */}
      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default ForgotPassword;