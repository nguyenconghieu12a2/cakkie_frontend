import Sidebar from "../sidebar";
import { useEffect, useState } from "react";
import "../../styles/category.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FaBars, FaArrowsRotate, FaTrash } from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import "../../styles/deleted-product.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Form from "react-bootstrap/Form";

function DeletedProduct() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  //Fetch Deleted Product
  const [deletedProduct, setDeletedProduct] = useState([]);

  const loadDeleted = async () => {
    const result = await axios.get(
      `http://localhost:8080/api/admin-product/deleted`
    );
    setDeletedProduct(result.data);
  };

  useEffect(() => {
    loadDeleted();
  }, [])

  const [selectedSize, setSelectedSize] = useState({});
  const handleSizeChange = (productName, selectedSize) => {
    const selectedProduct = deletedProduct.find((p) => p.productName === productName);
    const sizeDetail = selectedProduct.productItem.find(
      (s) => s.size === selectedSize
    );
    setSelectedSize({ ...selectedSize, [productName]: sizeDetail });
  };

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const pageCount = Math.ceil(deletedProduct.length / itemsPerPage);

  const displayData = deletedProduct.slice(
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
        <div className="deleted__wrap">
          <div className="deleted__head">
            <div className="deleted__head--main">
              <h3 className="deleted__title">Deleted Product</h3>
              <div className="admin__avater">
                <img src="../images/diddy.jpg" alt="Avatar" />
              </div>
            </div>

            <div className="deleted__breadcrumb">
              <Breadcrumb>
                <Breadcrumb.Item active>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Catelog</Breadcrumb.Item>
                <Breadcrumb.Item active>Deleted Product</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr />
          </div>

          <div className="deleted__body__wrap">
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
                      <th className="th">Description  </th>
                      <th className="th">Size</th>
                      <th className="th">Quantity in Stock</th>
                      <th className="th">Price</th>
                      <th className="th">Product Image</th>
                      <th className="th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {displayData.map((item, index) => {
                      const currentSize = selectedSize[item.productName] || item.productItem[0];
                      return (
                        <tr key={item.productId}>
                          <td className="td">{index + 1 + currentPage * itemsPerPage}</td>
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
                                handleSizeChange(item.productName, e.target.value)
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
                          <td className="td">{currentSize.price} VND</td>
                          <td className="td">
                          <a className="link__icon" href="#">
                            <FaArrowsRotate
                              className="deleted__icon deleted__icon--recovery"
                              onClick={handleShow1}
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
                                Are you sure to recovery this product?
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="secondary"
                                  onClick={handleClose1}
                                >
                                  Close
                                </Button>
                                <Button variant="success">Recovery</Button>
                              </Modal.Footer>
                            </Modal>
                          </a>
                          </td>
                        </tr>
                      );
                    })}
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

export default DeletedProduct;
