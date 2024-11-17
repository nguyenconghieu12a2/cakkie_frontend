import { useEffect, useState } from "react";
import Sidebar from "../sidebar.js";
import "../../styles/admin-orders/order.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FaBars, FaPenToSquare } from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Form from "react-bootstrap/Form";
import { Col, Container, Row } from "react-bootstrap";

//API
const api = "/api/admin/order";
const status = "/api/admin/order/statuses";
const orderStatus = "/api/admin/order/status";
const updateStatus = "/api/admin/order/update-status";

function Order() {
  const [show, setShow] = useState(false);
  const [editOrderId, setEditOrderId] = useState(null);
  const [order, setOrder] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); // For filtered orders
  const [allStatuses, setAllStatuses] = useState([]);
  const [statusById, setStatusById] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // For search input

  // Pagination setup
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const pageCount = Math.ceil(filteredOrders.length / itemsPerPage);

  const displayData = filteredOrders.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // Close and open modal
  const handleClose = () => {
    setShow(false);
    setEditOrderId(null);
    setStatusById(null);
  };

  const handleShow = () => setShow(true);

  // Load all orders
  const loadOrders = async () => {
    try {
      const result = await axios.get(`${api}`);
      setOrder(result.data);
      setFilteredOrders(result.data); // Initialize filtered orders
    } catch (error) {
      console.error("Failed to load orders", error);
    }
  };

  // Load all statuses
  const loadAllStatuses = async () => {
    try {
      const result = await axios.get(`${status}`);
      setAllStatuses(result.data);
    } catch (error) {
      console.error("Failed to load order statuses", error);
    }
  };

  // Load the current status by order ID
  const loadStatusById = async (orderId) => {
    try {
      const result = await axios.get(`${orderStatus}/${orderId}`);
      setStatusById(result.data.orderStatusId);
    } catch (error) {
      console.error("Failed to load current order status", error);
    }
  };

  // Called when clicking the edit icon
  const handleEditClick = async (orderId) => {
    if (orderId) {
      setEditOrderId(orderId);
      await loadStatusById(orderId);
      handleShow();
    } else {
      console.error("Order ID is not valid");
    }
  };

  const getValidStatuses = () => {
    const currentStatus = statusById ? statusById : null;

    if (currentStatus === "Ordered") {
      return allStatuses.filter((status) => status.status === "Confirm");
    } else if (currentStatus === "Confirm") {
      return allStatuses.filter((status) => status.status === "Shipping");
    } else if (currentStatus === "Shipping") {
      return allStatuses.filter((status) => status.status === "Arrived");
    } else if (currentStatus === "Arrived") {
      return allStatuses.filter((status) => status.status === "Cancel");
    } else {
      return allStatuses;
    }
  };

  // Handle status selection change in the dropdown
  const handleStatusChange = (e) => {
    setStatusById(e.target.value);
  };

  // Update the order status by order ID
  const handleUpdateStatus = async () => {
    if (!editOrderId || !statusById) {
      console.error("Order ID or Status ID is not set");
      return;
    }

    try {
      await axios.put(`${updateStatus}/${editOrderId}`, {
        statusId: parseInt(statusById),
      });
      loadOrders();
      handleClose();
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  useEffect(() => {
    loadOrders();
    loadAllStatuses();
  }, []);

  useEffect(() => {
    setFilteredOrders(order);
  }, [order]);

  // Search logic
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = order.filter((item) =>
      Object.values(item)
        .map((value) => String(value))
        .join(" ")
        .toLowerCase()
        .includes(term)
    );

    setFilteredOrders(filtered);
    setCurrentPage(0);
  };

  // Format price
  const formatCurrency = (value) => {
    if (!value) return "0 VND";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    })
      .format(value)
      .replace("₫", "VND");
  };

  return (
    <>
      <div className="main__wrap">
        <Sidebar />
        <div className="order__wrap">
          <div className="order__head">
            <div className="order__head--main">
              <h3 className="order__title">Order</h3>
              <div className="admin__avatar">
                <img src="../images/diddy.jpg" alt="Avatar" />
              </div>
            </div>

            <div className="order__breadcrumb">
              <Breadcrumb>
                <Breadcrumb.Item link>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Catalog</Breadcrumb.Item>
                <Breadcrumb.Item active>Order</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr />
          </div>
          <div className="search__bar">
            <Container>
              <Row>
                <Col></Col>
                <Col></Col>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search__input"
                  />
                </Col>
              </Row>
            </Container>
          </div>
          <div className="order__body__wrap">
            <div className="order__body">
              <div className="order__body--head">
                <h4 className="order__body--title">Order</h4>
              </div>

              <div className="order__body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">Order ID</th>
                      <th className="th">Customer Name</th>
                      <th className="th">Total Product</th>
                      <th className="th">Total Price</th>
                      <th className="th">Discount Price</th>
                      <th className="th">Order Status</th>
                      <th className="th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.map((item, index) => (
                      <tr key={item.shopId}>
                        <td className="td">
                          {index + 1 + currentPage * itemsPerPage}
                        </td>
                        <td className="td">{item.fullName}</td>
                        <td className="td">{item.totalProduct}</td>
                        <td className="td">
                          {formatCurrency(item.totalPrice)}
                        </td>
                        <td className="td">
                          {formatCurrency(item.totalDiscount)}
                        </td>
                        <td className="td">{item.status}</td>
                        <td className="th handle__icon">
                          <div className="icon__container">
                            <Link
                              to={`/order/detail/${item.shopId}`}
                              className="link__icon"
                            >
                              <FaBars className="order__icon order__icon--menu" />
                            </Link>
                            <FaPenToSquare
                              className="order__icon order__icon--edit"
                              onClick={() => handleEditClick(item.shopId)}
                              variant="primary"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div>
                  <ReactPaginate
                    className="pagination"
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="< previous"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="orderStatusSelect">
              <Form.Label>Order Status</Form.Label>
              <Form.Select
                value={statusById || ""}
                onChange={handleStatusChange}
              >
                <option value="" disabled>
                  Select a status
                </option>
                {getValidStatuses().map((status) => (
                  <option
                    key={status.orderStatusId}
                    value={status.orderStatusId}
                  >
                    {status.status}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="warning" onClick={handleUpdateStatus}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Order;
