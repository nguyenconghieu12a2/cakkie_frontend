import Sidebar from "../sidebar";
import "../../styles/detail-canceled-order.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FaRegCircleLeft } from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";

function DetailCanceledOrder() {
  
  const navigator = useNavigate();

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
                <Breadcrumb.Item active>Catelog</Breadcrumb.Item>
                <Breadcrumb.Item active>Sales</Breadcrumb.Item>
                <Breadcrumb.Item active>Canceled Order</Breadcrumb.Item>
                <Breadcrumb.Item active>List Canceled Order</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr />
          </div>

          <div className="link__back">
            <a href="" onClick={() => navigator("/list-canceled")}>
              <FaRegCircleLeft className="back__icon" />
            </a>
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
                      <th className="th">Product ID</th>
                      <th className="th">Product Name</th>
                      <th className="th">Quantity</th>
                      <th className="th">Price</th>
                      <th className="th">Size</th>
                      <th className="th">Product Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="td">1</td>
                      <td className="td">Table cell</td>
                      <td className="td">Table cell</td>
                      <td className="td">Table cell</td>
                      <td className="td">Table cell</td>
                      <td className="td">Table cell</td>
                    </tr>
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
