import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/admin-catalog/admin-oosproduct.css";
import Sidebar from "../admin-sidebar/sidebar";
import Pagination from "react-bootstrap/Pagination";
import AvatarHeader from "../admin-header/admin-header";
import SearchOOSProduct from "./search/search-oos-product";
import RestockModal from "./admin-restock-oos-product";

const OOSProduct = () => {
  // const [itemPerPage, setItemPerPage] = useState(5);
  // const [currentPage, setCurrentPage] = useState(1);

  const products = [
    {
      id: 1,
      name: "Classic Chocolate Truffle Cake",
      size: "10x40",
      image: "https://via.placeholder.com/100", // Replace with actual image URL
      quantity: 0,
      price: "163,000 VND",
    },
    // Repeat the product data to simulate more rows
    {
      id: 2,
      name: "Classic Chocolate Truffle Cake",
      size: "10x40",
      image: "https://via.placeholder.com/100",
      quantity: 0,
      price: "163,000 VND",
    },
    {
      id: 3,
      name: "Classic Chocolate Truffle Cake",
      size: "10x40",
      image: "https://via.placeholder.com/100",
      quantity: 0,
      price: "163,000 VND",
    },
    {
      id: 4,
      name: "Classic Chocolate Truffle Cake",
      size: "10x40",
      image: "https://via.placeholder.com/100",
      quantity: 0,
      price: "163,000 VND",
    },
  ];

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  const handleOpenModal = (productName) => {
    setSelectedProduct(productName);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // const goToNextPage = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };
  // const goToPreviousPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  // const goToFirstPage = () => {
  //   setCurrentPage(1);
  // };

  // const goToLastPage = () => {
  //   setCurrentPage(totalPages);
  // };

  // const handleItemPerPageChange = (e) => {
  //   setItemPerPage(Number(e.target.value));
  //   setCurrentPage(1);
  // };
  return (
    <div className="customer-table-container">
      <div>
        {/* onLogout={handleLogoutClick} */}
        <Sidebar />
      </div>
      <div className="customer-subtable-container">
        <div>
          <div className="upper-title">
            <div className="profile-header1">
              <h2>Products</h2>
              <p>
                <Link to="/dashboard">Home</Link> / Product / Out Of Stock
                Product
              </p>
            </div>
            <AvatarHeader />
          </div>
          <hr className="hrr" />
          <SearchOOSProduct
          // search={search}
          // setSearch={setSearch}
          />
        </div>
        <div className="out-of-stock-container">
          <h2 className="text-center">Out Of Stock Product</h2>
          <div className="items-per-page">
            <label>Items per page: </label>
            <select
            // value={itemPerPage} onChange={handleItemPerPageChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Size</th>
                <th>Product Image</th>
                <th>Quantity in stock</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.size}</td>
                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                  </td>
                  <td>{product.quantity}</td>
                  <td>{product.price}</td>
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleOpenModal(product.name)}
                    >
                      Restock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <RestockModal
            show={showModal}
            handleClose={handleCloseModal}
            productName={selectedProduct}
          />
          <div className="pagging">
            <Pagination className="custom-pagination">
              <Pagination.First
              // onClick={goToFirstPage}
              // disabled={currentPage <= 1}
              />
              <Pagination.Prev
              // onClick={goToPreviousPage}
              // disabled={currentPage <= 1}
              />

              <Pagination.Item>
                {/* {currentPage} / {totalPages} */}
              </Pagination.Item>

              <Pagination.Next
              // onClick={goToNextPage}
              // disabled={currentPage >= totalPages}
              />
              <Pagination.Last
              // onClick={goToLastPage}
              // disabled={currentPage >= totalPages}
              />
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OOSProduct;
