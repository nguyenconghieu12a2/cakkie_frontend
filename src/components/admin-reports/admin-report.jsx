import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";
import { FaChartBar, FaChartColumn } from "react-icons/fa6";
import Sidebar from "../admin-sidebar/sidebar";
import "../../styles/admin-report-statistic/report.css";
import CustomerOrder from "./customer-order";
import Orders from "./order-report";
import Shipping from "./shipping-method";
import CancelOrder from "./cancel-order";
import Sales from "./sales";
import Coupons from "./coupons";
import ProductSales from "./products-sales";
import ProductReview from "./product-review";
import AvatarHeader from "../admin-header/admin-header";

const AdminReports = ({ onLogout }) => {
  const [selectedReportsOptions, setSelectedReportsOptions] =
    useState("CustomerOrder");
  const [selectedReports, setSelectedReports] = useState("CustomerOrder");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwtAdmin");
    if (!jwtToken) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogoutClick = () => {
    sessionStorage.removeItem("jwtAdmin");
    onLogout();
    navigate("/admin-login");
  };

  const handleReportChange = (event) => {
    setSelectedReportsOptions(event.target.value);

    // setSelectedReports(event.target.value); // Update selected report type
  };

  const applyFilter = () => {
    setSelectedReports(selectedReportsOptions);
    setStartDate(""); // Reset start date
    setEndDate(""); // Reset end date
    // Pass the current startDate and endDate when the filter is applied
  };

  const renderReport = () => {
    switch (selectedReports) {
      case "CustomerOrder":
        return <CustomerOrder startDate={startDate} endDate={endDate} />;
      case "Orders":
        return <Orders startDate={startDate} endDate={endDate} />;
      case "Shipping":
        return <Shipping startDate={startDate} endDate={endDate} />;
      case "CancelOrder":
        return <CancelOrder startDate={startDate} endDate={endDate} />;
      case "Sales":
        return <Sales startDate={startDate} endDate={endDate} />;
      case "Coupons":
        return <Coupons startDate={startDate} endDate={endDate} />;
      case "ProductSales":
        return <ProductSales startDate={startDate} endDate={endDate} />;
      case "ProductReview":
        return <ProductReview startDate={startDate} endDate={endDate} />;
      default:
        return <CustomerOrder startDate={startDate} endDate={endDate} />;
    }
  };

  return (
    <div className="report-table-containerr">
      <div>
        <Sidebar onLogout={handleLogoutClick} />
      </div>
      <div className="containerr">
        {/* Header Section */}
        <div className="upper-title">
          <div className="profile-header1">
            <h2>Reports</h2>
            <p>
              <Link to="/dashboard">Home</Link> / Reports
            </p>
          </div>
          <AvatarHeader />
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
                    <select
                      className="form-select"
                      aria-label="Report type"
                      onChange={handleReportChange}
                      value={selectedReportsOptions}
                    >
                      <option value="CustomerOrder">
                        Customer's Orders Report
                      </option>
                      <option value="Orders">Orders Report</option>
                      <option value="ProductSales">Product Sales Report</option>
                      <option value="CancelOrder">Cancel Orders Report</option>
                      <option value="Sales">Sales Report</option>
                      <option value="Shipping">Shipping Method</option>
                      <option value="Coupons">Coupons Report</option>
                      <option value="ProductReview">
                        Product Review Report
                      </option>
                    </select>
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={applyFilter}
                    >
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
                  {selectedReports === "CustomerOrder" &&
                    "Customer Order Report"}
                  {selectedReports === "Orders" && "Orders Report"}
                  {selectedReports === "Shipping" && "Shipping Method Report"}
                  {selectedReports === "CancelOrder" && "Cancel Orders Report"}
                  {selectedReports === "Sales" && "Sales Report"}
                  {selectedReports === "Coupons" && "Coupons Report"}
                  {selectedReports === "ProductSales" && "Product Sales Report"}
                  {selectedReports === "ProductReview" &&
                    "Product Review Report"}
                </h5>
                {renderReport()}
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
                    <label htmlFor="input-date-start">Date Start</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Date Start"
                      id="input-date-start"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="input-date-end">Date End</label>
                    <input
                      type="date"
                      name="input-date-end"
                      className="form-control"
                      placeholder="Date End"
                      id="input-date-end"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  {/* onClick={applyFilter} */}
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

export default AdminReports;
