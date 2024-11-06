import { useEffect, useState } from "react";
import Sidebar from "../sidebar.js";
import "../../styles/product.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {
  FaRegSquarePlus,
  FaPenToSquare,
  FaTrash,
  FaBars,
} from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import AddModal from "./admin-add-product.js";
import Button from "react-bootstrap/Button";
import UpdateProduct from "./admin-update-product.js";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";

function Product() {
  const [lgShow, setLgShow] = useState(false);
  const handleClose = () => setLgShow(false);

  const [lgShow1, setLgShow1] = useState(false);
  const handleClose1 = () => setLgShow1(false);

  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);

  // Fetch and Group Product Data
  const [product, setProduct] = useState([]);
  const loadProduct = async () => {
    const result = await axios.get(`http://localhost:8080/api/product`);
    setProduct(result.data);
  };

  useEffect(() => {
    loadProduct();
  }, []);

  // Manage size selection state
  const [selectedSize, setSelectedSize] = useState({});
  const handleSizeChange = (productName, selectedSize) => {
    const selectedProduct = product.find((p) => p.productName === productName);
    const sizeDetail = selectedProduct.productItem.find(
      (s) => s.size === selectedSize
    );
    setSelectedSize({ ...selectedSize, [productName]: sizeDetail });
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(product.length / itemsPerPage);
  const displayData = product.slice(
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
        <div className="product__wrap">
          <div className="product__head">
            <div className="product__head--main">
              <h3 className="product__title">Product</h3>
              <div className="admin__avatar">
                <img src="../images/diddy.jpg" alt="Avatar" />
              </div>
            </div>

            <div className="product__breadcrumb">
              <Breadcrumb>
                <Breadcrumb.Item link>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Catalog</Breadcrumb.Item>
                <Breadcrumb.Item active>Product</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr />
          </div>

          <div className="product__body__wrap">
            <div className="product__body">
              <div className="product__body--head">
                <h4 className="product__body--title">Product</h4>
                <FaRegSquarePlus
                  className="product__icon--add"
                  onClick={() => setLgShow(true)}
                />
                <Modal size="lg" show={lgShow} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Product</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <AddModal />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="success" onClick={handleClose}>
                      Create
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>

              <div className="product__body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">Product ID</th>
                      <th className="th">Category Name</th>
                      <th className="th">Product Name</th>
                      <th className="th">Description</th>
                      <th className="th">Product Image</th>
                      <th className="th">Size</th>
                      <th className="th">Quantity in Stock</th>
                      <th className="th">Price</th>
                      {/* <th className="th">Product Item Image</th> */}
                      <th className="th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.map((item, index) => {
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
                              value={currentSize.size}
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
                          <td className="td">{currentSize.price} VNĐ</td>
                          {/* <td className="td">
                            <img
                              src={`../images/${item.productImage}`}
                              alt={item.productName}
                              className="product__image"
                            />
                          </td> */}
                          <td className="td">
                            <div className="icon-container">
                              <Link
                                to={`/product/detail/${item.productId}`}
                                className="link__icon"
                              >
                                <FaBars className="product__icon1 product__icon--menu" />
                              </Link>
                              <FaPenToSquare
                                className="product__icon1 product__icon--edit"
                                onClick={() => setLgShow1(true)}
                              />
                              <Modal
                                size="lg"
                                show={lgShow1}
                                onHide={handleClose1}
                              >
                                <Modal.Header closeButton>
                                  <Modal.Title>Update Product</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  <UpdateProduct />
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
                                    onClick={handleClose1}
                                  >
                                    Edit
                                  </Button>
                                </Modal.Footer>
                              </Modal>
                              <FaTrash
                                className="product__icon1 product__icon--delete"
                                onClick={handleShow3}
                              />
                              <Modal show={show3} onHide={handleClose3}>
                                <Modal.Header closeButton>
                                  <Modal.Title>Delete Product</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  Are you sure you want to delete this product?
                                </Modal.Body>
                                <Modal.Footer>
                                  <Button
                                    variant="secondary"
                                    onClick={handleClose3}
                                  >
                                    Close
                                  </Button>
                                  <Button
                                    variant="danger"
                                    onClick={handleClose3}
                                  >
                                    Delete
                                  </Button>
                                </Modal.Footer>
                              </Modal>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
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

export default Product;
