import React, { useState } from "react";
import "../../styles/admin-login/reset-password.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsArrowLeftSquareFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useFlow } from "./Flow";
import axios from "axios";

const api = "/api/admin/forgotPassword/verifyEmail";

const AdminResetPasswordEmail = () => {
  const { advanceFlow, saveEmail } = useFlow();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate email validation and advance the flow
    try {
      const response = await axios.post(`${api}/${email}`);

      if (response.status === 200) {
        saveEmail(email);
        advanceFlow("otp");
        navigate("/admin-reset-otp");
      }
      // console.log(response.status);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setErrorMessage(
          "Email doesn't exist in admin system. Please try again."
        );
      } else {
        console.error("email error: ", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="password-reset-container d-flex justify-content-center align-items-center">
        <div className="password-reset-card p-4">
          <h3 className="text-center mb-4">
            Please enter your email to send a restore password request
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4 form-container">
              {/* <label htmlFor="email" style={{fontSize:"27px"}}>Email</label> */}
              <input
                required
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
            <div className="d-flex justify-content-center">
              <div className="back-container">
                <Link to="/admin-login">
                  <BsArrowLeftSquareFill className="back-btn" />
                </Link>
              </div>
              {/* <Link to="/admin-reset-password">
                <button type="submit" className="btn btn-primary">
                  Send
                </button>
              </Link> */}
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default AdminResetPasswordEmail;
