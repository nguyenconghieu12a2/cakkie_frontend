import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./card";
import Chart from "./chart";
import Sidebar from "../admin-sidebar/sidebar";
import Pagination from "react-bootstrap/Pagination";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import "../../styles/dashboard/dashboard.css";
// import customerData from "./data/customer";
// import ordersData from "./data/order";
import AvatarHeader from "../admin-header/admin-header";

const api1 = "/api/admin/table-order";
const api2 = "/api/admin/table-customer";
const api3 = "/api/admin/cards";

const Dashboard = () => {
  const navigate = useNavigate();
  const [ordersData, setOrderData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [cardsData, setCardsData] = useState([]);
  const [error, setError] = useState(null);

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`${api2}`);
      setCustomerData(response.data);
    } catch (err) {
      setError(err.message);
    }
  };
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${api1}`);
      setOrderData(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCards = async () => {
    try {
      const response = await axios.get(`${api3}`);
      setCardsData(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCards();
    fetchOrders();
    fetchCustomer();
  }, []);

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

  const [itemPerPageOrder, setItemPerPageOrder] = useState(5);
  const [itemPerPageCustomer, setItemPerPageCustomer] = useState(5);

  const [currentPageOrder, setCurrentPageOrder] = useState(1);
  const [currentPageCustomer, setCurrentPageCustomer] = useState(1);

  const totalResultOrder = ordersData.length;
  const totalResultCustomer = customerData.length;

  const totalPagesOrder = Math.ceil(totalResultOrder / itemPerPageOrder);
  const totalPagesCustomer = Math.ceil(
    totalResultCustomer / itemPerPageCustomer
  );

  const pagedResultOrder = ordersData.slice(
    (currentPageOrder - 1) * itemPerPageOrder,
    currentPageOrder * itemPerPageOrder
  );

  const pagedResultCustomer = customerData.slice(
    (currentPageCustomer - 1) * itemPerPageCustomer,
    currentPageCustomer * itemPerPageCustomer
  );

  //Order
  const goToNextPageOrder = () => {
    if (currentPageOrder < totalPagesOrder) {
      setCurrentPageOrder(currentPageOrder + 1);
    }
  };
  const goToPreviousPageOrder = () => {
    if (currentPageOrder > 1) {
      setCurrentPageOrder(currentPageOrder - 1);
    }
  };

  const goToFirstPageOrder = () => {
    setCurrentPageOrder(1);
  };

  const goToLastPageOrder = () => {
    setCurrentPageOrder(totalPagesOrder);
  };

  const handleItemPerPageChangeOrder = (e) => {
    setItemPerPageOrder(Number(e.target.value));
    setCurrentPageOrder(1);
  };

  //Customer
  const goToNextPageCustomer = () => {
    if (currentPageCustomer < totalPagesCustomer) {
      setCurrentPageCustomer(currentPageCustomer + 1);
    }
  };
  const goToPreviousPageCustomer = () => {
    if (currentPageCustomer > 1) {
      setCurrentPageCustomer(currentPageCustomer - 1);
    }
  };

  const goToFirstPageCustomer = () => {
    setCurrentPageCustomer(1);
  };

  const goToLastPageCustomer = () => {
    setCurrentPageCustomer(totalPagesCustomer);
  };

  const handleItemPerPageChangeCustomer = (e) => {
    setItemPerPageCustomer(Number(e.target.value));
    setCurrentPageCustomer(1);
  };

  return (
    <div className="customer-table-container">
      <div>
        <Sidebar onLogout={handleLogoutClick} />
      </div>
      <div className="dashboard-container">
        <div className="upper-title">
          <div className="profile-header1">
            <h2>Dashboard</h2>
            <p>
              <Link to="/dashboard">Home</Link> / Dashboard
            </p>
          </div>
          <AvatarHeader />
        </div>
        <hr className="hrr" />
        <div className="d-flex flex-wrap justify-content-between">
          {cardsData.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>

        <Chart />

        {/* <div className="d-flex justify-content-between"> */}
        <Row>
          <Col md={6} style={{ padding: "0px 0px 0px 20px", margin: "0" }}>
            <div>
              <h2 className="title-table">Orders</h2>
            </div>
            <div className="items-per-page">
              <div>
                <label>Items per page: </label>
                <select
                  value={itemPerPageOrder}
                  onChange={handleItemPerPageChangeOrder}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </div>
            </div>
            <table className="table table-bordered" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ background: "#F4D68A" }}>#</th>
                  <th style={{ background: "#F4D68A" }}>Username</th>
                  <th style={{ background: "#F4D68A" }}>Ship method</th>
                  <th style={{ background: "#F4D68A" }}>Payment</th>
                  <th style={{ background: "#F4D68A" }}>Status</th>
                  <th style={{ background: "#F4D68A" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {/* Check if there are no banned customers to display */}
                {ordersData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      <div className="no-data-message">No orders found</div>
                    </td>
                  </tr>
                ) : (
                  pagedResultOrder.map((order, index) => (
                    <tr key={index}>
                      <td>
                        {(currentPageOrder - 1) * itemPerPageOrder + index + 1}
                      </td>
                      <td>{order.username}</td>
                      <td style={{ textAlign: "center" }}>{order.name}</td>
                      <td style={{ textAlign: "center" }}>{order.payment}</td>
                      <td style={{ textAlign: "center" }}>{order.status}</td>
                      <td>{order.orderTotal}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="pagging">
              <Pagination className="custom-pagination">
                <Pagination.First
                  onClick={goToFirstPageOrder}
                  disabled={currentPageOrder <= 1}
                />
                <Pagination.Prev
                  onClick={goToPreviousPageOrder}
                  disabled={currentPageOrder <= 1}
                />

                <Pagination.Item>
                  {currentPageOrder} / {totalPagesOrder}
                </Pagination.Item>

                <Pagination.Next
                  onClick={goToNextPageOrder}
                  disabled={currentPageOrder >= totalPagesOrder}
                />
                <Pagination.Last
                  onClick={goToLastPageOrder}
                  disabled={currentPageOrder >= totalPagesOrder}
                />
              </Pagination>
            </div>
          </Col>
          <Col md={6} style={{ padding: "0px 0px 0px 30px", margin: "0" }}>
            <div>
              <h2 className="title-table">Customers</h2>
            </div>
            <div className="items-per-page">
              <div>
                <label>Items per page: </label>
                <select
                  value={itemPerPageCustomer}
                  onChange={handleItemPerPageChangeCustomer}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </div>
            </div>
            {/* User Data Table */}
            <table className="table table-bordered" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ background: "#A6DEF2" }}>#</th>
                  <th style={{ background: "#A6DEF2" }}>Username</th>
                  <th style={{ background: "#A6DEF2" }}>Email</th>
                  <th style={{ background: "#A6DEF2" }}>Total Order</th>
                  <th style={{ background: "#A6DEF2" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {/* Check if there are no banned customers to display */}
                {customerData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      <div className="no-data-message">No customers found</div>
                    </td>
                  </tr>
                ) : (
                  pagedResultCustomer.map((customer, index) => (
                    <tr key={index}>
                      <td>
                        {(currentPageCustomer - 1) * itemPerPageCustomer +
                          index +
                          1}
                      </td>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td style={{ textAlign: "center" }}>
                        {customer.totalOrder}
                      </td>
                      <td>{customer.totalPayment}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="pagging">
              <Pagination className="custom-pagination">
                <Pagination.First
                  onClick={goToFirstPageCustomer}
                  disabled={currentPageCustomer <= 1}
                />
                <Pagination.Prev
                  onClick={goToPreviousPageCustomer}
                  disabled={currentPageCustomer <= 1}
                />

                <Pagination.Item>
                  {currentPageCustomer} / {totalPagesCustomer}
                </Pagination.Item>

                <Pagination.Next
                  onClick={goToNextPageCustomer}
                  disabled={currentPageCustomer >= totalPagesCustomer}
                />
                <Pagination.Last
                  onClick={goToLastPageCustomer}
                  disabled={currentPageCustomer >= totalPagesCustomer}
                />
              </Pagination>
            </div>
          </Col>
        </Row>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
