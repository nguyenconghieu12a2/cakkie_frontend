import React, { useState } from "react";
import "../../styles/banner/edit-banner.css";

const EditBanner = ({ banner, onClose }) => {
  const [title, setTitle] = useState(banner.title);
  const [image, setImage] = useState(banner.image);
  const [link, setLink] = useState(banner.link);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.file[0]));
    }
  };
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Edit Banner</h2>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
          />
        </label>

        <label>
          Upload image:
          <div className="upload-section">
            <input type="file" onChange={handleImageChange} />
            {image && (
              <img
                src={`images/${image}`}
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
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="input-field"
          />
        </label>

        <div className="popup-actions">
          <button className="edit-button" onClick={() => alert("Edit Banner")}>
            Edit
          </button>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditBanner;
