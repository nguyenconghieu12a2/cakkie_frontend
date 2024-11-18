import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/admin-banner/add-banner.css";

const api = "/api/admin/add-banners"; // Adjust backend URL

const AdminAddBanner = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null); // Store the actual file
  const [link, setLink] = useState("#");
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwtAdmin");
    if (!jwtToken) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      const fileName = file.name;
      const fileSizeInMB = file.size / (1024 * 1024); // Convert file size to MB
      
      // Regex to check for spaces or special characters
      const invalidFileNameRegex = /[^a-zA-Z0-9-_().]/;
      
      if (invalidFileNameRegex.test(fileName)) {
        setImageError("File name contains spaces or special characters. Please rename it.");
        setImage(null);
        // setImagePreview(banner.adminImage); // Reset to default image preview
        return;
      }

      // Check file size (1 MB limit)
      if (fileSizeInMB > 1) {
        setImageError("File size exceeds 1 MB. Please upload a smaller image.");
        setImage(null);
        setImagePreview(null); // Optionally clear the image preview
        return;
    }

      if (fileType === "image/jpeg" || fileType === "image/png") {
        setImage(file); // Store the actual image file
        setImageError("");
      } else {
        setImageError("Only .jpg and .png files are allowed.");
        setImage(null); // Clear the image if invalid
      }
    }
  };

  // Function to validate the link
  const isValidLink = (link) => {
    const fullUrlPattern = /^http:\/\/localhost:3000\/banners$/;
    const relativeUrlPattern = /^\/banners$/;
    const noneURL = /^#$/;
    return (
      fullUrlPattern.test(link) ||
      relativeUrlPattern.test(link) ||
      noneURL.test(link)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !image || !link.trim()) {
      setError(
        "Missing information at these fields (Title, Image, or Link). Please fill in!"
      );
      return;
    }

    // Validate Link
    if (!isValidLink(link)) {
      setError(
        "Invalid link! Please provide a link in the format 'localhost:3000/banners' or '/banners' or '#'."
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", image); // Append the actual image file
      formData.append("link", link);
      formData.append("isDeleted", 1);

      const response = await axios.post(`${api}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set proper headers for file upload
        },
      });
      onAdd(response.data);

      console.log(response.data);
      onClose();
    } catch (error) {
      console.error("Error uploading banner:", error);
      setError("Failed to upload banner. Please try again.");
    }
  };

  return (
    <div className="popup-overlayy">
      <div className="popup-content">
        <h2>Add Banner</h2>
        <form
          // onSubmit={addBanner}
          onSubmit={handleSubmit}
        >
          <label>
            Title:
            <input
              required
              type="text"
              name="title"
              value={title}
              // onChange={handleInputChange}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
            />
          </label>

          <label>
            Upload Image:
            <input
              required
              type="file"
              name="image"
              accept=".jpg, .png"
              // onChange={handleInputChange}
              onChange={handleImageChange}
              className="input-field"
            />
            {imageError && <p className="error-text">{imageError}</p>}
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="image-preview"
              />
            )}
          </label>

          <label>
            Link:
            <input
              type="text"
              name="link"
              value={link}
              // onChange={handleInputChange}
              onChange={(e) => setLink(e.target.value)}
              className="input-field"
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <div className="popup-actions">
            <button type="submit" className="submit-button">
              Add New
            </button>
            <button type="button" className="close-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddBanner;
