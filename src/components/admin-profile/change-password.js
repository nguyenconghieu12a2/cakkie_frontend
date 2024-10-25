import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import "../../styles/admin-profile/change-password.css";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [alert, setAlert] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      setAlert("Both fields are required!");
    } else {
      setAlert("Password changed successfully!");
    }
  };
  return (
    <div>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="profile-header">
        <h2>Change Password</h2>
        <p>
          <Link to="/dashboard">Home</Link> / Admin Profile / Change Password
        </p>
      </div>
      <div className="password-container">
        <form onSubmit={handleSubmit} className="password-form">
          <label htmlFor="oldPassword">Old Password:</label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <label htmlFor="newPassword">New Password:</label>
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
  );
};
export default ChangePassword;
