import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/admin-banner/banner.css";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../admin-sidebar/sidebar";
import AdminEditBanner from "./admin-edit-banner";
import AdminAddBanner from "./admin-add-banner";
import AvatarHeader from "../admin-header/admin-header";

import { FaEdit, FaTrashAlt, FaPlusCircle } from "react-icons/fa";

const api = "/api/admin/banners";
const deleteApi = "/api/admin/delete-banners";

const AdminBanners = () => {
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [banners, setBanners] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchAllBanners();
  }, []);

  const fetchAllBanners = async () => {
    try {
      const { data } = await axios.get(`${api}`);
      setBanners(data);
      // console.log("all banners: ", data);
    } catch (error) {
      console.log("catch error: ", error);
    }
  };

  const deleteBanners = async (id) => {
    try {
      await axios.put(`${deleteApi}/${id}`);
      fetchAllBanners();
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
    if (banners.length < 10) {
      setIsAddPopupOpen(true);
      setErrorMessage(""); // Clear any previous error messages
    } else {
      setErrorMessage("You cannot add more than 10 banners.");
    }
  };

  const closeAddPopup = () => {
    setIsAddPopupOpen(false);
  };

  const addNewBanner = (newBanner) => {
    setBanners((prevBanners) => [...prevBanners, newBanner]);
    closeAddPopup();
  };

  return (
    <div className="banners-container">
      <div>
        <Sidebar onLogout={handleLogoutClick} />
      </div>
      <div className="content">
        <div className="upper-title">
          <div className="profile-header1">
            <h2>Banners</h2>
            <p>
              <Link to="/dashboard">Home</Link> / Banners
            </p>
          </div>
          <AvatarHeader />
        </div>
        <hr className="hrr" />

        <div className="lower">
          <FaPlusCircle onClick={openAddPopup} className="add-icon" />
          {isAddPopupOpen && (
            <AdminAddBanner onClose={closeAddPopup} onAdd={addNewBanner} />
          )}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
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
            {/* Check if there are no banned customers to display */}
            {banners.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  <div className="no-data-message">No banners found.</div>
                </td>
              </tr>
            ) : (
              banners.map((banner, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{banner.title}</td>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderTop: "0px",
                      borderLeft: "0px",
                      borderRight: "0px",
                      height: "29vh",
                    }}
                  >
                    <div className="img-containerr">
                      <img
                        className="imagesss"
                        src={`/images/${banner.image}`}
                        alt={banner.image}
                      />
                    </div>
                  </td>
                  <td>{banner.link}</td>
                  <td
                    className="actionss"
                    style={{
                      borderTop: "0px",
                      borderLeft: "0px",
                      height: "31vh",
                    }}
                  >
                    <FaEdit
                      onClick={() => openEditPopup(banner)}
                      className="edit-icon"
                    />
                    {isEditPopupOpen && (
                      <AdminEditBanner
                        banner={selectedBanner}
                        onClose={closeEditPopup}
                        onUpdate={fetchAllBanners}
                      />
                    )}
                    &emsp;|&emsp;
                    <FaTrashAlt
                      className="delete-icon"
                      onClick={() => deleteBanners(banner.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBanners;
