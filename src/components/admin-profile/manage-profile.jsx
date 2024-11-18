import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/admin-profile/manage-profile.css";
import Sidebar from "../admin-sidebar/sidebar";
import axios from "axios";

const api = "/api/admin/admin-profile";

const AdminProfile = ({ onLogout }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});

  const adminid = sessionStorage.getItem("id");

  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwtAdmin");
    if (!jwtToken) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogoutClick = () => {
    sessionStorage.removeItem("jwtAdmin");
    onLogout();
    navigate("/admin-login");
  };

  const fetchAdminProfile = async (id) => {
    try {
      const response = await axios.get(`${api}/${id}`);
      setProfile(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAdminProfile(adminid);
  }, []);

  const handleEditProfile = () => {
    navigate(`/admin-profile/edit`, { state: { profile } });
  };

  return (
    <div className="admin-container">
      <div className="sidebar">
        <Sidebar onLogout={handleLogoutClick} />
      </div>
      <div className="contentt">
        <div className="upper-title">
          <div className="profile-header1">
            <h2>Admin Profile</h2>
            <p>
              <Link to="/dashboard">Home</Link> / Profile
            </p>
          </div>
        </div>
        <hr className="hrr" />
        <div className="profile-container">
          <div>
            <div className="profile-body">
              <div className="profile-details">
                <label>First Name:</label>
                <input type="text" defaultValue={profile.firstName} disabled />
                <label>Last Name:</label>
                <input type="text" defaultValue={profile.lastName} disabled />
                <label>Username:</label>
                <input type="text" defaultValue={profile.username} disabled />
                <label>Email:</label>
                <input type="email" defaultValue={profile.email} disabled />
              </div>
              <div className="profile-avatar">
                <p>Avatar:</p>
                <div className="avatar-circlee">
                  <img src={`/images/admin-avt/${profile.adminImage}`} />
                </div>
              </div>
            </div>
            <div className="profile-actions">
              <button className="edit-btn" onClick={() => handleEditProfile()}>
                Edit Profile
              </button>
              <Link to="/admin-change-password">
                <button className="change-password-btn">Change Password</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
