import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile'); // Navigate to profile page when the profile icon is clicked
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
                  src="/images/low_HD.jpg" // Replace with the path to your profile icon
                  alt="Profile"
                  className="profile-icon"
                  onClick={handleProfileClick}
                  style={{ cursor: 'pointer' }} // Add a pointer cursor to indicate clickability
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
