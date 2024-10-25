import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/banner/banner.css";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import AdminEditBanner from "./admin-edit-banner";
import AdminAddBanner from "./admin-add-banner";

import { FaEdit, FaTrashAlt, FaPlusCircle } from "react-icons/fa";

const api = "http://localhost:8080/api/banners";

const Banners = () => {
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  // const [currentBanner, setCurrentBanner] = useState(banners.length);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetchAllBanners();
  }, []);

  const fetchAllBanners = async () => {
    try {
      const { data } = await axios.get(`${api}`);
      setBanners(data);
      console.log("all banners: ", data);
    } catch (error) {
      console.log("catch error: ", error);
    }
  };

  const openEditPopup = (banner) => {
    setIsEditPopupOpen(true);
    setSelectedBanner(banner);
  };
  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
    setSelectedBanner(null);
  };

  const openAddPopup = () => {
    setIsAddPopupOpen(true);
  };
  const closeAddPopup = () => {
    setIsAddPopupOpen(false);
  };

  return (
    <div className="banners-container">
      <div>
        <Sidebar />
      </div>
      <div className="content">
        <div className="upper-title">
          <div className="profile-header1">
            <h2>Banners</h2>
            <p>
              <Link to="/dashboard">Home</Link> / Banners
            </p>
          </div>
          <div className="avatar-circle">
            <Link to="/admin-profile">
              <img
                src={`/images/low_HD.jpg`}
                alt="Avatar"
                className="avatar-img"
              />
            </Link>
          </div>
        </div>
        <hr className="hrr" />

        <div className="lower">
          <FaPlusCircle onClick={openAddPopup} className="add-icon" />
          {isAddPopupOpen && <AdminAddBanner onClose={closeAddPopup} />}
        </div>
        <table className="banners-table">
          <thead>
            <tr>
              <th className="th-0">#</th>
              <th className="th-1">Title</th>
              <th className="th-3">Image</th>
              <th className="th-4">Link</th>
              <th className="th-5">Action</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{banner.title}</td>
                <td>
                  <div className="img-containerr">
                    <img
                      className="imagesss"
                      src={`images/${banner.image}`}
                      alt={banner.image}
                    />
                  </div>
                </td>
                <td>{banner.link}</td>
                <td className="actionss">
                  <FaEdit
                    onClick={() => openEditPopup(banner)}
                    className="edit-icon"
                  />
                  {isEditPopupOpen && (
                    <AdminEditBanner
                      banner={selectedBanner}
                      onClose={closeEditPopup}
                    />
                  )}{" "}
                  &emsp;|&emsp;
                  <FaTrashAlt className="delete-icon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Banners;
