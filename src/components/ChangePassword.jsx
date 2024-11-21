import React, { useState } from "react";
import axios from "axios";
import "../style/ChangePassword.css";

const changePasswordApi = "/api/change-password";

const ChangePassword = ({ onPasswordChange }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  const validateNewPassword = () => {
    if (!newPassword) {
      setNewPasswordError("New Password is required.");
      return false;
    }

    const strongPasswordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      setNewPasswordError(
        "Password must be at least 8 characters long, include a letter, a number, and a special character."
      );
      return false;
    }

    setNewPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateNewPassword()) return;

    const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
    const email = localStorage.getItem("email");

    if (!email) {
      setMessage("Email not found in localStorage.");
      return;
    }

    try {
      const response = await axios.put(
        changePasswordApi,
        { email, currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setMessage("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setTimeout(() => {
          if (onPasswordChange) {
            onPasswordChange();
          }
        }, 500);
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "An unexpected error occurred.";

      // Handle specific error messages
      if (errorMessage.includes("Current password is incorrect")) {
        setMessage("The current password you entered is incorrect.");
      } else if (
        errorMessage.includes(
          "New password cannot be the same as the current password"
        )
      ) {
        setMessage(
          "The new password cannot be the same as the current password."
        );
      } else {
        setMessage(errorMessage);
      }
    }
  };

  return (
    <div className="change-password-container">
      <h2 className="change-password-title">Change Password</h2>
      {message && <p className="change-password-message">{message}</p>}
      <form onSubmit={handleSubmit} className="change-password-form">
        <div className="change-password-form-group">
          <label>Current Password</label>
          <input
            type="password"
            className="change-password-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="change-password-form-group">
          <label>New Password</label>
          <input
            type="password"
            className="change-password-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onBlur={validateNewPassword}
            required
          />
          {newPasswordError && (
            <p className="change-password-error">{newPasswordError}</p>
          )}
        </div>
        <button type="submit" className="change-password-btn">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
