import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../admin-sidebar/sidebar";
import AvatarHeader from "../admin-header/admin-header";
import Pagination from "react-bootstrap/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/admin-review/review-table.css";
import axios from "axios";
import { FaCheck, FaTimes } from "react-icons/fa"; // Icons for approve and reject

const apiPendingReviews = "/api/reviews/pending";
const apiUpdateReviewStatus = "/api/reviews/update-status";

const AdminPendingReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(5); // Items per page
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [reviewIdToUpdate, setReviewIdToUpdate] = useState(null);
  const navigate = useNavigate();

  // Check admin login status
  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwtAdmin");
    if (!jwtToken) {
      navigate("/admin-login");
    }
  }, [navigate]);

  // Fetch pending reviews
  const fetchPendingReviews = async () => {
    try {
      const response = await axios.get(apiPendingReviews);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching pending reviews:", error);
    }
  };

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  // Adjust current page when reviews or total pages change
  useEffect(() => {
    const newTotalPages = Math.ceil(reviews.length / itemPerPage);

    if (currentPage > newTotalPages) {
      setCurrentPage(Math.max(newTotalPages, 1)); // Adjust to the new last page if needed
    }
  }, [reviews, currentPage, itemPerPage]);

  // Update review status
  const updateReviewStatus = async (reviewId, status) => {
    if (!reviewId) {
      console.error("Review ID is undefined or null.");
      alert("Review ID is missing. Please try again.");
      return;
    }

    try {
      const response = await axios.post(apiUpdateReviewStatus, null, {
        params: {
          reviewId, // Include the review ID
          status, // Include the status (1 = approve, 3 = reject)
        },
      });

      console.log("API Response:", response.data); // Log the backend response
      fetchPendingReviews(); // Refresh the list after update
      closeModal(); // Close the confirmation modal
    } catch (error) {
      console.error(
        "Error updating review status:",
        error.response || error.message
      );
      alert(
        "Failed to update the review status. Please check your network and try again."
      );
    }
  };

  const totalResult = reviews.length;
  const totalPages = Math.ceil(totalResult / itemPerPage);

  const pagedResult = reviews.slice(
    (currentPage - 1) * itemPerPage,
    currentPage * itemPerPage
  );

  // Pagination navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1); // Set to the first page (1)
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages); // Set to the last page
  };

  // Action handlers for approval and rejection
  const handleApproveClick = (reviewId) => {
    setReviewIdToUpdate(reviewId);
    setModalMessage("Are you sure you want to approve this review?");
    setShowModal(true);
  };

  const handleRejectClick = (reviewId) => {
    setReviewIdToUpdate(reviewId);
    setModalMessage("Are you sure you want to reject this review?");
    setShowModal(true);
  };

  const handleConfirmUpdate = () => {
    if (reviewIdToUpdate) {
      const status = modalMessage.includes("approve") ? 1 : 3; // 1 = Approved, 3 = Rejected
      updateReviewStatus(reviewIdToUpdate, status);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="review-table-container">
      <Sidebar />
      <div className="review-subtable-container">
        <div>
          <div className="upper-title">
            <div className="profile-header1">
              <h2>Pending Reviews</h2>
              <p>
                <Link to="/dashboard">Home</Link> / Pending Reviews
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pagedResult.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No pending reviews found.
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
                  <td>
                    <div className="tooltip-wrapper">
                      {review.feedback.length > 30 ? (
                        <>
                          <span>{review.feedback.slice(0, 30)}...</span>
                          <span className="tooltip-text">
                            {review.feedback}
                          </span>
                        </>
                      ) : (
                        review.feedback
                      )}
                    </div>
                  </td>
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
                  <td className="review-actions">
                    <button
                      className="approve-button"
                      onClick={() => handleApproveClick(review.id)}
                      title="Approve"
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => handleRejectClick(review.id)}
                      title="Reject"
                    >
                      <FaTimes />
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
              <div className="modal-actions">
                <button className="yes-button" onClick={handleConfirmUpdate}>
                  Yes
                </button>
                <button className="no-button" onClick={closeModal}>
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPendingReviews;
