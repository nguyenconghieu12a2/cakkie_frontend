import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../admin-sidebar/sidebar";
import AvatarHeader from "../admin-header/admin-header";
import Pagination from "react-bootstrap/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/admin-review/review-table.css";
import axios from "axios";

const apiApprovedReviews = "/api/reviews/approved";

const AdminApprovedReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(5); // Items per page
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

  // Fetch approved reviews
  const fetchApprovedReviews = async () => {
    try {
      const response = await axios.get(apiApprovedReviews);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching approved reviews:", error);
    }
  };

  useEffect(() => {
    fetchApprovedReviews();
  }, []);

  const totalResult = reviews.length;
  const totalPages = Math.ceil(totalResult / itemPerPage);

  const pagedResult = reviews.slice(
    (currentPage - 1) * itemPerPage,
    currentPage * itemPerPage
  );

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
              <h2>Approved Reviews</h2>
              <p>
                <Link to="/dashboard">Home</Link> / Approved Reviews
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
              <th>Approved Date</th>
            </tr>
          </thead>
          <tbody>
            {pagedResult.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No approved reviews found.
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
                  <td>
                    {review.approvedDate
                      ? new Date(review.approvedDate).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }) // Format the date if it exists
                      : "Not Available"}
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
      </div>
    </div>
  );
};

export default AdminApprovedReviews;
