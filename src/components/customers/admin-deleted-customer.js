import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import Pagination from "react-bootstrap/Pagination";
import "../../styles/customers/deleted-customer.css";
import { BsSearch } from "react-icons/bs";
import customers from "../customers/data-customer";
import AvatarHeader from "../header/admin-header";

const DeletedCustomer = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [itemPerPage, setItemPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const totalResult = customers.length;
  const totalPages = Math.ceil(totalResult / itemPerPage);
  const pagedResult = customers.slice(
    (currentPage - 1) * itemPerPage,
    currentPage * itemPerPage
  );
  const handleRecoveryClick = (customerId) => {
    setModalMessage("Are you sure you want to recover this customer account?");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleItemPerPageChange = (e) => {
    setItemPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="customer-table-container">
      <div>
        <Sidebar />
      </div>
      <div className="customer-subtable-container">
        <div>
          <div className="upper-title">
            <div className="profile-header1">
              <h2>Deleted Customers</h2>
              <p>
                <Link to="/dashboard">Home</Link> / Deleted Customers
              </p>
            </div>
            <AvatarHeader />
          </div>
          <hr className="hrr" />
          <div className="search-container">
            <input type="text" placeholder="Search..." />
            <button>
              <BsSearch />
            </button>
          </div>
          <div className="items-per-page">
            <label>Items per page: </label>
            <select value={itemPerPage} onChange={handleItemPerPageChange}>
              <option value={2}>2</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
        </div>

        <table className="customer-table1">
          <thead>
            <tr>
              <th>#</th>
              <th>FullName</th>
              <th>Date of birth</th>
              <th>Email</th>
              <th>Create Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pagedResult.map((customer, index) => (
              <tr key={index}>
                <td>{customer.id}</td>
                <td>
                  {customer.firstname}
                  {customer.lastname}
                </td>
                <td>{customer.birthday}</td>
                <td>{customer.email}</td>
                <td>{customer.createDate}</td>
                <td>
                  <button
                    className="recovery"
                    onClick={() => handleRecoveryClick(customer.id)}
                  >
                    Recovery
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>{modalMessage}</h2>
              <div className="modal-actions">
                <button className="yes-button">Yes</button>
                <button className="no-button" onClick={closeModal}>
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        <Pagination className="custom-pagination">
          <Pagination.First
            onClick={goToFirstPage}
            disabled={currentPage <= 1}
          />
          <Pagination.Prev
            onClick={goToPreviousPage}
            disabled={currentPage <= 1}
          />

          <Pagination.Item>
            {currentPage} / {totalPages}
          </Pagination.Item>

          <Pagination.Next
            onClick={goToNextPage}
            disabled={currentPage >= totalPages}
          />
          <Pagination.Last
            onClick={goToLastPage}
            disabled={currentPage >= totalPages}
          />
        </Pagination>

        {/* <div className="pagination">
          <button
            className="prev"
            disabled={currentPage <= 1}
            onClick={goToPreviousPage}
          >
            ← Previous
          </button>
          <span>
            Page {currentPage} / {totalPages}
          </span>
          <button
            className="next"
            disabled={currentPage >= totalPages}
            onClick={goToNextPage}
          >
            Next →
          </button>
        </div> */}
      </div>
    </div>
  );
};
export default DeletedCustomer;
