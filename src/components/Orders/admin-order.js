// import { useEffect, useState } from "react";
// import Sidebar from "../sidebar.js";
// import "../../styles/order.css";
// import Breadcrumb from "react-bootstrap/Breadcrumb";
// import { FaBars, FaPenToSquare, FaTrash } from "react-icons/fa6";
// import Table from "react-bootstrap/Table";
// import Modal from "react-bootstrap/Modal";
// import Button from "react-bootstrap/Button";
// import { Link } from "react-router-dom";
// import ReactPaginate from "react-paginate";
// import axios from "axios";
// import Form from 'react-bootstrap/Form';

// function Order() {
//   const [show, setShow] = useState(false);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   const [lgShow1, setLgShow1] = useState(false);
//   const handleClose1 = () => setLgShow1(false);

//   const [show2, setShow2] = useState(false);
//   const handleClose2 = () => setShow2(false);
//   const handleShow2 = () => setShow2(true);

//   //Fetch data
//   const [order, setOrder] = useState([]);

//   const loadOrders = async () => {
//     const result = await axios.get(`http://localhost:8080/api/order`);
//     setOrder(result.data);
//   };

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   //Fetch status by id
//   const [statusById, setStatusById] = useState([]);
//   const loadStatus = async () => {
//     const result = await axios.get(`http://localhost:8080/api/order/${statusById}/status`);
//     setStatusById(result.data);
//   }

//   useEffect(() => {
//     loadStatus();
//   });

//   const [currentPage, setCurrentPage] = useState(0);
//   const itemsPerPage = 10;

//   const pageCount = Math.ceil(order.length / itemsPerPage);

//   const displayData = order.slice(
//     currentPage * itemsPerPage,
//     (currentPage + 1) * itemsPerPage
//   );

//   const handlePageClick = (event) => {
//     setCurrentPage(event.selected);
//   };

//   return (
//     <>
//       <div className="main__wrap">
//         <Sidebar />
//         <div className="order__wrap">
//           <div className="order__head">
//             <div className="order__head--main">
//               <h3 className="order__title">Order</h3>
//               <div className="admin__avater">
//                 <img src="../images/diddy.jpg" alt="Avatar" />
//               </div>
//             </div>

//             <div className="order__breadcrumb">
//               <Breadcrumb>
//                 <Breadcrumb.Item link>Home</Breadcrumb.Item>
//                 <Breadcrumb.Item active>Catelog</Breadcrumb.Item>
//                 <Breadcrumb.Item active>Order</Breadcrumb.Item>
//               </Breadcrumb>
//             </div>
//             <hr />
//           </div>

//           <div className="order__body__wrap">
//             <div className="order__body">
//               <div className="order__body--head">
//                 <h4 className="order__body--title">Order</h4>
//               </div>

//               <div className="order__body--table">
//                 <Table className="table">
//                   <thead className="thead">
//                     <tr>
//                       <th className="th">Order ID</th>
//                       <th className="th">Customer Name</th>
//                       <th className="th">Total Product</th>
//                       <th className="th">Total Price</th>
//                       <th className="th">Discount Price</th>
//                       <th className="th">Order Status</th>
//                       <th className="th">Note</th>
//                       <th className="th">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {displayData.map((item, index) => (
//                       <tr key={item.id}>
//                         <td className="td">
//                           {index + 1 + currentPage * pageCount}
//                         </td>
//                         <td className="td">{item.fullName}</td>
//                         <td className="td">{item.totalProduct}</td>
//                         <td className="td">{item.totalPrice} VND</td>
//                         <td className="td">{item.totalDiscount} VND</td>
//                         <td className="td">{item.status}</td>
//                         <td className="td">{item.note}</td>
//                         <td className="th handle__icon">
//                           <Link
//                             to={`/order/detail/${item.shopId}`}
//                             className="link__icon"
//                           >
//                             <FaBars className="order__icon order__icon--menu" />
//                           </Link>
//                           <Link className="link__icon">
//                             <FaPenToSquare
//                               className="order__icon order__icon--edit"
//                               onClick={() => handleShow(true)}
//                               variant="primary"
//                             />
//                             <Modal show={show} onHide={handleClose}>
//                               <Modal.Header closeButton>
//                                 <Modal.Title>Update Order</Modal.Title>
//                               </Modal.Header>
//                               <Modal.Body>
//                                 <Form>
//                                   <Form.Group
//                                     className="mb-3"
//                                     controlId="exampleForm.ControlInput1"
//                                   >
//                                     <Form.Label>Order Status</Form.Label>
//                                     <Form.Control
//                                       type="email"
//                                       placeholder="name@example.com"
//                                       autoFocus
//                                     />
//                                   </Form.Group>
//                                   <Form.Group
//                                     className="mb-3"
//                                     controlId="exampleForm.ControlTextarea1"
//                                   >
//                                     <Form.Label>Example textarea</Form.Label>
//                                     <Form.Control as="textarea" rows={3} />
//                                   </Form.Group>
//                                 </Form>
//                               </Modal.Body>
//                               <Modal.Footer>
//                                 <Button
//                                   variant="secondary"
//                                   onClick={handleClose}
//                                 >
//                                   Close
//                                 </Button>
//                                 <Button variant="warning" onClick={handleClose}>
//                                   Update
//                                 </Button>
//                               </Modal.Footer>
//                             </Modal>
//                           </Link>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>

//                 {/* Pagination Component */}
//                 <div>
//                   <ReactPaginate
//                     className="pagination"
//                     breakLabel="..."
//                     nextLabel="next >"
//                     onPageChange={handlePageClick}
//                     pageRangeDisplayed={5}
//                     pageCount={pageCount}
//                     previousLabel="< previous"
//                     pageClassName="page-item"
//                     pageLinkClassName="page-link"
//                     previousClassName="page-item"
//                     previousLinkClassName="page-link"
//                     nextClassName="page-item"
//                     nextLinkClassName="page-link"
//                     breakClassName="page-item"
//                     breakLinkClassName="page-link"
//                     containerClassName="pagination"
//                     activeClassName="active"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Order;

import { useEffect, useState } from "react";
import Sidebar from "../sidebar.js";
import "../../styles/order.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FaBars, FaPenToSquare, FaTrash } from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Form from "react-bootstrap/Form";

function Order() {
  const [show, setShow] = useState(false);
  const [editOrderId, setEditOrderId] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [lgShow1, setLgShow1] = useState(false);
  const handleClose1 = () => setLgShow1(false);

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  // Fetch data
  const [order, setOrder] = useState([]);
  const [allStatuses, setAllStatuses] = useState([]);

  const loadOrders = async () => {
    const result = await axios.get(`http://localhost:8080/api/order`);
    setOrder(result.data);
  };

  const loadAllStatuses = async () => {
    const result = await axios.get(`http://localhost:8080/api/order/statuses`);
    setAllStatuses(result.data);
  };

  useEffect(() => {
    loadOrders();
    loadAllStatuses();
  }, []);

  // Fetch status by id
  const [statusById, setStatusById] = useState(null);
  const loadStatusById = async (orderId) => {
    try {
      const result = await axios.get(
        `http://localhost:8080/api/order/${orderId}/status`
      );
      setStatusById(result.data);
      setEditOrderId(orderId); // Set the orderId for updating
    } catch (error) {
      console.error("Failed to load current order status", error);
    }
  };

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

  const handleEditClick = (orderId) => {
    loadStatusById(orderId);
    handleShow();
  };

  const handleStatusChange = (e) => {
    setStatusById(e.target.value);
  };

  const handleUpdateStatus = async () => {
    if (!editOrderId) {
      console.error("Order ID is not set");
      return;
    }
  
    if (!statusById) {
      console.error("Status ID is not selected");
      return;
    }
  
    try {
      await axios.put(
        `http://localhost:8080/api/order/${editOrderId}/update-status`,
        {
          statusId: parseInt(statusById),
        }
      );
      loadOrders();
      handleClose();
    } catch (error) {
      console.error("Failed to update order status", error);
    }
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
                        <td className="td">
                          {index + 1 + currentPage * itemsPerPage}
                        </td>
                        <td className="td">{item.fullName}</td>
                        <td className="td">{item.totalProduct}</td>
                        <td className="td">{item.totalPrice} VND</td>
                        <td className="td">{item.totalDiscount} VND</td>
                        <td className="td">{item.status}</td>
                        <td className="td">{item.note}</td>
                        <td className="th handle__icon">
                          <Link
                            to={`/order/detail/${item.shopId}`}
                            className="link__icon"
                          >
                            <FaBars className="order__icon order__icon--menu" />
                          </Link>
                          <Link className="link__icon">
                            <FaPenToSquare
                              className="order__icon order__icon--edit"
                              onClick={() => handleEditClick(item.id)}
                              variant="primary"
                            />
                            <Modal show={show} onHide={handleClose}>
                              <Modal.Header closeButton>
                                <Modal.Title>Update Order</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <Form>
                                  <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlInput1"
                                  >
                                    <Form.Label>Order Status</Form.Label>
                                    <Form.Select
                                      value={statusById || ""}
                                      onChange={handleStatusChange}
                                    >
                                      <option value="" disabled>
                                        Select a status
                                      </option>
                                      {allStatuses.map((status) => (
                                        <option
                                          key={status.id}
                                          value={status.id}
                                        >
                                          {status.status}
                                        </option>
                                      ))}
                                    </Form.Select>
                                  </Form.Group>
                                </Form>
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="secondary"
                                  onClick={handleClose}
                                >
                                  Close
                                </Button>
                                <Button
                                  variant="warning"
                                  onClick={handleUpdateStatus}
                                >
                                  Update
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          </Link>
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

