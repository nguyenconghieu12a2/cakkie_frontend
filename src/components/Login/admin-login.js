import React, { useState } from "react";
import axios from "axios";
import "../../styles/admin-login/login.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";

const api = "http://localhost:8080/api/admin-login";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.username === "" || formData.password === "") {
      setMessage("Username and password are required!");
      return; // Stop further execution
    }

    try {
      const response = await axios.post(api, {
        username: formData.username,
        password: formData.password,
      });

      const { jwt } = response.data;

      sessionStorage.setItem("jwt", jwt);

      setMessage("Login successful!");
      console.log("JWT Token: ", jwt);

      // onLoginSuccess();

      navigate("/sidebar");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage("Invalid username or password!");
      } else {
        setMessage("Login Failed!");
      }
      console.error("Error during login: ", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="title">Sign in</h1>
        <form className="formGroup" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i> {/* Font Awesome Icon */}
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                // required
              />
            </label>
          </div>
          <div className="input-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i> {/* Font Awesome Icon */}
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                // required
              />
            </label>
          </div>

          {message && <p className="message">{message}</p>}

          <div className="forgot-password">
            <a href="/admin-reset-email">Forgot password?</a>
          </div>
          <div className="btn-login-div">
            <button type="submit" className="login-btn">
              LOGIN
            </button>
          </div>
        </form>
      </div>

      <div className="login-right">
        <div className="logo-img"></div>

        <h2>Welcome Back!</h2>
        <p className="p-1">To keep contact with us. </p>
        <p className="p-2">Please login with your personal information.</p>
        <div className="user-icon">
          <a href="#">User</a>
        </div>
      </div>
    </div>
  );
};

export default Login;