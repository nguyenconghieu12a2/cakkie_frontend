import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BsFillLockFill, BsInfoCircle } from "react-icons/bs";
import Sidebar from "../admin-sidebar/sidebar";
import Pagination from "react-bootstrap/Pagination";
import "../../styles/admin-customers/banned-customer.css";
import AvatarHeader from "../admin-header/admin-header";
import SearchBannedCustomer from "./search/search-banned-customer";
import axios from "axios";

const apiBannedCustomers = "/api/admin/banned-customer";
const apiRecover = "/api/admin/recover-customer";

const AdminBannedCustomer = ({ onLogout }) => {
  const [bannedCustomer, setBannedCustomer] = useState([]);
  const [filteredBannedCustomer, setFilteredBannedCustomer] = useState([]); // New state for filtered customers
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [itemPerPage, setItemPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [customerIdToRecover, setCustomerIdToRecover] = useState(null);
  // const [reasonInput, setReasonInput] = useState(""); 
  const [search, setSearch] = useState("");

  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwtAdmin");
    if (!jwtToken) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogoutClick = () => {
    sessionStorage.removeItem("jwtAdmin");
    onLogout();
    navigate("/admin-login");
  };

  const fetchBannedCustomer = async () => {
    try {
      const response = await axios.get(`${apiBannedCustomers}`);
      setBannedCustomer(response.data);
      setFilteredBannedCustomer(response.data);
    } catch (error) {
      console.log("fetch error: ", error);
    }
  };

  useEffect(() => {
    fetchBannedCustomer();
  }, []);

  useEffect(() =>{
    const result = bannedCustomer.filter((cbm) => {
      const fullName = `${cbm.firstname} ${cbm.lastname}`.toLowerCase();
      return (
          cbm.username.toLowerCase().includes(search.toLowerCase()) ||
          fullName.includes(search.toLowerCase())
      );
    });

    setFilteredBannedCustomer(result);
    setCurrentPage(1);
  }, [search, bannedCustomer]);

  const recoverCustomer = async () => {
    try {
      await axios.put(`${apiRecover}/${customerIdToRecover}`);
      fetchBannedCustomer();
      closeModal();
    } catch (error) {
      console.log("catch error: ", error);
    }
  };


  const totalResult = filteredBannedCustomer.length;
  const totalPages = Math.ceil(totalResult / itemPerPage);

  const pagedResult = filteredBannedCustomer.slice(
      (currentPage - 1) * itemPerPage,
      currentPage * itemPerPage
    );

  const handleUnlockClick = (customerId) => {
    setCustomerIdToRecover(customerId);
    setModalMessage("Are you sure you want to unlock this customer?");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleViewDetailCustomer = (customerId) => {
    navigate(`/admin-banned-customers/detail/${customerId}`);
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
              <h2>Banned Customers</h2>
              <p>
                <Link to="/dashboard">Home</Link> / Banned Customers
              </p>
            </div>
            <AvatarHeader />
          </div>
          <hr className="hrr" />
          <SearchBannedCustomer searchBanned={search} setSearchBanned={setSearch}/>
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
            {filteredBannedCustomer.length === 0 ? (
       
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                <div className="no-data-message">No banned customers found</div>
              </td>
            </tr>
        
            ) : (
            pagedResult.map((bannedCustomer, index) => (
              <tr key={index}>
                <td>{(currentPage - 1) * itemPerPage + index + 1}</td>
                <td>
                  {bannedCustomer.firstname}
                  {bannedCustomer.lastname}
                </td>
                <td>{bannedCustomer.username}</td>
                <td>{bannedCustomer.birthday}</td>
                <td>{bannedCustomer.email}</td>
                <td>{bannedCustomer.accountCreateDate}</td>
                <td className="actions">
                  <BsInfoCircle
                    className="view"
                    onClick={() => handleViewDetailCustomer(bannedCustomer.id)}
                  />{" "}
                  |
                  <BsFillLockFill
                    className="lock"
                    onClick={() => handleUnlockClick(bannedCustomer.id)}
                  />
                </td>
              </tr>
            )))}
          </tbody>
        </table>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>{modalMessage}</h3>
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
      </div>
    </div>
  );
};
export default AdminBannedCustomer;
