import React from "react";
import "../../styles/admin-login/new-password.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsArrowLeftSquareFill } from "react-icons/bs";
import { Link } from "react-router-dom";

const NewPassword = () => {
  return (
    <>
      <div className="password-reset-container d-flex justify-content-center align-items-center">
        <div className="password-reset-card p-4">
          <div className="back-container">
            <Link to="/admin-reset-email">
              <BsArrowLeftSquareFill className="back-btn" />
            </Link>
          </div>
          <form>
            <div className="form-group mb-4 form-container">
              <label htmlFor="password">New Password:</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your new password"
              />
            </div>
            <div className="d-flex justify-content-center">
              <Link to="/admin-login">
                <button type="submit" className="btn btn-success wtf">
                  Change
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default NewPassword;
