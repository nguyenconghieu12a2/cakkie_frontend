import Sidebar from "../admin-sidebar/sidebar.jsx";
import "../../styles/admin-cancel-order/detail-canceled-order.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FaRegCircleLeft } from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import AvatarHeader from "../admin-header/admin-header.jsx";
//API
//GET PRODUCT DETAIL
const orderDetailPro = "/api/admin/cancel-order/product-detail";

const DetailCanceledOrder = () => {
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

  const { id } = useParams();

  // Fetch data
  const [productCancel, setProductCancel] = useState([]);

  const loadProductCancel = async () => {
    const result = await axios.get(`${orderDetailPro}/${id}`);
    setProductCancel(result.data);
  };

  useEffect(() => {
    loadProductCancel();
  }, []);

  //Format Price
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

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(productCancel.length / itemsPerPage);
  const displayData = productCancel.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <>
      <div className="main__wrap">
        <div className="navbar">
          <Sidebar onLogout={handleLogoutClick} />
        </div>
        <div className="detail__canceled--wrap">
          <div className="detail__canceled--head">
            <div className="detail__canceled--head--main">
              <h3 className="detail__canceled--title">Detail Canceled Order</h3>
              <div className="admin__avater">
                <img src="../images/diddy.jpg" alt="Avatar" />
              </div>
            </div>

            <div className="detail__canceled--breadcrumb">
              <p>
                <Link to="/dashboard">Home</Link> / Sales / Cancel Order / Detail
              </p>
            </div>
            <hr />
          </div>

          <div className="link__back">
            <Link to={`/canceled-order`}>
              <FaRegCircleLeft className="back__icon" />
            </Link>
          </div>

          <div className="detail__canceled--body--wrap">
            <div className="detail__canceled--body">
              <div className="detail__canceled--body--head">
                <h4 className="detail__canceled--body--title">
                  Detail Canceled Order
                </h4>
              </div>

              <div className="detail__canceled--body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">Order ID</th>
                      <th className="th">Customer Name</th>
                      <th className="th">Product Name</th>
                      <th className="th">Quantity</th>
                      <th className="th">Price</th>
                      <th className="th">Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.length > 0 ? (
                      displayData.map((order) =>
                        order.product.map((product) =>
                          product.productItem.map((item, index) => (
                            <tr key={index}>
                              <td className="td">{index + 1}</td>
                              <td className="td">{order.fullName}</td>
                              <td className="td">{product.productName}</td>
                              <td className="td">{item.quantity}</td>
                              <td className="td">
                                {formatCurrency(item.price)}
                              </td>
                              <td className="td">{item.size}</td>
                            </tr>
                          ))
                        )
                      )
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
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

export default DetailCanceledOrder;
