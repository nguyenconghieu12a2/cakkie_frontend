import React, {useState} from "react";
import "../../styles/admin-login/reset-password.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsArrowLeftSquareFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import {useFlow} from './Flow'
import axios from "axios";

const api = "/api/admin/forgotPassword/verifyOtp"
// /986417/hieuncce180986@fpt.edu.vn

const OTPEmail = () => {

    const { advanceFlow, email } = useFlow();
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        // Simulate OTP validation and advance the flow

        try{
            const response = await axios.post(`${api}/${otp}/${email}`)
        
            if(response.status === 200){
                advanceFlow("new-password");
                navigate("/admin-reset-password");
            }
        }catch(error){
            if (error.response && error.response.status === 500) {
                setErrorMessage("Wrong OTP code. Please try again.");
            } else {
                console.error("email error: ", error);
                setErrorMessage("OTP has expired! Please create another one.");
            }
        }
    };

    return (
      <>
        <div className="password-reset-container d-flex justify-content-center align-items-center">
          <div className="password-reset-card p-4">
            <h3 className="text-center mb-4">
              Please enter OTP
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-4 form-container">
                {/* <label htmlFor="email">OTP:</label> */}
                <input
                  required
                  type="text"
                  className="form-control"
                  id="email"
                  placeholder="Enter your OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
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
                <button type="submit" className="btn btn-primary">Send</button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };
  export default OTPEmail;