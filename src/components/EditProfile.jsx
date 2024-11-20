import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "../style/EditProfile.css";

const api = "/api/profile";
const updateApi = "/api/edit-account";

const EditProfile = ({ profileData = {}, onSave }) => {
  const [formData, setFormData] = useState({
    firstname: profileData.firstname || "",
    lastname: profileData.lastname || "",
    username: profileData.username || "",
    gender: capitalizeFirstLetter(profileData.gender || ""),
    birthday: profileData.birthday
      ? formatDateToInput(profileData.birthday)
      : "",
    phone: profileData.phone || "",
    email: profileData.email || "",
  });

  const [imagePreview, setImagePreview] = useState(profileData.image || "");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!profileData || !profileData.firstname) {
      const fetchProfile = async () => {
        const token =
          localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
        if (!token) {
          setErrorMessage("You are not logged in. Redirecting to login...");
          setTimeout(() => navigate("/login"), 1000);
          return;
        }

        try {
          const response = await axios.get(api, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = response.data;

          setFormData({
            firstname: data.firstname,
            lastname: data.lastname,
            username: data.username,
            gender: capitalizeFirstLetter(data.gender),
            birthday: data.birthday
              ? formatDateToInput(data.birthday)
              : "",
            phone: data.phone,
            email: data.email,
          });

          if (data.image) {
            setImagePreview(data.image);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          setErrorMessage("Failed to fetch profile data.");
        }
      };

      fetchProfile();
    }
  }, [navigate, profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Update imagePreview based on gender selection
    if (name === "gender") {
      const updatedImage =
        value.toLowerCase() === "male"
          ? "male.jpg"
          : value.toLowerCase() === "female"
          ? "female.jpg"
          : "";
      setImagePreview(updatedImage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");

    try {
      const response = await axios.put(updateApi, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        setErrorMessage("");
        if (onSave) {
          onSave(formData); // Notify Profile component of the saved profile data
        }
        // Reload the current page by setting the href to the current URL
        window.location.href = window.location.href;
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="edit-profile-containerr">
      <div className="edit-profile-form-section">
        <h1 className="edit-profile-title">Edit Profile</h1>
        {errorMessage && (
          <p className="edit-profile-error-message">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          <FormGroup
            label="First Name"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
          />
          <FormGroup
            label="Last Name"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
          <FormGroup
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <FormGroup
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            type="select"
          />
          <FormGroup
            label="Birthday"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            type="date"
          />
          <FormGroup
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="tel"
            pattern="[0-9]{10}"
          />
          <FormGroup
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            disabled
          />
          <button type="submit" className="edit-profile-save-btn">
            Save Changes
          </button>
        </form>
      </div>
      <div className="edit-profile-right-section">
        {imagePreview && (
          <img
            src={`/images/${imagePreview}`}
            alt="Profile"
            className="edit-profile-image-preview"
          />
        )}
      </div>
    </div>
  );
};

const FormGroup = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  disabled = false,
}) => (
  <div className="edit-profile-form-group">
    <label>{label}</label>
    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        disabled={disabled}
      >
        <option value="" disabled>
          Select Gender
        </option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        disabled={disabled}
      />
    )}
  </div>
);

FormGroup.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

// Helper functions
const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

const formatDateToInput = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Format to yyyy-MM-dd
};

export default EditProfile;
