import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../admin-sidebar/sidebar";
import AvatarHeader from "../admin-header/admin-header";
import Pagination from "react-bootstrap/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/admin-review/review-table.css";
import axios from "axios";
import { FaBan } from "react-icons/fa"; // Icon for banning user

const apiRejectedReviews = "/api/reviews/rejected";
const apiBanUser = "/api/users/ban";

const AdminRejectedReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(5); // Items per page
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [userIdToBan, setUserIdToBan] = useState(null);
  const [bannedReason, setBannedReason] = useState("");
  const navigate = useNavigate();

  // Check admin login status
  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwtAdmin");
    if (!jwtToken) {
      navigate("/admin-login");
    }
  }, [navigate]);
  const handleLogoutClick = () => {
    console.log("Logging out...");
    sessionStorage.removeItem("jwtAdmin");
    // onLogout();
    navigate("/admin-login");
  };

  // Fetch rejected reviews
  const fetchRejectedReviews = async () => {
    try {
      const response = await axios.get(apiRejectedReviews);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching rejected reviews:", error);
    }
  };

  useEffect(() => {
    fetchRejectedReviews();
  }, []);

  // Ban user
  const banUser = async (userId, reason) => {
    try {
      const response = await axios.post(apiBanUser, null, {
        params: { userId, bannedReason: reason },
      });

      console.log("Ban User Response:", response.data);
      alert("User has been banned successfully.");
      fetchRejectedReviews(); // Refresh the reviews after banning
      closeModal();
    } catch (error) {
      console.error("Error banning user:", error.response || error.message);
      alert("Failed to ban the user. Please try again.");
    }
  };

  const totalResult = reviews.length;
  const totalPages = Math.ceil(totalResult / itemPerPage);

  const pagedResult = reviews.slice(
    (currentPage - 1) * itemPerPage,
    currentPage * itemPerPage
  );

  // Action handler for banning a user
  const handleBanClick = (userId) => {
    setUserIdToBan(userId);
    setModalMessage("Please provide a reason for banning this user:");
    setShowModal(true);
  };

  const handleConfirmBan = () => {
    if (userIdToBan && bannedReason.trim()) {
      banUser(userIdToBan, bannedReason);
    } else {
      alert("Banned reason cannot be empty.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setBannedReason(""); // Reset the banned reason input
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  return (
    <div className="review-table-container">
      <Sidebar onLogout={handleLogoutClick} />
      <div className="review-subtable-container">
        <div>
          <div className="upper-title">
            <div className="profile-header1">
              <h2>Rejected Reviews</h2>
              <p>
                <Link to="/dashboard">Home</Link> / Rejected Reviews
              </p>
            </div>
            <AvatarHeader />
          </div>
          <hr className="hrr" />
        </div>

        <table className="review-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Reviewer</th>
              <th>Product</th>
              <th>Size</th>
              <th>Rating</th>
              <th>Feedback</th>
              <th>Image</th>
              <th>Rejected Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pagedResult.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No rejected reviews found.
                </td>
              </tr>
            ) : (
              pagedResult.map((review, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * itemPerPage + index + 1}</td>
                  <td>{review.username}</td>
                  <td>{review.productName}</td>
                  <td>{review.productSize}</td>
                  <td>{review.rating}</td>
                  <td>{review.feedback}</td>
                  <td>
                    {review.reviewImage ? (
                      <img
                        src={`/images/${review.reviewImage}`}
                        alt="Review"
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    {review.rejectDate
                      ? new Date(review.rejectDate).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }) // Format the date if it exists
                      : "Not Available"}{" "}
                    {/* Fallback for null dates */}
                  </td>
                  <td className="review-actions">
                    <button
                      className="reject-button"
                      onClick={() => handleBanClick(review.userId)}
                      title="Ban User"
                    >
                      <FaBan />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="pagging">
          <Pagination className="custom-pagination">
            <Pagination.First
              onClick={goToFirstPage}
              disabled={currentPage <= 1}
            />
            <Pagination.Prev
              onClick={goToPreviousPage}
              disabled={currentPage <= 1}
            />
            <Pagination.Item>
              {currentPage} / {totalPages}
            </Pagination.Item>
            <Pagination.Next
              onClick={goToNextPage}
              disabled={currentPage >= totalPages}
            />
            <Pagination.Last
              onClick={goToLastPage}
              disabled={currentPage >= totalPages}
            />
          </Pagination>
        </div>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>{modalMessage}</h3>
              <input
                type="text"
                className="reason-input"
                value={bannedReason}
                onChange={(e) => setBannedReason(e.target.value)}
                placeholder="Enter ban reason"
              />
              <div className="modal-actions">
                <button className="yes-button" onClick={handleConfirmBan}>
                  Confirm
                </button>
                <button className="no-button" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRejectedReviews;
