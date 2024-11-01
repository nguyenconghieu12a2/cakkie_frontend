import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './style/ResetPassword.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve email and token from location.state
  const email = location.state?.email;
  const token = location.state?.token;

  useEffect(() => {
    const validateToken = async () => {
      if (!email || !token) {
        setError('Invalid reset link. Please request a new password reset.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/validate-reset-token?email=${email}&token=${token}`);
        if (response.ok) {
          setIsTokenValid(true);
        } else {
          setError('Invalid reset link. Please request a new password reset.');
        }
      } catch (error) {
        setError('An error occurred while validating the reset link.');
      }
    };

    validateToken();
  }, [email, token]);

  const handlePasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token, newPassword }),
      });

      if (response.ok) {
        setMessage('Password has been reset successfully. Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError('Failed to reset password. The link may have expired.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  if (!isTokenValid) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="reset-password-container">
      <h1>Reset Password</h1>
      <p>Please enter a new password for your account.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={handlePasswordChange}
            placeholder="Enter new password"
            pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm new password"
            pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
            required
          />
        </div>

        <button type="submit" className="submit-btn">Reset Password</button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ResetPassword;
