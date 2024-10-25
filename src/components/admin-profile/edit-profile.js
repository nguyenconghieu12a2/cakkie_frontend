import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../styles/admin-profile/edit-profile.css";
import { BsArrowLeftSquareFill } from "react-icons/bs";
import Sidebar from "../sidebar/sidebar";

const AdminProfile = () => {
  const { adminId } = useParams;
  const [profile, setProfile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      const adminProfile = {
        id: 1,
        firstname: "Nguyen Cong",
        lastname: "Hieu",
        username: "nchieu",
        avatar_img: "low_HD.jpg",
        email: "nchieu12345@gmail.com",
      };
      setProfile(adminProfile);
    };
    fetchProfile();
  }, [adminId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const validImageTypes = ["image/jpeg", "image/png"];

      // Validate image type
      if (!validImageTypes.includes(file.type)) {
        alert("Only .jpg and .png files are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result); // Set the base64 image data to state
      };
      reader.readAsDataURL(file); // Read the image file as a base64 data URL
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile saved", profile);
  };

  if (!profile) return <div>Loading...</div>;

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
              <Link to="/dashboard">Home</Link> /{" "}
              <Link to="/admin-profile">Profile</Link> / Edit Profile
            </p>
          </div>
        </div>
        <hr className="hrr" />
        <div className="edit-profile-container">
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="profile-form">
              <div className="left-section">
                <div className="form-group">
                  <label>First Name:</label>
                  <input
                    type="text"
                    name="firstname"
                    value={profile.firstname}
                    onChange={(e) =>
                      setProfile({ ...profile, firstname: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Last Name:</label>
                  <input
                    type="text"
                    name="lastname"
                    value={profile.lastname}
                    onChange={(e) =>
                      setProfile({ ...profile, lastname: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Username:</label>
                  <input
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="right-section">
                <label>Avatar:</label>
                <div className="avatar-circlee">
                  <img
                    src={selectedImage || `/images/${profile.avatar_img}`}
                    alt="Avatar"
                    className="avatar-img"
                  />
                </div>
                <button
                  type="button"
                  className="change-btn"
                  onClick={() => document.getElementById("avatarInput").click()}
                >
                  Change
                </button>
                <input
                  id="avatarInput"
                  type="file"
                  accept="image/jpeg,image/png"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="actions">
              <div className="back-button">
                <BsArrowLeftSquareFill
                  className="back-btn"
                  onClick={() => navigate("/admin-profile")}
                />
              </div>
              <div className="save-button">
                <button type="submit" className="save-btn">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
