// import React from "react";
// import { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import "bootstrap/dist/js/bootstrap.bundle";
// import Container from "react-bootstrap/Container";
// import Nav from "react-bootstrap/Nav";
// import Navbar from "react-bootstrap/Navbar";
// import "../styles/Header.css";

// const Header = ({ Title }) => {
//   return (
//     <Navbar className="custom-navbar" data-bs-theme="dark">
//       <Container className="header">
//         <Navbar.Brand href="/">
//           <img src="./images/logos.jpg" className="logo" href="#" alt="a pic" />
//         </Navbar.Brand>
//         <Nav className="me-auto    nav">
//           <Nav href="/" className="logoName">
//             CAKKIE
//           </Nav>
//           <Nav href={`./${{Title}}`}>{Title}</Nav>
//         </Nav>
//       </Container>
//     </Navbar>
//   );
// };

// export default Header;
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const api = "/api/profile"; // Backend API route

const Header = ({ isLoggedIn, Title }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token =
        localStorage.getItem("jwt") || sessionStorage.getItem("jwt");

      if (!token) {
        return; // No token found, do not attempt to fetch profile
      }

      try {
        const response = await axios.get(api, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data); // Set user profile data
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn, navigate]);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <header>
      <div className="navbar">
        <div className="logo">
          <Link to="/">
            <img src="/images/logos.jpg" alt="Logo" /> CAKKIE
          </Link>
        </div>
        <ul className="nav-links">
          {isLoggedIn ? (
            <>
              <li>
                <img
                  src={
                    user?.image
                      ? `/images/${user.image}`
                      : "/images/default_profile.jpg"
                  } // Use user's profile image, or fallback to default
                  alt="Profile"
                  className="profile-icon"
                  onClick={handleProfileClick}
                  style={{ cursor: "pointer" }}
                />
              </li>
            </>
          ) : (
            <li>
              <Link to="/login">LOGIN</Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
