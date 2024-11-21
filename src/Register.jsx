import React, { useState } from "react";
import "./style/Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const api = "/api/register";

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    gender: "",
    birthday: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear the error for the field being edited
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstname.trim())
      newErrors.firstname = "First Name is required.";
    if (!formData.lastname.trim())
      newErrors.lastname = "Last Name is required.";
    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (!formData.gender.trim()) newErrors.gender = "Gender is required.";
    if (!formData.birthday) newErrors.birthday = "Birthday is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        formData.password
      )
    )
      newErrors.password =
        "Password must be at least 8 characters long and include a letter, a number, and a special character.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop submission if validation fails
    try {
      const { data } = await axios.post(api, formData);
      setMessage("Registration successful!");
      console.log("Success:", data);
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage("User already exists");
      } else {
        setMessage("Registration failed");
      }
      console.error("Error:", error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-section">
        <h1 className="register-heading">Welcome!</h1>
        <form onSubmit={handleSubmit}>
          {message && <p className="register-message">{message}</p>}
          <div className="register-form-group">
            <label htmlFor="firstname">First Name</label>
            <i className="register-icon fas fa-user"></i>
            <input
              id="firstname"
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="First Name"
              required
            />
            {errors.firstname && (
              <p className="register-error">{errors.firstname}</p>
            )}
          </div>
          <div className="register-form-group">
            <label htmlFor="lastname">Last Name</label>
            <i className="register-icon fas fa-user"></i>
            <input
              id="lastname"
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Last Name"
              required
            />
            {errors.lastname && (
              <p className="register-error">{errors.lastname}</p>
            )}
          </div>
          <div className="register-form-group">
            <label htmlFor="username">Username</label>
            <i className="register-icon fas fa-user"></i>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
            {errors.username && (
              <p className="register-error">{errors.username}</p>
            )}
          </div>
          <div className="register-form-group register-gender-birthday">
            <div className="register-gender-label">
              <label htmlFor="gender">Gender</label>
              <i className="register-icon fix-height2 fas fa-venus-mars"></i>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && (
                <p className="register-error">{errors.gender}</p>
              )}
            </div>
            <div className="register-birthday-label">
              <label htmlFor="birthday">Birthday</label>
              <div className="register-form-group">
                <i className="register-icon fix-height fas fa-calendar-alt"></i>{" "}
                {/* Calendar Icon */}
                <input
                  id="birthday"
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.birthday && (
                <p className="register-error">{errors.birthday}</p>
              )}
            </div>
          </div>
          <div className="register-form-group">
            <label htmlFor="email">Email</label>
            <i className="register-icon fas fa-envelope"></i>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            {errors.email && <p className="register-error">{errors.email}</p>}
          </div>
          <div className="register-form-group">
            <label htmlFor="phone">Phone</label>
            <i className="register-icon fas fa-phone"></i>
            <input
              id="phone"
              type="tel"
              name="phone"
              pattern="[0-9]{10}"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              required
            />
            {errors.phone && <p className="register-error">{errors.phone}</p>}
          </div>
          <div className="register-form-group">
            <label htmlFor="password">Password</label>
            <i className="register-icon fas fa-lock"></i>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
              required
            />
            {errors.password && (
              <p className="register-error">{errors.password}</p>
            )}
          </div>
          <button type="submit" className="register-btn">
            REGISTER
          </button>
          <div className="register-back-to-login">
            <a href="/login">Back to Login</a>
          </div>
        </form>
      </div>
      <div className="register-right-section">
        <div className="register-image-section">
          <img src="/images/logos.jpg" alt="Dessert" />
        </div>
      </div>
    </div>
  );
};

export default Register;
