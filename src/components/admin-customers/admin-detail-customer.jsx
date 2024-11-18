import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/admin-customers/detail-customer.css";
import Sidebar from "../admin-sidebar/sidebar";
import { BsArrowLeftSquareFill, BsFillForwardFill } from "react-icons/bs";
import { CiViewList } from "react-icons/ci";
// import customers from "./data-customer";
import axios from "axios";
import FourOhFour from "../not-found/not-found";
import ProcessingTable from "./order-status-table/processing-table";
import CompleteTable from "./order-status-table/complete-table";
import CancelTable from "./order-status-table/cancel-table";

const apiCustomers = "/api/admin/get-customer";
const apiStatisticOrderCustomers = "/api/admin/customer-statistic-order";

const AdminDetailCustomer = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [statisticData, setStatisticData] = useState([]);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [isModalProcessingOpen, setIsModalProcessingOpen] = useState(false);
  const [isModalCompleteOpen, setIsModalCompleteOpen] = useState(false);
  const [isModalCancelOpen, setIsModalCancelOpen] = useState(false);
  const navigate = useNavigate();

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

  const fetchCustomers = async (id) => {
    try {
      const response = await axios.get(`${apiCustomers}/${id}`);
      setCustomer(response.data);
      clearTimeout(); // Clear the timer if the response is received
    } catch (error) {
      console.log("catch error: ", error);
    }
  };

  const fetchStatisticOrderCustomer = async (id) => {
    try {
      const response = await axios.get(`${apiStatisticOrderCustomers}/${id}`);
      setStatisticData(response.data);
    } catch (error) {
      console.log("catch error: ", error);
    }
  };

  useEffect(() => {
    // Start a timeout for 7 seconds
    const timeoutId = setTimeout(() => {
      setLoadingTimeout(true); // Set state to true after 10 seconds if no response
    }, 7000);

    fetchCustomers(id);
    fetchStatisticOrderCustomer(id);

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [id]);

  if (loadingTimeout && !customer) {
    return <FourOhFour />; // Display FourOhFour if loading takes too long without response
  }

  if (!customer) {
    return <p>Loading...</p>; // Display a loading message while waiting for data
  }

  return (
    <div className="customer-table-container">
      <div>
        <Sidebar onLogout={handleLogoutClick} />
      </div>
      <div className="customer-subtable-container">
        <div>
          <header className="header">
            <h2>Customers</h2>
            <p>
              <Link to="/dashboard">Home</Link> / Customers / View Detail
            </p>
          </header>
        </div>
        <hr />
        <div className="back-button">
          <BsArrowLeftSquareFill
            className="back-btn"
            onClick={() => navigate("/admin-customers")}
          />
        </div>
        <div className="card p-4">
          <div className="row mt-3">
            {/* Customer Information */}
            <div className="col-md-8">
              <form>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>ID:</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={customer.id}
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Create date:</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={customer.accountCreateDate}
                      disabled
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>First Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={customer.firstname}
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Gender:</label>
                    <br />
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={customer.gender === "Male"}
                      disabled
                    />{" "}
                    Male
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      className="ms-3"
                      checked={customer.gender === "Female"}
                      disabled
                    />{" "}
                    Female
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>Last Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={customer.lastname}
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Date of birth:</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={customer.birthday}
                      disabled
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>Username:</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={customer.username}
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Email:</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={customer.email}
                      disabled
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>Phone:</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={customer.phone}
                      disabled
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Profile Image and Address */}
            <div className="col-md-4">
              <div className="address">
                <label>Customer Address:</label>
                <table className="table table-bordered mt-2">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Detail Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.customerAddress.map((addr, index) => (
                      <tr key={index}>
                        <td className="col-id">{index + 1}</td>
                        <td>{addr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="statistic-order">
                <label>Customer Order:</label>
                <table className="table table-bordered mt-2">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Numbers of Orders</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statisticData.map((stato, i) => (
                      <tr key={i}>
                        <td className="col-id">{stato.status}</td>
                        <td>{stato.value}</td>
                        <td>
                          {/* FORWARD TO ORDER MANAGE PROCESSING PAGE */}
                          {stato.status === "Processing Order" && (
                            <div>
                              <button
                                className="view-detail-button"
                                onClick={() => setIsModalProcessingOpen(true)}
                              >
                                <CiViewList className="view-detail-order" />
                              </button>
                              {/* Link to order management of particular customer */}
                              <Link to="/admin-customers">
                                <BsFillForwardFill className="forward-oMana" />
                              </Link>
                            </div>
                          )}

                          {/* FORWARD TO ORDER MANAGE COMPLETE PAGE */}
                          {stato.status === "Completed Order" && (
                            <div>
                              <button
                                className="view-detail-button"
                                onClick={() => setIsModalCompleteOpen(true)}
                              >
                                <CiViewList className="view-detail-order" />
                              </button>
                              {/* Link to completed order of particular customer */}
                              <Link to="/admin-customers">
                                <BsFillForwardFill className="forward-oMana" />
                              </Link>
                            </div>
                          )}

                          {/* FORWARD TO ORDER MANAGE CANCEL PAGE */}
                          {stato.status === "Cancel Order" && (
                            <div>
                              <button
                                className="view-detail-button"
                                onClick={() => setIsModalCancelOpen(true)}
                              >
                                <CiViewList className="view-detail-order" />
                              </button>
                              {/* Link to cancel order of particular customer for ban action */}
                              <Link to="/admin-customers">
                                <BsFillForwardFill className="forward-oMana" />
                              </Link>
                            </div>
                          )}

                          {/* <BsFillForwardFill className="forward-oMana" /> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalProcessingOpen && (
        <ProcessingTable
          onClose={() => setIsModalProcessingOpen(false)}
          cusId={id}
        />
      )}
      {isModalCompleteOpen && (
        <CompleteTable
          onClose={() => setIsModalCompleteOpen(false)}
          cusId={id}
        />
      )}
      {isModalCancelOpen && (
        <CancelTable onClose={() => setIsModalCancelOpen(false)} cusId={id} />
      )}
    </div>
  );
};

export default AdminDetailCustomer;
