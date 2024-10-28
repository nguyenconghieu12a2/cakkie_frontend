import React, { useState } from "react";
import axios from "axios";
import "../../styles/banner/edit-banner.css";

const api = "http://localhost:8080/api/update-banners";

const EditBanner = ({ banner, onClose, onUpdate }) => {
  const [title, setTitle] = useState(banner.title);
  const [image, setImage] = useState(banner.image);
  const [link, setLink] = useState(banner.link);
  const [imageError, setImageError] = useState("");
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(banner.image);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType === "image/jpeg" || fileType === "image/png") {
        setImage(file); // Store the actual image file
        setImageError("");
        setImagePreview(`${URL.createObjectURL(file)}`);
      } else {
        setImageError("Only .jpg and .png files are allowed.");
        setImage(null); // Clear the image if invalid
        setImagePreview(`${banner.image}`);
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
    if (!title.trim() || !link.trim()) {
      setError(
        "Missing information at these fields (Title or Link). Please fill in!"
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
                  src={`/images/${imagePreview}`}
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
export default EditBanner;
