import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/admin-banner/banner.css";
import { useNavigate, Link } from "react-router-dom";
import AvatarHeader from "../admin-header/admin-header";
import Sidebar from "../admin-sidebar/sidebar";

const ManageReviews = () => {
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

  return (
    <div className="reviews-container">
      <div>
        <Sidebar onLogout={handleLogoutClick} />
      </div>
      <div className="content">
        <div className="upper-title">
          <div className="profile-header1">
            <h2>Customer Reviews</h2>
            <p>
              <Link to="/dashboard">Home</Link> / Customers Review
            </p>
          </div>
          <AvatarHeader />
        </div>
        <hr className="hrr" />

        {/* content here */}
      </div>
    </div>
  );
};
export default ManageReviews;
