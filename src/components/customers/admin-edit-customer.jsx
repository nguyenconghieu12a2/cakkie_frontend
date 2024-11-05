import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/customers/detail-customer.css";
import Sidebar from "../sidebar/sidebar";
import { BsArrowLeftSquareFill } from "react-icons/bs";
import axios from "axios";

const apiCustomers = "/api/admin/get-customer";
const apiEditCustomers = "/api/admin/edit-customer";

const EditCustomer = ({ onLogout }) => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
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

  const fetchCustomers = async (id) => {
    try {
      const response = await axios.get(`${apiCustomers}/${id}`);
      setCustomer(response.data);
      // Initialize firstName and lastName after fetching customer
      setFirstName(response.data.firstname);
      setLastName(response.data.lastname);
    } catch (error) {
      console.log("catch error: ", error);
    }
  };

  useEffect(() => {
    fetchCustomers(id);
  }, [id]);

  const handleEdit = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please fill in First Name and Last Name fields.");
      return;
    }

    try {
      await axios.put(`${apiEditCustomers}/${customer.id}`, {
        id: customer.id,
        firstname: firstName,
        lastname: lastName,
      });
      navigate("/customers");
    } catch (error) {
      console.error("Error updating customer:", error);
      setError("Failed to update customer information.");
    }
  };

  if (!customer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="customer-table-container">
      <Sidebar onLogout={handleLogoutClick}/>
      <div className="customer-subtable-container">
        <header className="header">
          <h2>Customers</h2>
          <p>
            <Link to="/dashboard">Home</Link> / Customers / Edit Customer
          </p>
        </header>
        <hr />
        <div className="back-button">
          <BsArrowLeftSquareFill
            className="back-btn"
            onClick={() => navigate("/customers")}
          />
        </div>
        <div className="card p-4">
          <div className="row mt-3">
            <div className="col-md-8">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>ID*:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customer.id}
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Create date*:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customer.accountCreateDate}
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
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Gender*:</label>
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
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Date of birth:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customer.birthday}
                      disabled
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>Username*:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customer.username}
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Email*:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customer.email}
                      disabled
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>Phone*:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customer.phone}
                      disabled
                    />
                  </div>
                </div>
                {error && <p className="error-text">{error}</p>}
                <button
                  type="button"
                  onClick={handleEdit}
                  className="btn btn-primary"
                >
                  Save
                </button>
              </form>
            </div>
            <div className="col-md-4 text-center">
              <div className="address">
                <label>Customer Address*:</label>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;
