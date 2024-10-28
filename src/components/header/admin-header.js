import React from "react";
import Sidebar from "../sidebar/sidebar";
import { Link, BrowserRouter } from "react-router-dom";
import "../../styles/header/admin-header.css";
const AvatarHeader = () => {
  return (
    <div className="avatar-circle">
      <Link to="/admin-profile">
        <img src={`/images/low_HD.jpg`} alt="Avatar" className="avatar-img" />
      </Link>
    </div>
  );
};
export default AvatarHeader;
