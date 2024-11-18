import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../admin-sidebar/sidebar";
import { Link, useNavigate } from "react-router-dom";
import { IoReload } from "react-icons/io5";
import { BsFillForwardFill } from "react-icons/bs";
import "../../styles/admin-report-statistic/statistic.css";
import "../../styles/admin-header/admin-header.css";
import AvatarHeader from "../admin-header/admin-header";

const api = "/api/admin/statistics";

const AdminStatistic = () => {
  const [statistic, setStatistic] = useState([]);
  const [loading, setLoading] = useState(false);
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
        <Sidebar onLogout={handleLogoutClick} />
      </div>
      <div className="containerr">
        <div className="upper-title">
          <div className="profile-header1">
            <h2>Statistics</h2>
            <p>
              <Link to="/dashboard">Home</Link> / Statistics
            </p>
          </div>
          <AvatarHeader />
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

                      {/* FORWARD TO ORDER MANAGE PROCESSING PAGE */}
                      {stat.name === "Orders Processing" && (
                        // Link to Order management
                        <Link to="#">
                          <BsFillForwardFill className="forward-button" />
                        </Link>
                      )}

                      {/* FORWARD TO MANAGE OUT OF STOCK PRODUCT PAGE */}
                      {stat.name === "Out of stock products" && (
                        // Link to out of stock product site
                        <Link to="#">
                          <BsFillForwardFill className="forward-button" />
                        </Link>
                      )}

                      {/* FORWARD TO MANAGE CUSTOMER REVIEW PAGE */}
                      {stat.name === "Pending Reviews" && (
                        // Link to pending review site
                        <Link to="#">
                          <BsFillForwardFill className="forward-button" />
                        </Link>
                      )}
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
export default AdminStatistic;
