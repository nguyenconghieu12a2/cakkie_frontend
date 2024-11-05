import React, {useState} from "react";
import "../../styles/admin-login/new-password.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsArrowLeftSquareFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import {useFlow} from './Flow';
import axios from "axios";

const api = "/api/admin/forgotPassword/changePassword"

const NewPassword = () => {
  const { advanceFlow, email } = useFlow();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Handle password change logic here

    // Password validation
    const passwordValidation = (password) => {
      const minLength = 8;
      const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/; // Checks for special characters
      const upperCaseRegex = /[A-Z]/; // Checks for at least one uppercase letter

      if (password.length < minLength) {
        return "Password must be at least 8 characters long.";
      }

      if (!specialCharRegex.test(password)) {
        return "Password must contain at least one special character.";
      }

      if (!upperCaseRegex.test(password)) {
        return "Password must contain at least one uppercase letter.";
      }

      return ""; // Valid password
    };

    // Check if password and confirmPassword are filled
    if (!password.trim() || !confirmPassword) {
      setError(
        "Missing information at these fields (Password, Confirm Password). Please fill in!"
      );
      return;
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please enter the same password.");
      return;
    }

    // Check password strength
    const validationError = passwordValidation(password);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Create JSON object to send to the API
    const requestData = {
      password: password,
      repeatPassword: confirmPassword
    };

    try {
      const response = await axios.post(`${api}/${email}`, requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        navigate("/admin-login");
      }
    } catch (error) {
        console.error("Error during password change: ", error);
        setError("An error occurred. Please try again later.");
    }

  };

  return (
    <>
      <div className="password-reset-container d-flex justify-content-center align-items-center">
        <div className="password-reset-card p-4">
          {/* <div className="back-container">
            <Link to="/admin-reset-email">
              <BsArrowLeftSquareFill className="back-btn" />
            </Link>
          </div> */}
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4 form-container">
              <label htmlFor="password">New Password</label>
              <input
                required
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group mb-4 form-container">
              <label htmlFor="password">Confirm New Password</label>
              <input
                required
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Display error message */}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="d-flex justify-content-center">
              {/* <Link to="/admin-login">
                <button type="submit" className="btn btn-success wtf">
                  Change
                </button>
              </Link> */}
              <button type="submit" className="btn btn-primary">Send</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default NewPassword;
