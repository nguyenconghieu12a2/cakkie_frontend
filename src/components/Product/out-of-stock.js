// import Sidebar from "../sidebar";
// import Breadcrumb from "react-bootstrap/Breadcrumb";
// import "../../styles/admin-product/out-of-stock.css";
// import { Table } from "react-bootstrap";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import ReactPaginate from "react-paginate";
// import { FaRegSquarePlus } from "react-icons/fa6";
// import Button from "react-bootstrap/Button";
// import Form from "react-bootstrap/Form";
// import Modal from "react-bootstrap/Modal";

// function OutOfStock() {
//   //Fetch Out of Stock
//   const [stock, setStock] = useState([]);
//   const loadStock = async () => {
//     const result = await axios.get(
//       `http://localhost:8080/api/admin/oos-products`
//     );
//     setStock(result.data);
//   };

//   useEffect(() => {
//     loadStock();
//   }, []);

//   //Update
//   const [show, setShow] = useState(false);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   // Pagination setup
//   const [currentPage, setCurrentPage] = useState(0);
//   const itemsPerPage = 10;
//   const pageCount = Math.ceil(stock.length / itemsPerPage);

//   const displayData = stock.slice(
//     currentPage * itemsPerPage,
//     (currentPage + 1) * itemsPerPage
//   );

//   const handlePageClick = (event) => {
//     setCurrentPage(event.selected);
//   };
//   return (
//     <>
//       <div className="main__wrap">
//         <div className="sidebar">
//           <Sidebar />
//         </div>
//         <div className="stock__wrap">
//           <div className="stock__head">
//             <div className="stock__head--main">
//               <h3 className="stock__title">Out of Stock</h3>
//               <div className="admin__avatar">
//                 <img src="../images/diddy.jpg" alt="Avatar" />
//               </div>
//             </div>

//             <div className="stock__breadcrumb">
//               <Breadcrumb>
//                 <Breadcrumb.Item link>Home</Breadcrumb.Item>
//                 <Breadcrumb.Item active>Catalog</Breadcrumb.Item>
//                 <Breadcrumb.Item active>Out of Stock</Breadcrumb.Item>
//               </Breadcrumb>
//             </div>
//             <hr />
//           </div>

//           <div className="stock__body">
//             <div className="stock__body--wrap">
//               <div className="body__title">
//                 <h4 className="stock_title">Out of Stock</h4>
//               </div>
//               <div className="stock__body--table">
//                 <Table className="table1">
//                   <thead className="thead1">
//                     <tr>
//                       <th className="th1">Product ID</th>
//                       <th className="th1">Product Name</th>
//                       <th className="th1">Product Image</th>
//                       <th className="th1">Quantity</th>
//                       <th className="th1">Size</th>
//                       <th className="th1">Price</th>
//                       <th className="th1">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody className="tbody">
//                     {displayData.map((item, index) => (
//                       <tr key={item.id} className="tr1">
//                         <td className="td1">
//                           {index + 1 + currentPage * pageCount}
//                         </td>
//                         <td className="td1">{item.productName}</td>
//                         <td className="td1">
//                           <img
//                             src={`../images/${item.productImage}`}
//                             alt={item.productName}
//                             className="stock__image"
//                           />
//                         </td>
//                         <td className="td1">{item.quantity}</td>
//                         <td className="td1">{item.size}</td>
//                         <td className="td1">{item.price}</td>
//                         <td className="td1">
//                           <FaRegSquarePlus
//                             className="order__icon order__icon--edit"
//                             variant="primary"
//                             onClick={handleShow}
//                           />
//                           <Modal show={show} onHide={handleClose}>
//                             <Modal.Header closeButton>
//                               <Modal.Title>Update Quantity</Modal.Title>
//                             </Modal.Header>
//                             <Modal.Body>
//                               <Form>
//                                 <Form.Group
//                                   className="mb-3"
//                                   controlId="exampleForm.ControlInput1"
//                                 >
//                                   <Form.Label>Quantity</Form.Label>
//                                   <Form.Control
//                                     type="text"
//                                     placeholder="name@example.com"
//                                     autoFocus
//                                   />
//                                 </Form.Group>
//                               </Form>
//                             </Modal.Body>
//                             <Modal.Footer>
//                               <Button variant="secondary" onClick={handleClose}>
//                                 Close
//                               </Button>
//                               <Button variant="success" onClick={handleClose}>
//                                 Save
//                               </Button>
//                             </Modal.Footer>
//                           </Modal>
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
//     </>
//   );
// }

// export default OutOfStock;

import Sidebar from "../sidebar";
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

function OutOfStock() {
  // State to track out-of-stock products
  const [stock, setStock] = useState([]);

  // Load out-of-stock products
  const loadStock = async () => {
    const result = await axios.get(
      `http://localhost:8080/api/admin/oos-products`
    );
    setStock(result.data);
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
  const pageCount = Math.ceil(stock.length / itemsPerPage);

  const displayData = stock.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // State for modal inputs
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newQuantity, setNewQuantity] = useState(0);

  // Handle quantity change
  const handleQuantityChange = (event) => {
    const value = event.target.value;
    // Ensure the value is a valid number
    if (!isNaN(value) && value >= 0) {
      setNewQuantity(value); // Set the new quantity only if it's a valid number
    }
  };

  // Handle save to update the quantity
  const handleSave = async () => {
    if (selectedProduct && newQuantity !== "") {
      try {
        // Make sure the quantity is a valid positive number
        const quantity = parseInt(newQuantity, 10);
        if (quantity < 0) {
          alert("Quantity cannot be negative");
          return;
        }

        await axios.put(
          `http://localhost:8080/api/admin/oos-products/update/${selectedProduct.productItemId}`,
          { quantity }
        );
        // Reload stock after update
        loadStock();
        handleClose();
      } catch (error) {
        console.error("Error updating quantity:", error);
        // Handle error gracefully
        alert("Failed to update quantity. Please try again.");
      }
    } else {
      alert("Please enter a valid quantity.");
    }
  };

  return (
    <>
      <div className="main__wrap">
        <div className="sidebar">
          <Sidebar />
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
                    {displayData.map((item, index) => (
                      <tr key={item.productItemId} className="tr1">
                        <td className="td1">
                          {index + 1 + currentPage * pageCount}
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

      {/* Modal for updating quantity */}
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
      </Modal>
    </>
  );
}

export default OutOfStock;
