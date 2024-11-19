import Sidebar from "../admin-sidebar/sidebar.jsx";
import "../../styles/admin-orders/orderDetail.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import { FaRegCircleLeft } from "react-icons/fa6";
import ReactPaginate from "react-paginate";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AvatarHeader from "../admin-header/admin-header.jsx";
//API
const api = "/api/admin/detail-order";

const DetailOrder = () => {
  const { id } = useParams();
  const [details, setDetails] = useState({});

  // Logout
  const navigate = useNavigate();

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

  // Fetch Detail
  const loadDetail = async (id) => {
    try {
      const result = await axios.get(`${api}/${id}`);
      const data = result.data;

      // Set `details` as an object for proper rendering
      setDetails(data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    // Call loadDetail with the id parameter
    loadDetail(id);
  }, [id]);

  // Pagination state for products
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Adjust items per page as needed

  const pageCount = Math.ceil(
    details.productName ? details.productName.length / itemsPerPage : 0
  );

  const displayProducts = details.productName
    ? details.productName.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      )
    : [];

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const formatCurrency = (value) => {
    if (!value) return "0 VND";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    })
      .format(value)
      .replace("₫", "VND");
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <>
      <div className="main__wrap">
        <Sidebar onLogout={handleLogoutClick} />
        <div className="order__detail__wrap">
          <div className="order__detail__head">
            <div className="order__detail__head--main">
              <h3 className="order__detail__title">Order Detail</h3>
              <div className="admin__avatar">
                <AvatarHeader />
              </div>
            </div>

            <div className="order__detail__breadcrumb">
              <p>
                <Link to="/dashboard">Home</Link> / Sales / Order / Detail
              </p>
            </div>
            <hr />
          </div>

          <div className="link__back">
            <Link to="/order">
              <FaRegCircleLeft className="back__icon" />
            </Link>
          </div>

          <div className="order__detail__body__wrap">
            <div className="order__detail__body">
              <div className="order__detail__body--head">
                <h4 className="order__detail__body--title">Order Detail</h4>
              </div>

              <div className="order__detail__body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">Order ID</th>
                      <th className="th">Customer Name</th>
                      <th className="th">Shipping Method</th>
                      <th className="th">Order Date</th>
                      <th className="th">Approved Date</th>
                      <th className="th">Shipping Date</th>
                      <th className="th">Arrived Date</th>
                      <th className="th">Payment Method</th>
                      <th className="th">Shipping Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="td">{details.id}</td>
                      <td className="td">{details.fullName}</td>
                      <td className="td">{details.shipMethod}</td>
                      <td className="td">
                        {details.orderDate
                          ? new Date(details.orderDate).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="td">
                        {details.approvedDate
                          ? new Date(details.approvedDate).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="td">
                        {details.shippedDate
                          ? new Date(details.shippedDate).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="td">
                        {details.arrivalDate
                          ? new Date(details.arrivalDate).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="td">{details.paymentMethod}</td>
                      <td className="td">{details.address}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>

            <div className="order__detail__body">
              <div className="order__detail__body--head">
                <h4 className="order__detail__body--title">
                  Order Detail Product
                </h4>
              </div>

              <div className="order__detail__body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">Order ID</th>
                      <th className="th">Product Name</th>
                      <th className="th">Quantity</th>
                      <th className="th">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayProducts.length > 0 ? (
                      displayProducts.map((product, index) => (
                        <tr key={index}>
                          <td className="td">{index + 1}</td>
                          <td className="td">{product}</td>
                          <td className="td">{details.qty[index]}</td>
                          <td className="td">
                            {formatCurrency(details.price[index])}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>

                <div>
                  <ReactPaginate
                    className="pagination"
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="< previous"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailOrder;
