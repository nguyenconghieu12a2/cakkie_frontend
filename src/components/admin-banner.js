import React from "react";
import "../styles/banner.css";
import {
  FaEdit,
  FaTrashAlt,
  FaTachometerAlt,
  FaUser,
  FaBoxes,
  FaDollarSign,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";



const Banners = () => {
  const banners = [
    {
      title: "Banner_1",
      description: "Sold out Winter",
      image: "black-friday.jpg",
      link: 1,
    },
    {
      title: "Banner_1",
      description: "Sale off Spring",
      image: "black-friday.jpg",
      link: 2,
    },
    {
      title: "Banner_1",
      description: "Black Friday",
      image: "black-friday.jpg",
      link: 3,
    },
  ];

  return (
    <div className="banners-container">
      <div className="sidebar">
        <div className="logo">
          <img src="logo.png" alt="Cakkie Logo" />
          <h2>CAKKIE</h2>
        </div>
        <p>OVERVIEW</p>
        <ul>
          <li>
            <FaTachometerAlt /> Dashboard
          </li>
          <li>
            <FaUser /> User
          </li>
          <li>
            <FaBoxes /> Catalog
          </li>
          <li>
            <FaDollarSign /> Sales
          </li>
          <li className="active">
            <FaChartBar /> Banners
          </li>
        </ul>
        <button className="logout">
          <FaSignOutAlt /> Log out
        </button>
      </div>
      <div className="content">
        <header>
          <h3>Banners</h3>
          <p>Home / Banners</p>
        </header>
        <table className="banners-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Image</th>
              <th>Link</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner, index) => (
              <tr key={index}>
                <td>{banner.title}</td>
                <td>{banner.description}</td>
                <td>
                  <img src={banner.image} alt={banner.description} />
                </td>
                <td>{banner.link}</td>
                <td className="actions">
                  <FaEdit className="edit-icon" />
                  <FaTrashAlt className="delete-icon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="removed-banners">Removed banners</button>
      </div>
    </div>
  );
};

export default Banners;
