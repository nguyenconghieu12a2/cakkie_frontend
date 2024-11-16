import { useEffect, useState } from "react";
import Sidebar from "../sidebar.js";
import "../../styles/admin-cancel-order/canceled-order.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FaBars, FaLock } from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Form from "react-bootstrap/Form";

//API
//GET CANCELED
const api = "/api/admin/cacel-order";

//BAN CUSTOMER
const banApi = "/api/admin/ban-user";

function CanceledOrder() {
  const [show2, setShow2] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false); // Notification modal state
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const handleCloseNotificationModal = () => setShowNotificationModal(false);

  // State for managing banned users
  const [bannedUsers, setBannedUsers] = useState(new Set());
  const [alertVisible, setAlertVisible] = useState(false);

  // Fetch canceled orders
  const [cancelOrder, setCancelOrder] = useState([]);
  const loadCancel = async () => {
    try {
      const result = await axios.get(`${api}`);
      setCancelOrder(result.data);
    } catch (error) {
      console.error("Error fetching canceled orders:", error);
    }
  };

  useEffect(() => {
    loadCancel();
  }, []);

  // Lock Customer functionality
  const [banReason, setBanReason] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleBanUser = async () => {
    if (!selectedUserId || !banReason) {
      alert("Please enter a reason for banning the user.");
      return;
    }
    try {
      await axios.post(
        `${banApi}/${selectedUserId}`,
        banReason,
        {
          headers: { "Content-Type": "text/plain" },
        }
      );
      setBannedUsers((prev) => new Set(prev).add(selectedUserId));
      setAlertVisible(true); // Show success alert
      setTimeout(() => setAlertVisible(false), 3000); // Hide alert after 3 seconds
      handleClose2();
      setBanReason("");
      loadCancel();
    } catch (error) {
      console.error("Failed to ban user:", error);
      alert("Failed to ban user. Please try again.");
    }
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(cancelOrder.length / itemsPerPage);
  const displayData = cancelOrder.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <>
      <div className="main__wrap">
        <div className="navbar">
          <Sidebar />
        </div>
        <div className="canceled__wrap">
          <div className="canceled__head">
            <div className="canceled__head--main">
              <h3 className="canceled__title">Canceled Order</h3>
              <div className="admin__avatar">
                <img src="../images/diddy.jpg" alt="Avatar" />
              </div>
            </div>
            <div className="canceled__breadcrumb">
              <Breadcrumb>
                <Breadcrumb.Item link>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Catalog</Breadcrumb.Item>
                <Breadcrumb.Item active>Sales</Breadcrumb.Item>
                <Breadcrumb.Item active>Canceled Order</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr />
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
                    {displayData.map((item, index) => (
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

                          <Modal show={show2} onHide={handleClose2}>
                            <Modal.Header closeButton>
                              <Modal.Title>Lock Customer</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              Are you sure you want to lock this customer?
                              <Form>
                                <Form.Group className="mb-3">
                                  <Form.Label>
                                    Reason for locking this customer
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="Reason for lock..."
                                    value={banReason}
                                    onChange={(e) =>
                                      setBanReason(e.target.value)
                                    }
                                  />
                                </Form.Group>
                              </Form>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                variant="secondary"
                                onClick={handleClose2}
                              >
                                Close
                              </Button>
                              <Button variant="danger" onClick={handleBanUser}>
                                Lock
                              </Button>
                            </Modal.Footer>
                          </Modal>

                          {/* Notification Modal for insufficient cancellations */}
                          <Modal
                            show={showNotificationModal}
                            onHide={handleCloseNotificationModal}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>Cannot Lock Customer</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              This customer needs to have more than 5 canceled
                              orders to be locked.
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                variant="secondary"
                                onClick={handleCloseNotificationModal}
                              >
                                Close
                              </Button>
                            </Modal.Footer>
                          </Modal>
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
    </>
  );
}

export default CanceledOrder;
