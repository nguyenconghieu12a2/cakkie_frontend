import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/admin-header/admin-header.css";

const api = "/api/admin/admin-profile";

const AvatarHeader = () => {
  const [profile, setProfile] = useState({});
  const adminid = sessionStorage.getItem("id");

  const fetchAdminProfile = async (id) => {
    try {
      const response = await axios.get(`${api}/${id}`);
      setProfile(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAdminProfile(adminid);
  }, []);
  return (
    <div className="avatar-circle">
      <Link to="/admin-profile">
        <img
          src={
            profile.adminImage
              ? `/images/admin-avt/${profile.adminImage}`
              : "/images/admin-avt/avatar.jpg"
          }
          alt="Avatar"
          className="avatar-img"
        />
      </Link>
    </div>
  );
};
export default AvatarHeader;
