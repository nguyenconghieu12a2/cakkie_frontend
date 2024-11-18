import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/admin-banner/edit-banner.css";

const api = "/api/admin/update-banners";

const AdminEditBanner = ({ banner, onClose, onUpdate }) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState( "");
  const [link, setLink] = useState("");
  const [imageError, setImageError] = useState("");
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwtAdmin");
    if (!jwtToken) {
      navigate("/admin-login");
    }
  }, [navigate]);

  useEffect(() => {
    if (banner) {
      setTitle(banner.title || "");
      setImage(banner.image || "");
      setLink(banner.link || "");
      // setImagePreview(banner.image || "");
    }
  }, [banner]);

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
        setImagePreview(`${URL.createObjectURL(file)}`);
      } else {
        setImageError("Only .jpg and .png files are allowed.");
        setImage(null); // Clear the image if invalid
        // setImagePreview(`${banner.image}`);
      }
    }
  };

  // Function to validate the link
  const isValidLink = (link) => {
    // const fullUrlPattern = /^http:\/\/localhost:3000\/banners$/;
    const pattern = /^\/[a-zA-Z/]*$/;
    const noneURL = /^#$/;
    return (
      // fullUrlPattern.test(link) ||
      pattern.test(link) ||
      noneURL.test(link)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !link.trim()) {
      setError(
        "Missing information at these fields (Title or Link). Please fill in!"
      );
      return;
    }

    // Validate Link
    if (!isValidLink(link)) {
      setError(
        "Invalid link! Please provide a link in the format '/banners' or '#'."
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      // formData.append("image", image); // Append the actual image file
      formData.append("link", link);
      formData.append("isDeleted", 1);

      if (image) {
        formData.append("image", image); // Append the new image file if it's provided
      }

      const response = await axios.put(`${api}/${banner.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set proper headers for file upload
        },
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error uploading banner:", error);
      setError("Failed to upload banner. Please try again.");
    }
  };


  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Edit Banner</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
            />
          </label>

          <label>
            Upload image:
            <div className="upload-section">
              <input
                type="file"
                name="image"
                accept=".jpg, .png"
                onChange={handleImageChange}
              />
              {imageError && <p className="error-text">{imageError}</p>}
              {imagePreview && (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Banner Preview"
                  className="banner-previeww"
                />
              )}
            </div>
          </label>

          <label>
            Link:
            <input
              type="text"
              name="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="input-field"
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <div className="popup-actions">
            <button className="edit-button">Edit</button>
            <button className="close-button" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AdminEditBanner;
