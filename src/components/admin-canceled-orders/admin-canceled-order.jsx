import { useEffect, useState } from "react";
import Sidebar from "../admin-sidebar/sidebar.jsx";
import "../../styles/admin-cancel-order/canceled-order.css";
import { FaBars, FaLock } from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Form from "react-bootstrap/Form";
import { Col, Container, Row } from "react-bootstrap";
import AvatarHeader from "../admin-header/admin-header.jsx";
//API
const api = "/api/admin/cacel-order";
const banApi = "/api/admin/ban-user";

const CanceledOrder = () => {
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

  const [filteredOrders, setFilteredOrders] = useState([]); // For filtered results
  const [searchTerm, setSearchTerm] = useState("");

  const [show2, setShow2] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const handleCloseNotificationModal = () => setShowNotificationModal(false);

  const [bannedUsers, setBannedUsers] = useState(new Set());
  const [alertVisible, setAlertVisible] = useState(false);

  const [cancelOrder, setCancelOrder] = useState([]);
  const loadCancel = async () => {
    try {
      const result = await axios.get(`${api}`);
      setCancelOrder(result.data);
      setFilteredOrders(result.data); // Initialize filtered orders
    } catch (error) {
      console.error("Error fetching canceled orders:", error);
    }
  };

  useEffect(() => {
    loadCancel();
  }, []);

  useEffect(() => {
    // Update filtered orders whenever cancelOrder changes
    setFilteredOrders(cancelOrder);
  }, [cancelOrder]);

  const [banReason, setBanReason] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [banError, setBanError] = useState("");

  const handleBanUser = async () => {
    if (!selectedUserId || !banReason) {
      setBanError("Please enter a reason for banning the user.");
      setTimeout(() => setBanError(), 3000);
      return;
    }
    try {
      await axios.post(`${banApi}/${selectedUserId}`, banReason, {
        headers: { "Content-Type": "text/plain" },
      });
      setBannedUsers((prev) => new Set(prev).add(selectedUserId));
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
      handleClose2();
      setBanReason("");
      loadCancel();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setBanError(error.response.data);
        setTimeout(() => setBanError(), 5000);
      } else {
        setBanError("Failed to ban user:", error);
        setBanError("Failed to ban user. Please try again.");
        setTimeout(() => setBanError(), 5000);
      }
    }
  };

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

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = cancelOrder.filter((item) =>
      Object.values(item)
        .map((value) => String(value))
        .join(" ")
        .toLowerCase()
        .includes(term)
    );

    setFilteredOrders(filtered);
    setCurrentPage(0);
  };

  return (
    <>
      <div className="main__wrap">
        <div className="navbar">
          <Sidebar onLogout={handleLogoutClick} />
        </div>
        <div className="canceled__wrap">
          <div className="canceled__head">
            <div className="canceled__head--main">
              <h3 className="canceled__title">Canceled Order</h3>
              <AvatarHeader />
            </div>
            <div className="canceled__breadcrumb">
              <p>
                <Link to="/dashboard">Home</Link> / Sales / Cancel Order
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

          {alertVisible && (
            <Alert
              variant="success"
              onClose={() => setAlertVisible(false)}
              dismissible
            >
              User has been banned successfully.
            </Alert>
          )}

          <div className="canceled__body__wrap">
            <div className="canceled__body">
              <div className="canceled__body--head">
                <h4 className="canceled__body--title">Canceled Order</h4>
              </div>

              <div className="canceled__body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">Order ID</th>
                      <th className="th">Customer Name</th>
                      <th className="th">Total Canceled Order</th>
                      <th className="th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.length > 0 ? (
                      displayData.map((item, index) => (
                        <tr key={item.id}>
                          <td className="td">
                            {index + 1 + currentPage * itemsPerPage}
                          </td>
                          <td className="td">{item.fullName}</td>
                          <td className="td">{item.totalCancel}</td>
                          <td className="th handle__icon">
                            <Link
                              to={`/list-canceled/${item.id}`}
                              className="link__icon"
                            >
                              <FaBars className="canceled__icon canceled__icon--menu" />
                            </Link>

                            <div className="link__icon">
                              <FaLock
                                className={`canceled__icon canceled__icon--delete ${
                                  bannedUsers.has(item.id) ||
                                  item.totalCancel <= 5
                                    ? "disabled"
                                    : ""
                                }`}
                                title={
                                  bannedUsers.has(item.id)
                                    ? "User is already banned"
                                    : item.totalCancel > 5
                                    ? "Ban this user"
                                    : "Customer must have more than 5 canceled orders to be banned"
                                }
                                onClick={() => {
                                  if (
                                    item.totalCancel > 5 &&
                                    !bannedUsers.has(item.id)
                                  ) {
                                    setSelectedUserId(item.id);
                                    handleShow2();
                                  } else if (item.totalCancel <= 5) {
                                    setShowNotificationModal(true);
                                  }
                                }}
                              />
                            </div>

                            {/* Notification Modal for insufficient cancellations */}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
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

      {/* Modal Lock */}
      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Lock Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to lock this customer?
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Reason for locking this customer</Form.Label>
              <Form.Control
                type="text"
                placeholder="Reason for lock..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          <Button variant="danger" onClick={handleBanUser}>
            Lock
          </Button>
        </Modal.Footer>
        {banError && (
          <Alert variant="danger" className="text-center">
            {banError}
          </Alert>
        )}
      </Modal>

      {/* Modal */}
      <Modal show={showNotificationModal} onHide={handleCloseNotificationModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cannot Lock Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This customer needs to have more than 5 canceled orders to be locked.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseNotificationModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CanceledOrder;
