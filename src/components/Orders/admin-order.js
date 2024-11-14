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
// import Form from "react-bootstrap/Form";

// function Order() {
//   const [show, setShow] = useState(false);
//   const [editOrderId, setEditOrderId] = useState(null);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   const [lgShow1, setLgShow1] = useState(false);
//   const handleClose1 = () => setLgShow1(false);

//   const [show2, setShow2] = useState(false);
//   const handleClose2 = () => setShow2(false);
//   const handleShow2 = () => setShow2(true);

//   // Fetch data
//   const [order, setOrder] = useState([]);
//   const [allStatuses, setAllStatuses] = useState([]);

//   const loadOrders = async () => {
//     const result = await axios.get(`http://localhost:8080/api/order`);
//     setOrder(result.data);
//   };

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   // Fetch status by id
//   const [statusById, setStatusById] = useState(null);
//   const loadStatusById = async (orderId) => {
//     try {
//       const result = await axios.get(
//         `http://localhost:8080/api/order/${orderId}/status`
//       );
//       setStatusById(result.data);
//       setEditOrderId(orderId);
//     } catch (error) {
//       console.error("Failed to load current order status", error);
//     }
//   };

//   const handleEditClick = (orderId) => {
//     loadStatusById(orderId);
//     setEditOrderId(orderId);
//     handleShow();
//   };

//   const handleStatusChange = (e) => {
//     setStatusById(e.target.value);
//   };

//   const handleUpdateStatus = async () => {
//     if (!editOrderId) {
//       console.error("Order ID is not set");
//       return;
//     }

//     if (!statusById) {
//       console.error("Status ID is not selected");
//       return;
//     }

//     try {
//       await axios.put(
//         `http://localhost:8080/api/order/${editOrderId}/update-status`,
//         {
//           statusId: parseInt(statusById),
//         }
//       );
//       loadOrders();
//       handleClose();
//     } catch (error) {
//       console.error("Failed to update order status", error);
//     }
//   };

//   //Pagination
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
//                           {index + 1 + currentPage * itemsPerPage}
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
//                           <FaPenToSquare
//                             className="order__icon order__icon--edit"
//                             onClick={() => handleEditClick(item.id)}
//                             variant="primary"
//                           />
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>

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

//       {/* Modal Component moved outside of the table */}
//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Update Order</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group controlId="orderStatusSelect">
//               <Form.Label>Order Status</Form.Label>
//               <Form.Select
//                 value={statusById || ""}
//                 onChange={handleStatusChange}
//               >
//                 <option value="" disabled>
//                   Select a status
//                 </option>
//                 {allStatuses.map((status) => (
//                   <option key={status.id} value={status.id}>
//                     {status.status}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//           <Button variant="warning" onClick={handleUpdateStatus}>
//             Update
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }

// export default Order;

import { useEffect, useState } from "react";
import Sidebar from "../sidebar.js";
import "../../styles/order.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FaBars, FaPenToSquare } from "react-icons/fa6";
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
  const [order, setOrder] = useState([]);
  const [allStatuses, setAllStatuses] = useState([]);
  const [statusById, setStatusById] = useState(null);

  // Close and open modal
  const handleClose = () => {
    setShow(false);
    setEditOrderId(null);
    setStatusById(null); // Reset the status ID when modal is closed
  };

  const handleShow = () => setShow(true);

  // Load all orders
  const loadOrders = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/api/order`);
      setOrder(result.data);
    } catch (error) {
      console.error("Failed to load orders", error);
    }
  };

  // Load all statuses
  const loadAllStatuses = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8080/api/order/statuses`
      );
      setAllStatuses(result.data);
    } catch (error) {
      console.error("Failed to load order statuses", error);
    }
  };

  useEffect(() => {
    loadOrders();
    loadAllStatuses();
  }, []);

  // Load the current status by order ID
  const loadStatusById = async (orderId) => {
    try {
      console.log("Loading status for order ID:", orderId); // Debug log
      const result = await axios.get(
        `http://localhost:8080/api/order/${orderId}/status`
      );
      setStatusById(result.data.orderStatusId); // Assuming orderStatusId is the status ID
      console.log("Loaded status:", result.data.orderStatusId); // Debug log
    } catch (error) {
      console.error("Failed to load current order status", error);
    }
  };

  // Called when clicking the edit icon
  const handleEditClick = async (orderId) => {
    console.log("Editing order ID:", orderId); // Debug log
    if (orderId) {
      setEditOrderId(orderId); // Set the order ID first
      await loadStatusById(orderId); // Load status by ID
      handleShow(); // Show the modal after loading the status
    } else {
      console.error("Order ID is not valid");
    }
  };

  // Handle status selection change in the dropdown
  const handleStatusChange = (e) => {
    setStatusById(e.target.value);
  };

  // Update the order status by order ID
  const handleUpdateStatus = async () => {
    console.log("Attempting to update status with:", {
      editOrderId,
      statusById,
    }); // Log for debugging
    if (!editOrderId || !statusById) {
      console.error("Order ID or Status ID is not set");
      return;
    }

    try {
      console.log(
        "Updating order ID:",
        editOrderId,
        "to status ID:",
        statusById
      ); // Debug log
      await axios.put(
        `http://localhost:8080/api/order/${editOrderId}/update-status`,
        {
          statusId: parseInt(statusById),
        }
      );
      loadOrders(); // Reload orders after updating
      handleClose(); // Close the modal after update
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  // Pagination setup
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
              <div className="admin__avatar">
                <img src="../images/diddy.jpg" alt="Avatar" />
              </div>
            </div>

            <div className="order__breadcrumb">
              <Breadcrumb>
                <Breadcrumb.Item link>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Catalog</Breadcrumb.Item>
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
                      <tr key={item.shopId}>
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
                          <FaPenToSquare
                            className="order__icon order__icon--edit"
                            onClick={() => handleEditClick(item.shopId)}
                            variant="primary"
                          />
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

      {/* Modal Component */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="orderStatusSelect">
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
                    key={status.orderStatusId}
                    value={status.orderStatusId}
                  >
                    {status.status}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="warning" onClick={handleUpdateStatus}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Order;
