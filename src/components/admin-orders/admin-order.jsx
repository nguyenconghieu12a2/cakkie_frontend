import { useEffect, useState } from "react";
import Sidebar from "../admin-sidebar/sidebar.jsx";
import "../../styles/admin-orders/order.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FaBars, FaPenToSquare } from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useNavigate, Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Form from "react-bootstrap/Form";
import { Col, Container, Row } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import AvatarHeader from "../admin-header/admin-header.jsx";
//API
const api = "/api/admin/order";
const status = "/api/admin/order/statuses";
const orderStatus = "/api/admin/order/status";
const updateStatus = "/api/admin/order/update-status";

const Order = () => {
  const [show, setShow] = useState(false);
  const [editOrderId, setEditOrderId] = useState(null);
  const [order, setOrder] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); // For filtered orders
  const [allStatuses, setAllStatuses] = useState([]);
  const [statusById, setStatusById] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // For search input

  // Logout
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
  const [reason, setReason] = useState("");
  const [statusError, setStatusError] = useState("");
  const [statusSuccess, setStatusSuccess] = useState("");

  const handleStatusChange = (e) => {
    const selectedStatusId = e.target.value;
    setStatusById(selectedStatusId);

    // Reset cancel reason if status is not "Cancel"
    const selectedStatus = allStatuses.find(
      (status) => status.orderStatusId === parseInt(selectedStatusId)
    );
    if (selectedStatus && selectedStatus.status === "Cancel") {
      setReason(""); // Clear cancel reason when changing to "Cancel"
    } else {
      setReason(null); // Disable cancel reason for other statuses
    }
  };

  // Update the order status by order ID
  const handleUpdateStatus = async () => {
    if (!editOrderId || !statusById) {
      console.error("Order ID or Status ID is not set");
      return;
    }

    const selectedStatus = allStatuses.find(
      (status) => status.orderStatusId === parseInt(statusById)
    );
    if (
      selectedStatus &&
      selectedStatus.status === "Cancel" &&
      (!reason || reason.trim() === "")
    ) {
      setStatusError("Cancel reason is required for canceling an order");
      setTimeout(() => setStatusError(), 5000);
      return;
    }

    try {
      await axios.put(`${updateStatus}/${editOrderId}`, {
        statusId: parseInt(statusById),
        cancelReason: reason || null,
      });
      loadOrders();
      setStatusSuccess("Order status updated successfully!"); // Set success message
      setTimeout(() => setStatusSuccess(""), 5000);
      // handleClose();
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
        <Sidebar onLogout={handleLogoutClick} />
        <div className="order__wrap">
          <div className="order__head">
            <div className="order__head--main">
              <h3 className="order__title">Order</h3>
              <AvatarHeader />
            </div>

            <div className="order__breadcrumb">
              <p>
                <Link to="/dashboard">Home</Link> / Sales / Order
              </p>
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
                    {displayData.length > 0 ? (
                      displayData.map((item, index) => (
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
                          <td
                            className={`td status-${item.status.toLowerCase()}`}
                          >
                            {item.status}
                          </td>
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No data available.
                        </td>
                      </tr>
                    )}
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

            {/* Conditionally render Cancel Reason input */}
            {allStatuses.find(
              (status) => status.orderStatusId === parseInt(statusById)
            )?.status === "Cancel" && (
              <Form.Group controlId="cancelReasonInput" className="mt-3">
                <Form.Label>Cancel Reason</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter the reason for cancellation"
                />
              </Form.Group>
            )}
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
        {statusError && (
          <Alert variant="danger" className="text-center">
            {statusError}
          </Alert>
        )}
        {statusSuccess && (
          <Alert variant="success" className="text-center mt-2">
            {statusSuccess}
          </Alert>
        )}
      </Modal>
      ;
    </>
  );
};

export default Order;
