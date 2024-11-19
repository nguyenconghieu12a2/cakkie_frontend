
import React from "react";
import "../../styles/admin-login/reset-password.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsArrowLeftSquareFill } from "react-icons/bs";
import { Link } from "react-router-dom";

const ResetPasswordEmail = () => {
  return (
    <>
      <div className="password-reset-container d-flex justify-content-center align-items-center">
        <div className="password-reset-card p-4">
          <h3 className="text-center mb-4">
            Please enter your username and email to send a restore password
            request.
          </h3>
          <form>
            <div className="form-group mb-3 form-container">
              <label htmlFor="username">Username:</label>
              <input
                required
                type="text"
                className="form-control1"
                id="username"
                placeholder="Enter your username"
              />
            </div>
            <div className="form-group mb-4 form-container">
              <label htmlFor="email">Email:</label>
              <input
                required
                type="email"
                className="form-control1"
                id="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="d-flex justify-content-center">
              <div className="back-container">
                <Link to="/">
                  <BsArrowLeftSquareFill className="back-btn" />
                </Link>
              </div>
              <Link to="/admin-reset-password">
                <button type="submit" className="btn btn-primary">
                  Send
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default ResetPasswordEmail;
