import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/admin-profile/manage-profile.css";
import Sidebar from "../sidebar/sidebar";

const AdminProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    id: 1,
    firstname: "Nguyen Cong",
    lastname: "Hieu",
    username: "nchieu",
    avatar_img: "hieu.jpg",
    email: "nchieu12345@gmail.com",
  });
  const handleEditProfile = (adminId) => {
    navigate(`/admin-profile/edit/${adminId}`);
  };

  // Assuming you would fetch this data from an API
  // useEffect(() => {
  //   fetch("/path/to/your/json/file")
  //     .then((response) => response.json())
  //     .then((data) => setProfile(data));
  // }, []);
  return (
    <div className="admin-container">
      <div className="sidebar">
        <Sidebar />
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
                <input type="text" defaultValue={profile.id} disabled />
                <label>Last Name:</label>
                <input type="text" defaultValue={profile.firstname} disabled />
                <label>Username:</label>
                <input type="text" defaultValue={profile.lastname} disabled />
                <label>Email:</label>
                <input type="email" defaultValue={profile.email} disabled />
              </div>
              <div className="profile-avatar">
                <p>Avatar:</p>
                <div className="avatar-circlee"></div>
              </div>
            </div>
            <div className="profile-actions">
              <button
                className="edit-btn"
                onClick={() => handleEditProfile(profile.id)}
              >
                Edit Profile
              </button>
              <button className="change-password-btn">Change Password</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
