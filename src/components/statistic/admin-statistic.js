import React from "react";
import Sidebar from "../sidebar/sidebar";
import { Link } from "react-router-dom";
import { IoReload } from "react-icons/io5";
import statistics from "./data";
import "../../styles/report-statistic/statistic.css";
import "../../styles/header/admin-header.css";

const Statistic = () => {
  return (
    <div>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="container">
        <div className="upper-title">
          <div className="profile-header1">
            <h2>Statistics</h2>
            <p>
              <Link to="/dashboard">Home</Link> / Statistics
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
        <hr />
        <div className="statistics-container">
          <h3 className="table-title">Statistics List</h3>
          <table className="statistics-table">
            <thead>
              <tr>
                <th>Statistics Name</th>
                <th>Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {statistics.map((stat, index) => (
                <tr key={index}>
                  <td>{stat.name}</td>
                  <td>{stat.value}</td>
                  <td>
                    <button className="refresh-btn">
                      <IoReload />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Statistic;
