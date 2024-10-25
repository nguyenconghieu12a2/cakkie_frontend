import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./card";
import Chart from "./chart";
import Sidebar from "../sidebar/sidebar";
import Pagination from "react-bootstrap/Pagination";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import "../../styles/dashboard/dashboard.css";
import customerData from "./data/customer";
import ordersData from "./data/order";

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwt");
    if (!jwtToken) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogoutClick = () => {
    sessionStorage.removeItem("jwt");
    onLogout();
    navigate("/admin-login");
  };

  const cardsData = [
    {
      title: "Revenue",
      value: "5.500.000 đ",
      description: "+13.4%",
      icon: "bi-wallet",
      color: "green",
    },
    {
      title: "Costs",
      value: "4.500.000 đ",
      description: "-0.89%",
      icon: "bi-credit-card",
      color: "red",
    },
    {
      title: "Total Sales",
      value: "3.500.000 đ",
      description: "+1.34%",
      icon: "bi-cart",
      color: "green",
    },
    {
      title: "Total Orders",
      value: "5000",
      description: "-0.89%",
      icon: "bi-box-seam",
      color: "red",
    },
  ];

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
        <div className="d-flex flex-wrap justify-content-between">
          {cardsData.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>

        <Chart />

        {/* <div className="d-flex justify-content-between"> */}
        <Row>
          <Col md={6}>
            <div>
              <h2 className="title-table">Orders</h2>
            </div>
            <div className="items-per-page">
              <label>Items per page: </label>
              <select
                value={itemPerPageOrder}
                onChange={handleItemPerPageChangeOrder}
              >
                <option value={2}>2</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
            </div>
            <table className="table table-bordered" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ background: "#F4D68A" }}>#</th>
                  <th style={{ background: "#F4D68A" }}>Username</th>
                  <th style={{ background: "#F4D68A" }}>Ship method</th>
                  <th style={{ background: "#F4D68A" }}>Payment method</th>
                  <th style={{ background: "#F4D68A" }}>Order status</th>
                  <th style={{ background: "#F4D68A" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {pagedResultOrder.map((order, index) => (
                  <tr key={index}>
                    <td>{order.id}</td>
                    <td>{order.username}</td>
                    <td style={{ textAlign: "center" }}>{order.ship_method}</td>
                    <td style={{ textAlign: "center" }}>
                      {order.payment_method}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {order.order_status}
                    </td>
                    <td>{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          </Col>
          <Col md={6}>
            <div>
              <h2 className="title-table">Customers</h2>
            </div>
            <div className="items-per-page">
              <label>Items per page: </label>
              <select
                value={itemPerPageCustomer}
                onChange={handleItemPerPageChangeCustomer}
              >
                <option value={2}>2</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
            </div>
            {/* User Data Table */}
            <table className="table table-bordered" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ background: "#A6DEF2" }}>#</th>
                  <th style={{ background: "#A6DEF2" }}>Username</th>
                  <th style={{ background: "#A6DEF2" }}>Email</th>
                  <th style={{ background: "#A6DEF2" }}>Total Order</th>
                  <th style={{ background: "#A6DEF2" }}>Total Payment</th>
                </tr>
              </thead>
              <tbody>
                {pagedResultCustomer.map((customer, index) => (
                  <tr key={index}>
                    <td>{customer.id}</td>
                    <td>{customer.username}</td>
                    <td>{customer.email}</td>
                    <td style={{ textAlign: "center" }}>
                      {customer.total_order}
                    </td>
                    <td>{customer.total_payment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          </Col>
        </Row>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
