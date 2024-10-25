import React from "react";
import Sidebar from "../sidebar/sidebar";
import { Link, BrowserRouter } from "react-router-dom";
import "../../styles/header/admin-header.css";
const Header = () => {
  return (
    <div>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="upper-title">
        <div className="profile-header">
          <h2>Page Function name</h2>
          <p>Home / Page Sub-Function name</p>
        </div>
        <div className="avatar-circle">
          <BrowserRouter>
            <Link to="/admin-profile">
              <img
                src={`/images/low_HD.jpg`}
                alt="Avatar"
                className="avatar-img"
              />
            </Link>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
};
export default Header;
