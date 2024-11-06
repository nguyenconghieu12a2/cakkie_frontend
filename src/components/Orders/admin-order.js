import { useEffect, useState } from "react";
import Sidebar from "../sidebar.js";
import "../../styles/order.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FaBars, FaPenToSquare, FaTrash } from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import UpdateOrder from "./admin-update-order.js";
import ReactPaginate from "react-paginate";
import axios from "axios";

function Order() {
  const [lgShow1, setLgShow1] = useState(false);
  const handleClose1 = () => setLgShow1(false);

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  //Fetch data 
  const [order, setOrder] = useState([]);

  const loadOrders = async () => {
    const result = await axios.get(`http://localhost:8080/api/order`);
    setOrder(result.data);
  };

  useEffect(() => {
    loadOrders();
  }, []);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const pageCount = Math.ceil(order.length / itemsPerPage);

  const displayData = order.slice(
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
        <div className="order__wrap">
          <div className="order__head">
            <div className="order__head--main">
              <h3 className="order__title">Order</h3>
              <div className="admin__avater">
                <img src="../images/diddy.jpg" alt="Avatar" />
              </div>
            </div>

            <div className="order__breadcrumb">
              <Breadcrumb>
                <Breadcrumb.Item link>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Catelog</Breadcrumb.Item>
                <Breadcrumb.Item active>Order</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr />
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
                      <th className="th">Note</th>
                      <th className="th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.map((item, index) => (
                      <tr key={item.id}>
                        <td className="td">{index + 1 + currentPage * pageCount}</td>
                        <td className="td">{item.fullName}</td>
                        <td className="td">{item.totalProduct}</td>
                        <td className="td">{item.totalPrice} VND</td>
                        <td className="td">{item.totalDiscount} VND</td>
                        <td className="td">{item.status}</td>
                        <td className="td">{item.note}</td>
                        <td className="th handle__icon">
                          <Link to={`/order/detail/${item.shopId}`} className="link__icon">
                            <FaBars
                              className="order__icon order__icon--menu"
                            />
                          </Link>
                          <a className="link__icon">
                            <FaPenToSquare
                              className="order__icon order__icon--edit"
                              onClick={() => setLgShow1(true)}
                              variant="primary"
                            />
                            <Modal
                              size="lg"
                              show={lgShow1}
                              onHide={handleClose1}
                              aria-labelledby="example-modal-sizes-title-lg"
                            >
                              <Modal.Header onClick={handleClose1} closeButton>
                                <Modal.Title id="example-modal-sizes-title-lg">
                                  Update order
                                </Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <UpdateOrder />
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="secondary"
                                  onClick={handleClose1}
                                >
                                  Close
                                </Button>
                                <Button
                                  variant="warning"
                                  onClick={handleClose1}
                                >
                                  Edit
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          </a>

                          <a className="link__icon">
                            <FaTrash
                              className="order__icon order__icon--delete"
                              onClick={handleShow2}
                            />
                            <Modal
                              show={show2}
                              onHide={handleClose2}
                              backdrop="static"
                              keyboard={false}
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>Delete Order</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                Are you sure to delete this order?
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="secondary"
                                  onClick={handleClose2}
                                >
                                  Close
                                </Button>
                                <Button variant="danger">Deleted</Button>
                              </Modal.Footer>
                            </Modal>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {/* Pagination Component */}
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

export default Order;
