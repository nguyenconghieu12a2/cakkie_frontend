import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../sidebar/sidebar";
import { Link } from "react-router-dom";
import { IoReload } from "react-icons/io5";
// import statisticsData from "./data";
import "../../styles/report-statistic/statistic.css";
import "../../styles/header/admin-header.css";

const api = "http://localhost:8080/api/statistics";

const Statistic = () => {
  const [statistic, setStatistic] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStatistic = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}`);
      setStatistic(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistic();
  }, []);

  const handleReload = () => {
    fetchStatistic();
  };

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
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="statistics-table">
              <thead>
                <tr>
                  <th>Statistics Name</th>
                  <th>Value</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {statistic.map((stat, index) => (
                  <tr key={index}>
                    <td>{stat.name}</td>
                    <td>{stat.value}</td>
                    <td>
                      <button className="refresh-btn" onClick={handleReload}>
                        <IoReload />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
export default Statistic;
