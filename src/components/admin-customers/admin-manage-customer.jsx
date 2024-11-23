import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../admin-sidebar/sidebar";
import { BsInfoCircle, BsUnlockFill } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import Pagination from "react-bootstrap/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/admin-customers/customer-table.css";
import AvatarHeader from "../admin-header/admin-header";
import SearchCustomer from "./search/search-customer";
import axios from "axios";

const apiCustomers = "/api/admin/customer";
const apiDeleteCustomers = "/api/admin/delete-customer";
const apiBannedCustomers = "/api/admin/bann-customer";

const AdminManageCustomer = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModalBann, setShowModalBann] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [itemPerPage, setItemPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomer, setFilteredCustomer] = useState([]); // New state for filtered customers
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
  const [customerIdToBann, setCustomerIdToBann] = useState(null);
  const [reasonInput, setReasonInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwtAdmin");
    if (!jwtToken) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogoutClick = () => {
    console.log("Logging out...");
    sessionStorage.removeItem("jwtAdmin");
    // onLogout();
    navigate("/admin-login");
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${apiCustomers}`);
      setCustomers(response.data);
      setFilteredCustomer(response.data); // Initialize filtered list
    } catch (error) {
      console.log("catch error: ", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const results = customers.filter(
      (cm) =>
        cm.username.toLowerCase().includes(search.toLowerCase()) ||
        cm.firstname.toLowerCase().includes(search.toLowerCase()) ||
        cm.lastname.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCustomer(results);
    setCurrentPage(1); // Reset to the first page on new search
  }, [search, customers]);

  const deleteCustomer = async () => {
    try {
      await axios.put(`${apiDeleteCustomers}/${customerIdToDelete}`);
      fetchCustomers();
      closeModal();
    } catch (error) {
      console.log("catch error: ", error);
    }
  };

  const bannCustomer = async (reasonInput) => {
    try {
      const data = {
        reason: reasonInput, // dynamically passed reason
      };

      await axios.put(`${apiBannedCustomers}/${customerIdToBann}`, data);
      fetchCustomers();
      closeModalBann();
    } catch (error) {
      console.log("catch error: ", error);
    }
  };

  const handleConfirmBann = () => {
    if (!reasonInput.trim()) {
      alert("Reason for banning is required. Do not accept white space!");
      return;
    }
    bannCustomer(reasonInput);
  };

  const totalResult = filteredCustomer.length;
  const totalPages = Math.ceil(totalResult / itemPerPage);

  const pagedResult = filteredCustomer.slice(
    (currentPage - 1) * itemPerPage,
    currentPage * itemPerPage
  );

  const handleDeletedClick = (customerId) => {
    setCustomerIdToDelete(customerId); // Set the ID of the customer to delete
    setModalMessage("Are you sure you want to delete this customer?");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleBannClick = (customerId) => {
    setCustomerIdToBann(customerId); // Set the ID of the customer to bann
    setModalMessage("Are you sure you want to ban this customer?");
    setShowModalBann(true);
  };

  const closeModalBann = () => {
    setShowModalBann(false);
  };

  const handleViewDetailCustomer = (customerId) => {
    navigate(`/admin-customers/detail/${customerId}`);
  };

  // const handleEditCustomer = (customerId) => {
  //   navigate(`/customers/edit/${customerId}`);
  // };

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
        <Sidebar onLogout={handleLogoutClick} />
      </div>
      <div className="customer-subtable-container">
        <div>
          <div className="upper-title">
            <div className="profile-header1">
              <h2>Manage Customers</h2>
              <p>
                <Link to="/dashboard">Home</Link> / Manage Customers
              </p>
            </div>
            <AvatarHeader />
          </div>
          <hr className="hrr" />
          <SearchCustomer search={search} setSearch={setSearch} />
          <div className="items-per-page">
            <div>
              <label>Items per page: </label>
              <select value={itemPerPage} onChange={handleItemPerPageChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
            </div>
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
            {/* Check if there are no banned customers to display */}
            {filteredCustomer.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  <div className="no-data-message">
                    No deleted customers found
                  </div>
                </td>
              </tr>
            ) : (
              pagedResult.map((customer, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * itemPerPage + index + 1}</td>
                  <td>
                    {customer.firstname} {customer.lastname}
                  </td>
                  <td>{customer.username}</td>
                  <td>{customer.birthday}</td>
                  <td>{customer.email}</td>
                  <td>{customer.accountCreateDate}</td>
                  <td className="actions">
                    <BsInfoCircle
                      className="more-info"
                      onClick={() => handleViewDetailCustomer(customer.id)}
                    />{" "}
                    |{" "}
                    <BsUnlockFill
                      className="edit"
                      onClick={() => handleBannClick(customer.id)}
                    />{" "}
                    |{" "}
                    <FaTrashAlt
                      className="trash"
                      onClick={() => handleDeletedClick(customer.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {showModalBann && (
          <div className="modal">
            <div className="modal-content">
              <h3>{modalMessage}</h3>
              <div className="modal-body">
                <label htmlFor="reasonInput">Reason for banning:</label>
                <input
                  type="text"
                  id="reasonInput"
                  placeholder="Enter reason for banning"
                  className="reason-input"
                  required
                  onChange={(e) => setReasonInput(e.target.value)} // Ensure setReasonInput is defined in your component state
                />
              </div>
              <div className="modal-actions">
                <button className="yes-button" onClick={handleConfirmBann}>
                  Confirm
                </button>
                <button className="no-button" onClick={closeModalBann}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>{modalMessage}</h3>
              <div className="modal-actions">
                <button className="yes-button" onClick={deleteCustomer}>
                  Yes
                </button>
                <button className="no-button" onClick={closeModal}>
                  No
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="pagging">
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
        </div>

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

export default AdminManageCustomer;
