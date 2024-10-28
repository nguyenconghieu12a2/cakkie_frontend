import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/customers/detail-customer.css";
import Sidebar from "../sidebar/sidebar";
import { BsArrowLeftSquareFill } from "react-icons/bs";
import customers from "./data-customer";

const DetailCustomer = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const foundCustomer = customers.find((cust) => cust.id === parseInt(id));
    setCustomer(foundCustomer);
  }, [id]);

  if (!customer) {
    return <div>Loading...</div>; // if there is no customer it will return to no data page
  }

  return (
    <div className="customer-table-container">
      <div>
        <Sidebar />
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
            onClick={() => navigate("/customers")}
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
                      defaultValue={customer.createDate}
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
                      checked={customer.gender === "male"}
                      disabled
                    />{" "}
                    Male
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      className="ms-3"
                      checked={customer.gender === "female"}
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
            <div className="col-md-4 text-center">
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
                    {customer.address.map((addr, index) => (
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

export default DetailCustomer;
