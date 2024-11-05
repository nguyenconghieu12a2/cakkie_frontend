import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import Pagination from "react-bootstrap/Pagination";
import "../../styles/customers/deleted-customer.css";
import { BsSearch } from "react-icons/bs";
import AvatarHeader from "../header/admin-header";
import SearchDeletedCustomer from "./search/search-deleted-customer";
import axios from "axios";

const apiDeletedCustomers = "/api/admin/deleted-customer";
const apiRecover = "/api/admin/recover-customer";

const DeletedCustomer = ({ onLogout }) => {
  const [deletedCustomer, setDeletedCustomer] = useState([]);
  const [filteredDeletedCustomer, setFilteredDeletedCustomer] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [itemPerPage, setItemPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [customerIdToRecover, setCustomerIdToRecover] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwt");
    if (!jwtToken) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogoutClick = () => {
    sessionStorage.removeItem("jwt");
    onLogout();
    navigate("/admin-login");
  };

  const fetchDeletedCustomer = async () => {
    try {
      const response = await axios.get(`${apiDeletedCustomers}`);
      setDeletedCustomer(response.data);
      setFilteredDeletedCustomer(response.data);
    } catch (error) {
      console.log("fetch error: ", error);
    }
  };

  useEffect(() => {
    fetchDeletedCustomer();
  }, []);

  useEffect(() =>{
    const result = deletedCustomer.filter((cdm) =>
      cdm.username.toLowerCase().includes(search.toLowerCase()) ||
      cdm.firstname.toLowerCase().includes(search.toLowerCase()) ||
      cdm.lastname.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredDeletedCustomer(result);
    setCurrentPage(1);
  }, [search, deletedCustomer]);

  const recoverCustomer = async () => {
    try {
      await axios.put(`${apiRecover}/${customerIdToRecover}`);
      fetchDeletedCustomer();
      closeModal();
    } catch (error) {
      console.log("catch error: ", error);
    }
  };


  const totalResult = filteredDeletedCustomer.length;
  const totalPages = Math.ceil(totalResult / itemPerPage);
  
  const pagedResult = filteredDeletedCustomer.slice(
      (currentPage - 1) * itemPerPage,
      currentPage * itemPerPage
    );


  const handleRecoveryClick = (customerId) => {
    setCustomerIdToRecover(customerId);
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
        <Sidebar onLogout={handleLogoutClick}/>
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
          <SearchDeletedCustomer 
            searchDeleted={search} 
            setSearchDeleted={setSearch}
          />
          <div className="items-per-page">
            <label>Items per page: </label>
            <select value={itemPerPage} onChange={handleItemPerPageChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
        </div>

        <table className="customer-table1">
          <thead>
            <tr>
              <th>#</th>
              <th>FullName</th>
              <th>Username</th>
              <th>Date of birth</th>
              <th>Email</th>
              <th>Create Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pagedResult.map((customer, index) => (
              <tr key={index}>
                <td>{(currentPage - 1) * itemPerPage + index + 1}</td>
                <td>
                  {customer.firstname}
                  {customer.lastname}
                </td>
                <td>{customer.username}</td>
                <td>{customer.birthday}</td>
                <td>{customer.email}</td>
                <td>{customer.accountCreateDate}</td>
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
                <button className="yes-button" onClick={recoverCustomer}>
                  Yes
                </button>
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
