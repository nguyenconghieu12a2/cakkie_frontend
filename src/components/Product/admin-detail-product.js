import { useEffect, useState } from "react";
import Sidebar from "../sidebar.js";
import "../../styles/product-detail.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FaRegSquarePlus, FaPenToSquare, FaTrash, FaRegCircleLeft } from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import AddModal from "./admin-add-product.js";
import Button from "react-bootstrap/Button";
import UpdateProduct from "./admin-update-product.js";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  const [lgShow, setLgShow] = useState(false);
  const handleClose = () => setLgShow(false);

  const [lgShow1, setLgShow1] = useState(false);
  const handleClose1 = () => setLgShow1(false);

  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);

  // Fetch Product Data
  const [productDetail, setProductDetail] = useState(null); 

  const loadProduct = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/api/product/${id}`);
      setProductDetail(result.data);
    } catch (error) {
      console.error("Failed to load product:", error);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  if (!productDetail) {
    return <div>Loading...</div>; // Show loading state
  }

  return (
    <>
      <div className="main__wrap">
        <Sidebar />
        <div className="product__wrap">
          <div className="product__head">
            <div className="product__head--main">
              <h3 className="product__title">Product</h3>
              <div className="admin__avatar">
                <img src="../images/diddy.jpg" alt="Avatar" />
              </div>
            </div>

            <div className="product__breadcrumb">
              <Breadcrumb>
                <Breadcrumb.Item link>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Catalog</Breadcrumb.Item>
                <Breadcrumb.Item active>Product</Breadcrumb.Item>
                <Breadcrumb.Item active>Product Detail</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr />
          </div>

          <div className="link__back">
            <Link to="/product">
              <FaRegCircleLeft className="back__icon" />
            </Link>
          </div>

          <div className="product__body__wrap">
            <div className="product__body">
              <div className="product__body--head">
                <h4 className="product__body--title">Product Details</h4>
                <FaRegSquarePlus
                  className="product__icon--add"
                  onClick={() => setLgShow(true)}
                />
                <Modal size="lg" show={lgShow} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Product</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <AddModal />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="success" onClick={handleClose}>
                      Create
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
              <div className="product__body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">Product ID</th>
                      <th className="th">Product Title</th>
                      <th className="th">Product Information</th>
                      <th className="th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productDetail.productInfo.map((item, index) => (
                      <tr key={item.productId}>
                        <td className="td">{index + 1}</td>
                        <td className="td">{item.title}</td>
                        <td className="td">{item.infomation}</td>
                        <td className="td">
                          <div className="icon-container">
                            <FaPenToSquare
                              className="product__icon1 product__icon--edit"
                              onClick={() => setLgShow1(true)}
                            />
                            <Modal
                              size="lg"
                              show={lgShow1}
                              onHide={handleClose1}
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>Update Product</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <UpdateProduct />
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="secondary"
                                  onClick={handleClose1}
                                >
                                  Close
                                </Button>
                                <Button
                                  variant="success"
                                  onClick={handleClose1}
                                >
                                  Edit
                                </Button>
                              </Modal.Footer>
                            </Modal>
                            <FaTrash
                              className="product__icon1 product__icon--delete"
                              onClick={handleShow3}
                            />
                            <Modal show={show3} onHide={handleClose3}>
                              <Modal.Header closeButton>
                                <Modal.Title>Delete Product</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                Are you sure you want to delete this product?
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="secondary"
                                  onClick={handleClose3}
                                >
                                  Close
                                </Button>
                                <Button variant="danger" onClick={handleClose3}>
                                  Delete
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          </div>
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

export default ProductDetail;
