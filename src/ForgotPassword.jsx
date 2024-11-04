import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true

    try {
      const response = await fetch('/api/password-reset-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('A password recovery email with an OTP has been sent. Please check your inbox.');
        setError('');
        
        // Navigate to the OTP verification page with the email
        navigate('/verify-otp', { state: { email } });
      } else {
        setError('Failed to send recovery email. Please try again.');
        setMessage('');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      setMessage('');
    } finally {
      setLoading(false); // Set loading to false after request is done
    }
  };

  return (
    <div className="forgot-password-container">
      <h1>Forgot Password</h1>
      <p>Enter your email address below, and we will send you an OTP to reset your password.</p>
      
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
            disabled={loading} // Disable input while loading
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Sending...' : 'Send Recovery Email'}
        </button>

        <div className="back-to-login">
          <a href="/login">Back to Login</a>
        </div>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
