import Sidebar from "../sidebar";
import { useEffect, useState } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FaRegSquarePlus, FaPenToSquare, FaTrash } from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import "../../styles/coupon.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

function Coupon() {
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
    const result = await axios.get(`http://localhost:8080/api/coupons`);
    setCoupons(result.data);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  // Helper function to format dates to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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
      return;
    } else if (startDate < currentDate) {
      setError("The start date must be from now to the future");
      return;
    } else if (endDate <= startDate) {
      setError("The end date must be later than the start date.");
      return;
    } else if (quantity <= 0) {
      setError("The quantity must be greater than 0.");
      return;
    } else if (priceDiscount <= 1000) {
      setError("The price discount must be greater than 1000");
      return;
    }
    setError("");

    try {
      await axios.post(`http://localhost:8080/api/coupons`, newCoupon);
      handleClose();
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

  const handleEditInputChange = (e) => {
    setEditCoupon({ ...editCoupon, [e.target.name]: e.target.value });
  };

  const editCouponSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/api/coupons/update/${couponIdEdit}`,
        editCoupon
      );
      handleCloseEdit();
      loadCoupons();
    } catch (error) {
      console.error("Error editing coupon:", error);
    }
  };

  // Store the ID of the coupon to delete
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/coupons/delete/${deleteId}`
      );
      loadCoupons(); // Reload the coupon list after deletion
      handleClose2(); // Close the confirmation modal
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Number of items to display per page
  const pageCount = Math.ceil(coupons.length / itemsPerPage);
  const displayData = coupons.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <>
      <div className="main__wrap">
        <Sidebar />
        <div className="coupon__wrap">
          <div className="coupon__head">
            <div className="coupon__head--main">
              <h3 className="coupon__title">Coupon</h3>
              <div className="admin__avatar">
                <img src="../images/diddy.jpg" alt="Avatar" />
              </div>
            </div>

            <div className="coupon__breadcrumb">
              <Breadcrumb>
                <Breadcrumb.Item active>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Catalog</Breadcrumb.Item>
                <Breadcrumb.Item active>Coupon</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr />
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
                            type="date"
                            value={newCoupon.startDate}
                            name="startDate"
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>End Date</Form.Label>
                          <Form.Control
                            type="date"
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
                    {displayData.map((item, index) => (
                      <tr key={item.id}>
                        <td className="td">
                          {index + 1 + currentPage * itemsPerPage}
                        </td>
                        <td className="td">{item.code}</td>
                        <td className="td">{item.name}</td>
                        <td className="td">{item.quantity}</td>
                        <td className="td">{item.priceDiscount} VNĐ</td>
                        <td className="td">{item.startDate}</td>
                        <td className="td">{item.endDate}</td>
                        <td className="td handle__icon">
                          <a className="link__icon">
                            <FaPenToSquare
                              className="coupon__icon coupon__icon--edit"
                              onClick={() => {
                                setCouponIdEdit(item.id);
                                setEditCoupon({
                                  ...item,
                                  startDate: formatDate(item.startDate),
                                  endDate: formatDate(item.endDate),
                                });
                                setShowEdit(true);
                              }}
                            />
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
                                      type="date"
                                      value={editCoupon.startDate}
                                      name="startDate"
                                      onChange={handleEditInputChange}
                                    />
                                  </Form.Group>
                                  <Form.Group className="mb-3">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                      type="date"
                                      value={editCoupon.endDate}
                                      name="endDate"
                                      onChange={handleEditInputChange}
                                    />
                                  </Form.Group>
                                  <Modal.Footer>
                                    <Button
                                      variant="secondary"
                                      onClick={handleCloseEdit}
                                    >
                                      Close
                                    </Button>
                                    <Button variant="warning" type="submit">
                                      Update
                                    </Button>
                                  </Modal.Footer>
                                </Form>
                              </Modal.Body>
                              {error && <Alert variant="danger">{error}</Alert>}
                            </Modal>
                          </a>

                          <a className="link__icon">
                            <FaTrash
                              className="coupon__icon coupon__icon--delete"
                              onClick={() => handleShow2(item.id)}
                            />
                            <Modal
                              show={show2}
                              onHide={handleClose2}
                              backdrop="static"
                              keyboard={false}
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>Delete Coupon</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                Are you sure you want to delete this coupon?
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="secondary"
                                  onClick={handleClose2}
                                >
                                  Close
                                </Button>
                                <Button variant="danger" onClick={handleDelete}>
                                  Delete
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          </a>
                        </td>
                      </tr>
                    ))}
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
    </>
  );
}

export default Coupon;
