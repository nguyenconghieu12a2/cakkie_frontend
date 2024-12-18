import Sidebar from "../admin-sidebar/sidebar.jsx";
import { useEffect, useState } from "react";
import { FaRegSquarePlus, FaPenToSquare, FaTrash } from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import "../../styles/admin-coupons/coupon.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import AvatarHeader from "../admin-header/admin-header.jsx";

//Get coupons api
const api = "/api/admin/coupons";
const addCou = "/api/admin/add-coupons";
const updateCou = "/api/admin/update-coupons";
const deleteCou = "/api/admin/delete-coupons";

const Coupon = () => {
  //Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCoupons, setFilteredCoupons] = useState([]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = coupons.filter((coupon) =>
      Object.values(coupon).join(" ").toLowerCase().includes(term)
    );
    setFilteredCoupons(filtered);
    setCurrentPage(0); // Reset to first page on new search
  };

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

  const [lgShow, setLgShow] = useState(false);
  const handleClose = () => setLgShow(false);

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);

  const handleShow2 = (id) => {
    setDeleteId(id); // Set the ID to be deleted
    setShow2(true);
  };

  // Fetch coupon data
  const [coupons, setCoupons] = useState([]);
  const loadCoupons = async () => {
    const result = await axios.get(`${api}`);
    setCoupons(result.data);
    setFilteredCoupons(result.data);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  // Helper function to format dates to YYYY-MM-DD
  const formatDateForBackend = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Helper function to convert API dates for datetime-local input
  const formatToDateTimeLocal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Create a new coupon
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    name: "",
    quantity: "",
    priceDiscount: "",
    startDate: "",
    endDate: "",
    isDeleted: 1,
  });

  const handleInputChange = (e) => {
    setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value });
  };

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const startDate = new Date(newCoupon.startDate);
  const endDate = new Date(newCoupon.endDate);
  const quantity = new Number(newCoupon.quantity);
  const priceDiscount = new Number(newCoupon.priceDiscount);
  const currentDate = new Date();

  const saveCoupons = async (e) => {
    e.preventDefault();

    if (
      newCoupon.code === "" ||
      newCoupon.name === "" ||
      newCoupon.quantity === "" ||
      newCoupon.priceDiscount === "" ||
      newCoupon.startDate === "" ||
      newCoupon.endDate === ""
    ) {
      setError("Please fill in all required fields.");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    } else if (startDate < currentDate) {
      setError("The start date must be from now to the future");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    } else if (endDate <= startDate) {
      setError("The end date must be later than the start date.");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    } else if (quantity <= 0) {
      setError("The quantity must be greater than 0.");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    } else if (priceDiscount <= 1000) {
      setError("The price discount must be greater than 1000");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    const formattedCoupon = {
      ...newCoupon,
      startDate: formatDateForBackend(newCoupon.startDate),
      endDate: formatDateForBackend(newCoupon.endDate),
    };

    try {
      // console.log(
      //   "check start date:",
      //   formatDateForBackend(newCoupon.startDate)
      // );
      // console.log("check end date:", formatDateForBackend(newCoupon.endDate));
      await axios.post(`${addCou}`, formattedCoupon);
      // handleClose();
      loadCoupons();
      setNewCoupon({
        code: "",
        name: "",
        quantity: "",
        priceDiscount: "",
        startDate: "",
        endDate: "",
        isDeleted: 1,
      });
      setSuccess("Coupon updated successfully!");
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Error saving coupon:", error);
    }
  };

  // Edit Coupons
  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => {
    setShowEdit(false);
    setEditCoupon({});
  };

  const [editCoupon, setEditCoupon] = useState([]);
  const [couponIdEdit, setCouponIdEdit] = useState(null);
  const [errorEdit, setErrorEdit] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  const handleEditInputChange = (e) => {
    setEditCoupon({ ...editCoupon, [e.target.name]: e.target.value });
  };

  const editCouponSubmit = async (e) => {
    const currentDate = new Date();
    const startDate = new Date(editCoupon.startDate);
    const endDate = new Date(editCoupon.endDate);

    e.preventDefault();

    if (
      editCoupon.code === "" ||
      editCoupon.name === "" ||
      editCoupon.quantity === "" ||
      editCoupon.priceDiscount === "" ||
      editCoupon.startDate === "" ||
      editCoupon.endDate === ""
    ) {
      setErrorEdit("Please fill in all required fields.");
      setTimeout(() => {
        setErrorEdit("");
      }, 3000);
      return;
    } else if (editCoupon.quantity <= 0) {
      setErrorEdit("The quantity must be greater than 0.");
      setTimeout(() => {
        setErrorEdit("");
      }, 3000);
      return;
    } else if (editCoupon.priceDiscount <= 1000) {
      setErrorEdit("The price discount must be greater than 1000.");
      setTimeout(() => {
        setErrorEdit("");
      }, 3000);
      return;
    } else if (startDate < currentDate) {
      setErrorEdit("The start date must be from now to the future.");
      setTimeout(() => {
        setErrorEdit("");
      }, 3000);
      return;
    } else if (endDate <= startDate) {
      setErrorEdit("The end date must be later than the start date.");
      setTimeout(() => {
        setErrorEdit("");
      }, 3000);
      return;
    }
    const formattedCoupon = {
      ...editCoupon,
      startDate: formatDateForBackend(editCoupon.startDate),
      endDate: formatDateForBackend(editCoupon.endDate),
    };

    try {
      await axios.put(`${updateCou}/${couponIdEdit}`, formattedCoupon);
      // handleCloseEdit();
      loadCoupons();
      setEditSuccess("Update coupons successfully!");
      setTimeout(() => {
        setEditSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Error editing coupon:", error);
    }
  };

  // Store the ID of the coupon to delete
  const [deleteId, setDeleteId] = useState(null);
  const [deleError, setDeleError] = useState("");
  const [deleSucces, setDeleSuccess] = useState("");

  const handleDelete = async () => {
    const couponToDelete = coupons.find((coupon) => coupon.id === deleteId);
    const currentDate = new Date();
    const couponStartDate = new Date(couponToDelete.startDate);
    const couponEndDate = new Date(couponToDelete.endDate);

    if (currentDate >= couponStartDate && currentDate <= couponEndDate) {
      setDeleError("Cannot delete the coupon because it is currently active.");
      setTimeout(() => setDeleError(""), 3000);
      return;
    }

    try {
      await axios.delete(`${deleteCou}/${deleteId}`);
      setDeleSuccess("Coupon deleted successfully.");
      setTimeout(() => setDeleSuccess(""), 3000);
      loadCoupons();
      handleClose2();
    } catch (error) {
      setDeleError("Error deleting coupon:", error);
      setTimeout(() => setDeleError(), 3000);
    }
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Number of items to display per page
  const pageCount = Math.ceil(filteredCoupons.length / itemsPerPage);
  const displayData = filteredCoupons.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  //Format Price
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

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <>
      <div className="main__wrap">
        <Sidebar onLogout={handleLogoutClick} />
        <div className="coupon__wrap">
          <div className="coupon__head">
            <div className="coupon__head--main">
              <h3 className="coupon__title">Coupon</h3>
              <AvatarHeader />
            </div>

            <div className="coupon__breadcrumb">
              <p>
                <Link to="/dashboard">Home</Link> / Sales / Coupon
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
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search__input"
                  />
                </Col>
              </Row>
            </Container>
          </div>

          <div className="coupon__body__wrap">
            <div className="coupon__body">
              <div className="coupon__body--head">
                <h4 className="coupon__body--title">Coupon</h4>
                <a>
                  <FaRegSquarePlus
                    className="coupon__icon--add"
                    onClick={() => setLgShow(true)}
                  />
                  <Modal
                    size="lg"
                    show={lgShow}
                    onHide={handleClose}
                    aria-labelledby="example-modal-sizes-title-lg"
                  >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-modal-sizes-title-lg">
                        Add Coupon
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form onSubmit={saveCoupons}>
                        <Form.Group className="mb-3">
                          <Form.Label>Code</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="SU24"
                            value={newCoupon.code}
                            name="code"
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Coupon Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Summer 2024"
                            value={newCoupon.name}
                            name="name"
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Quantity</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="10"
                            value={newCoupon.quantity}
                            name="quantity"
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Price Discount</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="10000"
                            value={newCoupon.priceDiscount}
                            name="priceDiscount"
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Start Date</Form.Label>
                          <Form.Control
                            type="datetime-local"
                            value={newCoupon.startDate}
                            name="startDate"
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>End Date</Form.Label>
                          <Form.Control
                            type="datetime-local"
                            value={newCoupon.endDate}
                            name="endDate"
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Close
                          </Button>
                          <Button variant="success" type="submit">
                            Create
                          </Button>
                        </Modal.Footer>
                      </Form>
                    </Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                  </Modal>
                </a>
              </div>

              <div className="coupon__body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">Coupon ID</th>
                      <th className="th">Code</th>
                      <th className="th">Coupon Name</th>
                      <th className="th">Quantity</th>
                      <th className="th">Price Discount</th>
                      <th className="th">Start Date</th>
                      <th className="th">End Date</th>
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
                          <td className="td">{item.code}</td>
                          <td className="td">{item.name}</td>
                          <td className="td">{item.quantity}</td>
                          <td className="td">
                            {formatCurrency(item.priceDiscount)}
                          </td>
                          <td className="td">
                            {formatDateTime(item.startDate)}
                          </td>
                          <td className="td">{formatDateTime(item.endDate)}</td>
                          <td className="td handle__icon">
                            <a className="link__icon">
                              <FaPenToSquare
                                className="coupon__icon coupon__icon--edit"
                                onClick={() => {
                                  setCouponIdEdit(item.id);
                                  setEditCoupon({
                                    ...item,
                                    startDate: formatToDateTimeLocal(
                                      item.startDate
                                    ),
                                    endDate: formatToDateTimeLocal(
                                      item.endDate
                                    ),
                                  });
                                  setShowEdit(true);
                                }}
                              />
                            </a>

                            <Link className="link__icon">
                              <FaTrash
                                className="coupon__icon coupon__icon--delete"
                                onClick={() => handleShow2(item.id)}
                              />
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
                          No data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>

                {/* Pagination */}
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination justify-content-right"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  activeClassName={"active"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        size="lg"
        show={showEdit}
        onHide={handleCloseEdit}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Edit Coupon
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={editCouponSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="SU24"
                value={editCoupon.code}
                name="code"
                onChange={handleEditInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Coupon Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Summer 2024"
                value={editCoupon.name}
                name="name"
                onChange={handleEditInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="10"
                value={editCoupon.quantity}
                name="quantity"
                onChange={handleEditInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price Discount</Form.Label>
              <Form.Control
                type="number"
                placeholder="10000"
                value={editCoupon.priceDiscount}
                name="priceDiscount"
                onChange={handleEditInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={editCoupon.startDate}
                name="startDate"
                onChange={handleEditInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={editCoupon.endDate}
                name="endDate"
                onChange={handleEditInputChange}
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEdit}>
                Close
              </Button>
              <Button variant="warning" type="submit">
                Update
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
        {errorEdit && <Alert variant="danger">{errorEdit}</Alert>}
        {editSuccess && <Alert variant="success">{editSuccess}</Alert>}
      </Modal>

      <Modal
        show={show2}
        onHide={handleClose2}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Coupon</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this coupon?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
        {deleError && (
          <Alert variant="danger" className="mt-2">
            {deleError}
          </Alert>
        )}
        {deleSucces && (
          <Alert variant="success" className="mt-2">
            {deleSucces}
          </Alert>
        )}
      </Modal>
    </>
  );
};

export default Coupon;
