import React from "react";
import "../styles/login.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="title">Sign in</h1>
        <form className="formGroup">
          <div className="input-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i> {/* Font Awesome Icon */}
              <input type="text" id="username" placeholder="Username" />
            </label>
          </div>
          <div className="input-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i> {/* Font Awesome Icon */}
              <input type="password" id="password" placeholder="Password" />
            </label>
          </div>
          <div className="forgot-password">
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit" className="login-btn">
            LOGIN
          </button>
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
