import Sidebar from "../admin-sidebar/sidebar.jsx";
import "../../styles/admin-cancel-order/list-canceled-order.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FaBars, FaRegCircleLeft } from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import AvatarHeader from "../admin-header/admin-header.jsx";
//API
//GET DETAIL
const api = "/api/admin/cancel-order/detail";

const ListCanceledOrder = () => {
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

  //Fetch Detail
  const [detail, newDetail] = useState([]);

  const loadDetail = async () => {
    try {
      const result = await axios.get(`${api}/${id}`);
      newDetail(result.data);
    } catch (error) {
      console.log("Error connect to: ", error);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

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
        <div className="list__canceled--wrap">
          <div className="list__canceled--head">
            <div className="list__canceled--head--main">
              <h3 className="list__canceled--title">List Canceled Order</h3>
              <AvatarHeader />
            </div>

            <div className="list__canceled--breadcrumb">
              <p>
                <Link to="/dashboard">Home</Link> / Sales / Cancel Order / List
              </p>
            </div>
            <hr />
          </div>

          <div className="link__back">
            <Link to={`/canceled-order`}>
              <FaRegCircleLeft className="back__icon" />
            </Link>
          </div>

          <div className="list__canceled--body--wrap">
            <div className="list__canceled--body">
              <div className="list__canceled--body--head">
                <h4 className="list__canceled--body--title">
                  List Canceled Order
                </h4>
              </div>

              <div className="list__canceled--body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">Order ID</th>
                      <th className="th">Customer Name</th>
                      <th className="th">Total Product</th>
                      <th className="th">Total Price</th>
                      <th className="th">Canceled Date</th>
                      <th className="th">Canceled Reason</th>
                      <th className="th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.length > 0 ? (
                      detail.map((item, index) => (
                        <tr>
                          <td className="td">{index + 1}</td>
                          <td className="td">{item.fullName}</td>
                          <td className="td">{item.totalProduct}</td>
                          <td className="td">
                            {formatCurrency(item.orderTotal)}
                          </td>
                          <td className="td">
                            {formatDateTime(item.cancelDate)}
                          </td>
                          <td className="td">{item.cancelReason}</td>
                          <td className="th handle__icon">
                            <Link
                              to={`/detail-canceled/${item.id}`}
                              className="link__icon"
                              href=""
                            >
                              <FaBars
                                className="list__canceled--icon list__canceled--icon--menu"
                                onClick={() => navigate("/detail-canceled")}
                              />
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListCanceledOrder;
