import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import "../../styles/admin-profile/edit-profile.css";
import { BsArrowLeftSquareFill } from "react-icons/bs";
import Sidebar from "../admin-sidebar/sidebar";
import axios from "axios";

const api2 = "/api/admin/update-admin-profile";

const AdminProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profile = location.state?.profile || {};

  const [firstname, setFirstname] = useState(profile.firstName);
  const [lastname, setLastname] = useState(profile.lastName);
  const [username, setUsername] = useState(profile.username);
  const [email, setEmail] = useState(profile.email);
  const [imagePreview, setImagePreview] = useState(profile.adminImage);
  const [image, setImage] = useState(profile.adminImage);
  const [imageError, setImageError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwtAdmin");
    if (!jwtToken) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogoutClick = () => {
    console.log("Logging out...");
    sessionStorage.removeItem("jwtAdmin");
    // onLogout();
    navigate("/admin-login");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      const fileName = file.name;

      // Regex to check for spaces or special characters
      const invalidFileNameRegex = /[^a-zA-Z0-9-_().]/;

      if (invalidFileNameRegex.test(fileName)) {
        setImageError(
          "File name contains spaces or special characters. Please rename it."
        );
        setImage(null);
        setImagePreview(profile.adminImage); // Reset to default image preview
        return;
      }

      if (fileType === "image/jpeg" || fileType === "image/png") {
        setImage(file); // Store the actual image file
        setImageError("");
        setImagePreview(`${URL.createObjectURL(file)}`);
      } else {
        setImageError("Only .jpg and .png files are allowed.");
        setImage(null); // Clear the image if invalid
        setImagePreview(`${profile.image}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !firstname.trim() ||
      !lastname.trim() ||
      !username.trim() ||
      !email.trim()
    ) {
      setError(
        "Missing information at these fields (firstname or lastname or username or email). Please fill in!"
      );
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstname);
    formData.append("lastName", lastname);
    formData.append("username", username);
    formData.append("email", email);

    if (image) {
      formData.append("adminImage", image);
    }

    try {
      console.log("Sending PUT request to update profile with ID:", profile.id);
      const response = await axios.put(`${api2}/${profile.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set proper headers for file upload
        },
      });
      if (response.status === 200) {
        // Check if the response was successful
        navigate("/admin-profile");
      } else {
        setError("Failed to update the profile. Please try again.");
      }
    } catch (err) {
      console.error("Error uploading profile:", err);
      setError("Failed to upload profile. Please try again.");
    }
  };

  if (!profile) return <div>Loading...</div>;

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
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name:</label>
                  <input
                    type="text"
                    name="lastname"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Username:</label>
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="right-section">
                <label>Avatar:</label>
                <div className="avatar-circlee">
                  <img
                    src={`/images/admin-avt/${profile.adminImage}`}
                    alt="Avatar"
                    className="avatar-img"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
                {imageError && <p className="error-text">{imageError}</p>}
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
                  accept=".jpg, .png"
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
              {error && <p className="error-text">{error}</p>}
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
