import React, { useState } from "react";
import "../../styles/banner/add-banner.css";

const AddBanner = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("#");
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType === "image/jpeg" || fileType === "image/png") {
        setImage(URL.createObjectURL(file));
        setImageError("");
      } else {
        setImageError("Only .jpg and .png files are allowed.");
        setImage(""); // Clear the image preview if invalid file is uploaded
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !image) {
      setError(
        "Missing information at these fields (Title, Image). Please fill in!"
      );
      return;
    }
    console.log({ title, image, link });
    onClose();
  };
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Edit Banner</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
            />
          </label>

          <label>
            Upload Image:
            <input
              required
              type="file"
              accept=".jpg, .png"
              onChange={handleImageChange}
              className="input-field"
            />
            {imageError && <p className="error-text">{imageError}</p>}
            {image && (
              <img src={image} alt="Preview" className="image-preview" />
            )}
          </label>

          <label>
            Link:
            <input
              type="text"
              value={link}
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

export default AddBanner;
