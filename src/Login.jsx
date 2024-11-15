import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/Login.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const api = "/api/login";

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Perform login to get JWT and user data
      const response = await axios.post(api, {
        email: formData.email,
        password: formData.password,
      });

      const { jwt, id } = response.data; // Extract jwt and id from login response

      // Store jwt and id based on rememberMe option
      if (formData.rememberMe) {
        localStorage.setItem("jwt", jwt);
        localStorage.setItem("userId", id);
      } else {
        sessionStorage.setItem("jwt", jwt);
        sessionStorage.setItem("userId", id);
      }

      setMessage("Login successful!");
      onLoginSuccess();
      navigate("/");
    } catch (error) {
      // Handle specific error responses for banned and removed accounts
      if (error.response) {
        switch (error.response.status) {
          case 404:
            setMessage("Email not found. Please check your email address.");
            break;
          case 401:
            setMessage("Incorrect password. Please try again.");
            break;
          case 403:
            // Check for specific messages regarding account status
            if (
              error.response.data.message ===
              "Your account has been banned from this shop!"
            ) {
              setMessage("Your account has been banned from this shop.");
            } else if (
              error.response.data.message ===
              "Your account has been removed from this shop!"
            ) {
              setMessage("Your account has been removed from this shop.");
            } else {
              setMessage("Your account is inactive. Please contact support.");
            }
            break;
          default:
            setMessage("Login failed. Please try again later.");
        }
      } else {
        setMessage("Network error. Please check your connection.");
      }
    }
  };

  return (
    <div className="login-container container d-flex flex-lg-row flex-column align-items-center justify-content-center">
      <div className="login-form-section col-lg-6 col-12">
        <h1 className="login-title text-center mb-4">WELCOME BACK!</h1>
        <form onSubmit={handleSubmit}>
          <div className="login-form-group position-relative mb-3">
            <label>
              <i className="fas fa-user login-icon"></i>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="login-input form-control"
              />
            </label>
          </div>
          <div className="login-form-group position-relative mb-3">
            <label>
              <i className="fas fa-lock login-icon"></i>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="login-input form-control"
              />
            </label>
          </div>
          <div className="login-options d-flex justify-content-between align-items-center mb-3">
            <label className="login-form-check-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="login-form-check-input"
              />{" "}
              Remember me
            </label>
            <a href="/forgot-password" className="login-forgot-password">
              Forgot password?
            </a>
          </div>
          {message && (
            <p className="login-message text-center text-danger">{message}</p>
          )}
          <button type="submit" className="login-btn w-100">
            LOGIN
          </button>
        </form>
        <div className="login-register-section mt-3">
          <p>
            Don’t have an account? <a href="/register">Register</a>
          </p>
        </div>
      </div>

      <div className="login-image-section col-lg-6 col-12 d-flex justify-content-center align-items-center mt-4 mt-lg-0">
        <img
          src="/images/logos.jpg"
          alt="Dessert"
          className="login-logo img-fluid"
        />
      </div>
    </div>
  );
};

export default Login;
