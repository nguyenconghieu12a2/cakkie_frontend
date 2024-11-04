import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './style/OtpVerification.css';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve email from location.state
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      setError('Email is missing. Please go back and enter your email again.');
    }
  }, [email]);

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Email is missing. Please go back and enter your email again.');
      return;
    }

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        const resetLink = await response.text(); // Get reset link from backend
        setMessage('OTP verified successfully. Redirecting...');
        
        // Extract email and token from resetLink
        const urlParams = new URL(resetLink).searchParams;
        const token = urlParams.get('token');
        
        // Redirect to ResetPassword with email and token
        navigate('/reset-password', { state: { email, token } });
      } else {
        const errorMsg = await response.text();
        setError(errorMsg || 'Invalid OTP.');
        setMessage('');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      setMessage('');
    }
  };

  return (
    <div className="otp-verification-container">
      <h1>Verify OTP</h1>
      <p>Enter the OTP sent to your email to reset your password.</p>

      <form onSubmit={handleVerifyOtp}>
        <div className="form-group">
          <label>OTP</label>
          <input
            type="text"
            name="otp"
            value={otp}
            onChange={handleOtpChange}
            placeholder="Enter OTP"
            required
          />
        </div>

        <button type="submit" className="submit-btn">Verify OTP</button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default OtpVerification;
