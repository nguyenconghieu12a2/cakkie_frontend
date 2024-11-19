import Sidebar from "../sidebar.jsx";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import "../../styles/admin-product/out-of-stock.css";
import { Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { FaRegSquarePlus } from "react-icons/fa6";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Get out-of-stock products API
const api = "/api/admin/oos-products";
// Update quantity API
const updateQuan = "api/admin/oos-products/update";

const OutOfStock = () => {
  // Logout
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwtAdmin");
    console.log(jwtToken);
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

  // State for out-of-stock products
  const [stock, setStock] = useState([]);
  const [filteredStock, setFilteredStock] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Search functionality
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = stock.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
    setFilteredStock(filtered);
    setCurrentPage(0); // Reset to the first page on search
  };

  // Load out-of-stock products
  const loadStock = async () => {
    try {
      const result = await axios.get(`${api}`);
      setStock(result.data);
      setFilteredStock(result.data); // Initialize filtered stock
    } catch (error) {
      console.error("Error loading stock:", error);
    }
  };

  useEffect(() => {
    loadStock();
  }, []);

  // Modal state
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (item) => {
    setSelectedProduct(item);
    setNewQuantity(item.quantity); // Initialize with the current quantity
    setShow(true);
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(filteredStock.length / itemsPerPage);

  const displayData = filteredStock.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // State for modal inputs
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newQuantity, setNewQuantity] = useState(0);

  // Quantity validation
  const [qtyError, setQtyError] = useState("");
  const [qtySuccess, setQtySuccess] = useState("");

  // Handle quantity change
  const handleQuantityChange = (event) => {
    const value = event.target.value;
    if (!isNaN(value) && value >= 0) {
      setNewQuantity(value); // Set the new quantity only if it's valid
    }
  };

  // Handle save to update quantity
  const handleSave = async () => {
    if (newQuantity === "" || isNaN(newQuantity) || newQuantity < 0) {
      setQtyError("Please enter a valid non-negative quantity.");
      setTimeout(() => setQtyError(""), 3000);
      return;
    }

    try {
      const quantity = parseInt(newQuantity, 10);

      if (quantity === selectedProduct.quantity) {
        setQtyError("Quantity is already up-to-date.");
        setTimeout(() => setQtyError(""), 3000);
        return;
      }

      await axios.put(`${updateQuan}/${selectedProduct.productItemId}`, {
        quantity,
      });

      setQtySuccess("Quantity updated successfully!");
      setTimeout(() => setQtySuccess(""), 3000);

      // Reload stock after update
      loadStock();
      handleClose();
    } catch (error) {
      console.error("Error updating quantity:", error);
      setQtyError("Failed to update quantity. Please try again.");
      setTimeout(() => setQtyError(""), 3000);
    }
  };

  return (
    <>
      <div className="main__wrap">
        <div className="sidebar">
          <Sidebar onLogout={handleLogoutClick} />
        </div>
        <div className="stock__wrap">
          <div className="stock__head">
            <div className="stock__head--main">
              <h3 className="stock__title">Out of Stock</h3>
              <div className="admin__avatar">
                <img src="../images/diddy.jpg" alt="Avatar" />
              </div>
            </div>

            <div className="stock__breadcrumb">
              <Breadcrumb>
                <Breadcrumb.Item link>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Catalog</Breadcrumb.Item>
                <Breadcrumb.Item active>Out of Stock</Breadcrumb.Item>
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
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search__input"
                  />
                </Col>
              </Row>
            </Container>
          </div>

          <div className="stock__body">
            <div className="stock__body--wrap">
              <div className="body__title">
                <h4 className="stock_title">Out of Stock</h4>
              </div>
              <div className="stock__body--table">
                <Table className="table1">
                  <thead className="thead1">
                    <tr>
                      <th className="th1">Product ID</th>
                      <th className="th1">Product Name</th>
                      <th className="th1">Product Image</th>
                      <th className="th1">Quantity</th>
                      <th className="th1">Size</th>
                      <th className="th1">Price</th>
                      <th className="th1">Action</th>
                    </tr>
                  </thead>
                  <tbody className="tbody">
                    {filteredStock.length > 0 ? (
                      displayData.map((item, index) => (
                        <tr key={item.productItemId} className="tr1">
                          <td className="td1">
                            {index + 1 + currentPage * itemsPerPage}
                          </td>
                          <td className="td1">{item.productName}</td>
                          <td className="td1">
                            <img
                              src={`../images/${item.productImage}`}
                              alt={item.productName}
                              className="stock__image"
                            />
                          </td>
                          <td className="td1">{item.quantity}</td>
                          <td className="td1">{item.size}</td>
                          <td className="td1">{item.price}</td>
                          <td className="td1">
                            <FaRegSquarePlus
                              className="order__icon order__icon--edit"
                              variant="primary"
                              onClick={() => handleShow(item)}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center"
                          style={{ border: "1px" }}
                        >
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
          <Modal.Title>Update Quantity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={newQuantity}
                onChange={handleQuantityChange}
                autoFocus
                min="0"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
        {qtyError && <Alert variant="danger">{qtyError}</Alert>}
        {qtySuccess && <Alert variant="success">{qtySuccess}</Alert>}
      </Modal>
    </>
  );
};

export default OutOfStock;
