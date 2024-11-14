import Sidebar from "../sidebar.js";
import "../../styles/list-canceled-order.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FaBars, FaRegCircleLeft } from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

function ListCanceledOrder() {
  const { id } = useParams();

  //Fetch Detail
  const [detail, newDetail] = useState([]);

  const loadDetail = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8080/api/cancel-order/detail/${id}`
      );
      newDetail(result.data);
    } catch (error) {
      console.log("Error connect to: ", error);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

  const navigate = useNavigate();

  return (
    <>
      <div className="main__wrap">
        <Sidebar />
        <div className="list__canceled--wrap">
          <div className="list__canceled--head">
            <div className="list__canceled--head--main">
              <h3 className="list__canceled--title">List Canceled Order</h3>
              <div className="admin__avater">
                <img src="../images/diddy.jpg" alt="Avatar" />
              </div>
            </div>

            <div className="list__canceled--breadcrumb">
              <Breadcrumb>
                <Breadcrumb.Item link>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Catelog</Breadcrumb.Item>
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
                    {detail.map((item, index) => (
                      <tr>
                        <td className="td">{index + 1}</td>
                        <td className="td">{item.fullName}</td>
                        <td className="td">{item.totalProduct}</td>
                        <td className="td">{item.orderTotal}</td>
                        <td className="td">{item.cancelDate}</td>
                        <td className="td">{item.cancelReason}</td>
                        <td className="th handle__icon">
                          <Link to={(`/detail-canceled/${item.id}`)} className="link__icon" href="">
                            <FaBars
                              className="list__canceled--icon list__canceled--icon--menu"
                              onClick={() => navigate("/detail-canceled")}
                            />
                          </Link>
                        </td>
                      </tr>
                    ))}
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

export default ListCanceledOrder;
