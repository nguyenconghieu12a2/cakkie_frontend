import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";
import { FaChartBar, FaChartColumn } from "react-icons/fa6";
import Sidebar from "../sidebar/sidebar";
import "../../styles/report-statistic/report.css";

const Reports = () => {
  return (
    <div className="report-table-container">
      <div>
        <Sidebar />
      </div>
      <div className="container">
        {/* Header Section */}
        <div className="upper-title">
          <div className="profile-header1">
            <h2>Reports</h2>
            <p>
              <Link to="/dashboard">Home</Link> / Reports
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
        <hr className="hrr" />

        <Container style={{ marginLeft: "0px", paddingLeft: "0px" }}>
          <Row>
            <Col md={12}>
              {/* Report Selection */}
              <div className="card mt-3">
                <h5 className="card-title">
                  <FaChartBar style={{ marginRight: "5px" }} />
                  Choose the report type
                </h5>
                <div className="card-body">
                  <div className="input-group">
                    <select className="form-select" aria-label="Report type">
                      <option selected>Customer's Orders Report</option>
                      <option selected>Orders Report</option>
                      <option selected>Shipping Method</option>
                      <option selected>Cancel Orders Report</option>
                      <option selected>Sales Report</option>
                      <option selected>Coupons Report</option>
                      <option selected>Product Sales Report</option>
                      <option selected>Product Review Report</option>
                    </select>
                    <button className="btn btn-outline-secondary" type="button">
                      <FaFilter style={{ marginRight: "5px" }} />
                      Filter
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={9}>
              {/* Customer Activity Report */}
              <div className="card mt-4">
                <h5 className="card-title">
                  <FaChartColumn style={{ marginRight: "5px" }} />
                  Customer Activity Report
                </h5>
                <div className="card-body">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Comment</th>
                        <th>IP</th>
                        <th>Date Added</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="3" className="text-center">
                          No results!
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-muted">Showing 0 to 0 of 0 Pages</p>
                </div>
              </div>
            </Col>
            <Col md={3}>
              {/* Filter Section */}
              <div className="card mt-4">
                <h5 className="card-title">
                  <FaFilter style={{ marginRight: "5px" }} />
                  Filter
                </h5>
                <div className="card-body">
                  <div className="mb-3">
                    <label>Date Start</label>
                    <input type="date" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label>Date End</label>
                    <input type="date" className="form-control" />
                  </div>
                  <button className="btn btn-outline-secondary w-100">
                    <FaFilter style={{ marginRight: "5px" }} />
                    Filter
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Reports;
