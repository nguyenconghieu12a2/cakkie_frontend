import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import "../../styles/admin-profile/change-password.css";
import axios from "axios";

const api = "/api/admin/change-password";

const ChangePassword = ({ onLogout }) => {
  const navigate = useNavigate();
  const adminid = sessionStorage.getItem("id");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [alert, setAlert] = useState("");

  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwt");
    if (!jwtToken) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogoutClick = () => {
    sessionStorage.removeItem("jwt");
    onLogout();
    navigate("/admin-login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the new password is the same as the old password
    if (oldPassword === newPassword) {
      setAlert("New password is the same as the old password. Please choose a different password.");
      return;
    }

    // Password validation
    const passwordValidation = (password) => {
      const minLength = 8;
      const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/; // Checks for special characters
      const upperCaseRegex = /[A-Z]/; // Checks for at least one uppercase letter

      if (password.length < minLength) {
        return "Password must be at least 8 characters long.";
      }

      if (!specialCharRegex.test(password)) {
        return "Password must contain at least special characters.";
      }

      if (!upperCaseRegex.test(password)) {
        return "Password must contain at least one uppercase letter.";
      }

      return ""; // Valid password
    };

    // Check if both fields are filled
    if (!oldPassword.trim() || !newPassword.trim()) {
      setAlert("Both fields are required!");
      return;
    }

    // Validate the new password
    const validationError = passwordValidation(newPassword);
    if (validationError) {
      setAlert(validationError);
      return;
    }

    const formData = new FormData();
    formData.append("id", adminid);
    formData.append("oldPassword", oldPassword);
    formData.append("newPassword", newPassword);

    try {
      const response = await axios.put(`${api}/${adminid}`, formData);

      if (response.status === 200) {
        navigate("/admin-profile");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setAlert("Incorrect old Password. Please try again!");
      } else {
        console.error("Error during password change: ", error);
        setAlert("An error occurred. Please try again later.");
      }
    }
  };
  return (
    <div className="admin-container">
      <div className="sidebar">
        <Sidebar onLogout={handleLogoutClick} />
      </div>
      <div className="contentt">
        <div className="upper-title">
          <div className="profile-header1">
            <h2>Change Password</h2>
            <p>
              <Link to="/dashboard">Home</Link> /{" "}
              <Link to="/admin-profile">Profile</Link> / Change Password
            </p>
          </div>
        </div>
        <div className="password-container">
          <div>
          <h2 style={{fontWeight:"bold"}}>Change Password</h2>
        <p>Your password must be at least 8 characters and should include a combination of numbers, letters, uppercase letter and special characters (!$@%).</p>

          </div>

          <form onSubmit={handleSubmit} className="password-form">
            <label htmlFor="oldPassword">Old Password</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />

            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button type="submit" className="change-btn">
              Change
            </button>
          </form>

          {alert && <p className="alert-text">{alert}</p>}
        </div>
      </div>
    </div>
  );
};
export default ChangePassword;
