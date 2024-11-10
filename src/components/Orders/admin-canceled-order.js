import { useEffect, useState } from "react";
import Sidebar from "../sidebar.js";
import "../../styles/canceled-order.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FaBars, FaLock } from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Form from "react-bootstrap/Form";

function CanceledOrder() {
  const [show2, setShow2] = useState(false);

  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const nevigate = useNavigate();

  //Fetch
  const [cancelOrder, setCancelOrder] = useState([]);
  const loadCancel = async () => {
    const result = await axios.get(`http://localhost:8080/api/cacel-order`);
    setCancelOrder(result.data);
  };

  useEffect(() => {
    loadCancel();
  }, []);

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
              <div className="admin__avater">
                <img src="../images/diddy.jpg" alt="Avatar" />
              </div>
            </div>

            <div className="canceled__breadcrumb">
              <Breadcrumb>
                <Breadcrumb.Item link>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Catelog</Breadcrumb.Item>
                <Breadcrumb.Item active>Sales</Breadcrumb.Item>
                <Breadcrumb.Item active>Canceled Order</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr />
          </div>

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
                          {index + 1 + currentPage * pageCount}
                        </td>
                        <td className="td">{item.fullName}</td>
                        <td className="td">{item.totalCancel}</td>
                        <td className="th handle__icon">
                          <Link to={`/canceled-order/list-canceled/${item.id}`} className="link__icon">
                            <FaBars className="canceled__icon canceled__icon--menu" />
                          </Link>

                          <a className="link__icon">
                            <FaLock
                              className="canceled__icon canceled__icon--delete"
                              onClick={handleShow2}
                            />
                            <Modal show={show2} onHide={handleClose2}>
                              <Modal.Header closeButton>
                                <Modal.Title>Lock Customer</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                Are you sure to lock this customer?
                                <Form>
                                  <Form.Group
                                    className="mb-3"
                                  >
                                    <Form.Label>Reason lock this customer</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Reason lock..."
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
                                <Button variant="danger" onClick={handleClose2}>
                                  Lock
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          </a>
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
