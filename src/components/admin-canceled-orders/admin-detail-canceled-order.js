import Sidebar from "../sidebar";
import "../../styles/admin-cancel-order/detail-canceled-order.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FaRegCircleLeft } from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

//API
//GET PRODUCT DETAIL
const orderDetailPro = "/api/admin/cancel-order/product-detail";

function DetailCanceledOrder() {
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

  return (
    <>
      <div className="main__wrap">
        <div className="navbar">
          <Sidebar />
        </div>
        <div className="detail__canceled--wrap">
          <div className="detail__canceled--head">
            <div className="detail__canceled--head--main">
              <h3 className="detail__canceled--title">List Canceled Order</h3>
              <div className="admin__avater">
                <img src="../images/diddy.jpg" alt="Avatar" />
              </div>
            </div>

            <div className="detail__canceled--breadcrumb">
              <Breadcrumb>
                <Breadcrumb.Item link>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Catalog</Breadcrumb.Item>
                <Breadcrumb.Item active>Sales</Breadcrumb.Item>
                <Breadcrumb.Item active>Canceled Order</Breadcrumb.Item>
                <Breadcrumb.Item active>List Canceled Order</Breadcrumb.Item>
              </Breadcrumb>
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
                    {productCancel.map((order) =>
                      order.product.map((product) =>
                        product.productItem.map((item, index) => (
                          <tr key={index}>
                            <td className="td">{order.id}</td>
                            <td className="td">{order.fullName}</td>
                            <td className="td">{product.productName}</td>
                            <td className="td">{item.quantity}</td>
                            <td className="td">{formatCurrency(item.price)}</td>
                            <td className="td">{item.size}</td>
                          </tr>
                        ))
                      )
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
}

export default DetailCanceledOrder;
