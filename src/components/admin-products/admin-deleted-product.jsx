import Sidebar from "../admin-sidebar/sidebar.jsx";
import { useEffect, useState } from "react";
import { FaArrowsRotate } from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import "../../styles/admin-product/deleted-product.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import AvatarHeader from "../admin-header/admin-header.jsx";
//API
//Get Deleted
const api = "/api/admin/admin-product/deleted";
//Get Cate not delete
const cateNotDelete = "/api/admin/admin-product/category-not-deleted";
//Recover
const recoverPro = "/api/admin/product-recovery";

const DeletedProduct = () => {
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

  //Search Logic
  const [filteredOrders, setFilteredOrders] = useState([]); // For filtered results
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = deletedProduct.filter((item) =>
      Object.values(item)
        .map((value) => String(value))
        .join(" ")
        .toLowerCase()
        .includes(term)
    );

    setFilteredOrders(filtered);
    setCurrentPage(0);
  };

  const [productIdRecover, setProductIdRecover] = useState(null);
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = (id) => {
    setProductIdRecover(id);
    setShow1(true);
  };

  // Fetch Deleted Product Effect By Category
  const [deletedProduct, setDeletedProduct] = useState([]);

  const loadDeleted = async () => {
    const result = await axios.get(`${api}`);
    setDeletedProduct(result.data);
    setFilteredOrders(result.data);
  };

  useEffect(() => {
    loadDeleted();
  }, []);

  const [selectedSize, setSelectedSize] = useState({});
  const handleSizeChange = (productName, selectedSize) => {
    const selectedProduct = deletedProduct.find(
      (p) => p.productName === productName
    );
    if (!selectedProduct) return;

    const sizeDetail = selectedProduct.productItem.find(
      (s) => s.size === selectedSize
    );
    setSelectedSize((prevState) => ({
      ...prevState,
      [productName]: sizeDetail,
    }));
  };

  // Fetch Deleted Product Not Effected By Category
  //Search Logic
  //Search Logic
  const [filteredOrders1, setFilteredOrders1] = useState([]); // For filtered results
  const [searchTerm1, setSearchTerm1] = useState("");

  const handleSearchChange1 = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm1(term);

    const filtered = deletedProductNotEffect.filter((item) =>
      Object.values(item)
        .map((value) => String(value))
        .join(" ")
        .toLowerCase()
        .includes(term)
    );

    setFilteredOrders1(filtered);
    setCurrentPage(0);
  };

  const [deletedProductNotEffect, setDeletedProductNotEffect] = useState([]);
  const loadDeletedPro = async () => {
    const result = await axios.get(`${cateNotDelete}`);
    setDeletedProductNotEffect(result.data);
    setFilteredOrders1(result.data);
  };

  useEffect(() => {
    loadDeletedPro();
  }, []);

  const [selectedSize1, setSelectedSize1] = useState({});
  const handleSizeChange1 = (productName, selectedSize) => {
    const selectedProduct = deletedProductNotEffect.find(
      (p) => p.productName === productName
    );
    if (!selectedProduct) return;

    const sizeDetail = selectedProduct.productItem.find(
      (s) => s.size === selectedSize
    );
    setSelectedSize1((prevState) => ({
      ...prevState,
      [productName]: sizeDetail,
    }));
  };

  //Recovery Deleted Product
  const recoveryProduct = async () => {
    try {
      await axios.delete(`${recoverPro}/${productIdRecover}`);
      setShow1(false);
      loadDeleted();
      loadDeletedPro();
    } catch (error) {
      console.log("Error recovering product: ", error);
    }
  };

  // Pagination for Deleted Products Effected By Category
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

  // Pagination for Deleted Products Not Effected By Category
  const [currentPage1, setCurrentPage1] = useState(0);
  const itemsPerPage1 = 10;

  const pageCount1 = Math.ceil(filteredOrders1.length / itemsPerPage);

  const displayData1 = filteredOrders1.slice(
    currentPage1 * itemsPerPage1,
    (currentPage1 + 1) * itemsPerPage1
  );

  const handlePageClick1 = (event) => {
    setCurrentPage1(event.selected);
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

  return (
    <>
      <div className="main__wrap">
        <div className="navbar">
          <Sidebar onLogout={handleLogoutClick} />
        </div>
        <div className="deleted__wrap">
          <div className="upper-title">
            <div className="profile-header1">
              <h2 style={{ paddingTop: "0px" }}>Deleted Products</h2>
              <p>
                <Link to="/dashboard">Home</Link> / Catlog / Deleted Product
              </p>
            </div>
            <AvatarHeader />
          </div>
          <hr className="hrr" />

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

          <div className="deleted__body__wrap">
            <div className="deleted__body">
              <div className="deleted__body--head">
                <h4 className="deleted__body--title">
                  Deleted Product Effected By Category
                </h4>
              </div>

              <div className="deleted__body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">Product ID</th>
                      <th className="th">Category Name</th>
                      <th className="th">Product Name</th>
                      <th className="th">Description </th>
                      <th className="th">Product Image</th>
                      <th className="th">Size</th>
                      <th className="th">Quantity in Stock</th>
                      <th className="th">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.length > 0 ? (
                      displayData.map((item, index) => {
                        const currentSize =
                          selectedSize[item.productName] || item.productItem[0];
                        return (
                          <tr key={item.productId}>
                            <td className="td">
                              {index + 1 + currentPage * itemsPerPage}
                            </td>
                            <td className="td">{item.categoryName}</td>
                            <td className="td">{item.productName}</td>
                            <td className="td">{item.description}</td>
                            <td className="td">
                              <img
                                src={`../images/${item.productImage}`}
                                alt={item.productName}
                                className="product__image"
                              />
                            </td>
                            <td className="td">
                              <Form.Select
                                value={currentSize ? currentSize.size : ""}
                                onChange={(e) =>
                                  handleSizeChange(
                                    item.productName,
                                    e.target.value
                                  )
                                }
                              >
                                {item.productItem.map((sizeOption, i) => (
                                  <option key={i} value={sizeOption.size}>
                                    {sizeOption.size}
                                  </option>
                                ))}
                              </Form.Select>
                            </td>
                            <td className="td">{currentSize.quantity}</td>
                            <td className="td">
                              {formatCurrency(currentSize.price)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
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

            <div className="search__bar">
              <Container>
                <Row>
                  <Col></Col>
                  <Col></Col>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm1}
                      onChange={handleSearchChange1}
                      className="search__input"
                    />
                  </Col>
                </Row>
              </Container>
            </div>

            <div className="deleted__body">
              <div className="deleted__body--head">
                <h4 className="deleted__body--title">Deleted Product</h4>
              </div>

              <div className="deleted__body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">Product ID</th>
                      <th className="th">Category Name</th>
                      <th className="th">Product Name</th>
                      <th className="th">Description </th>
                      <th className="th">Product Image</th>
                      <th className="th">Size</th>
                      <th className="th">Quantity in Stock</th>
                      <th className="th">Price</th>
                      <th className="th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData1.length > 0 ? (
                      displayData1.map((item, index) => {
                        const currentSize1 =
                          selectedSize1[item.productName] ||
                          item.productItem[0];
                        return (
                          <tr key={item.productId}>
                            <td className="td">
                              {index + 1 + currentPage1 * itemsPerPage1}
                            </td>
                            <td className="td">{item.categoryName}</td>
                            <td className="td">{item.productName}</td>
                            <td className="td">{item.description}</td>
                            <td className="td">
                              <img
                                src={`../images/${item.productImage}`}
                                alt={item.productName}
                                className="product__image"
                              />
                            </td>
                            <td className="td">
                              <Form.Select
                                value={currentSize1 ? currentSize1.size : ""}
                                onChange={(e) =>
                                  handleSizeChange1(
                                    item.productName,
                                    e.target.value
                                  )
                                }
                              >
                                {item.productItem.map((sizeOption, i) => (
                                  <option key={i} value={sizeOption.size}>
                                    {sizeOption.size}
                                  </option>
                                ))}
                              </Form.Select>
                            </td>
                            <td className="td">{currentSize1.quantity}</td>
                            <td className="td">
                              {formatCurrency(currentSize1.price)}
                            </td>
                            <td className="td">
                              <Link className="link__icon" to="#">
                                <FaArrowsRotate
                                  className="deleted__icon deleted__icon--recovery"
                                  onClick={() => handleShow1(item.productId)}
                                />
                                <Modal
                                  show={show1}
                                  onHide={handleClose1}
                                  backdrop="static"
                                  keyboard={false}
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title>Recovery Product</Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                    Are you sure to recover this product?
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button
                                      variant="secondary"
                                      onClick={handleClose1}
                                    >
                                      Close
                                    </Button>
                                    <Button
                                      variant="success"
                                      onClick={recoveryProduct}
                                    >
                                      Recover
                                    </Button>
                                  </Modal.Footer>
                                </Modal>
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center">
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
                    onPageChange={handlePageClick1}
                    pageRangeDisplayed={5}
                    pageCount={pageCount1}
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
};

export default DeletedProduct;
