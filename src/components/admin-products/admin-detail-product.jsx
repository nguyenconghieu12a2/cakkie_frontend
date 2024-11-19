import { useEffect, useState } from "react";
import Sidebar from "../admin-sidebar/sidebar.jsx";
import "../../styles/admin-product/product-detail.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {
  FaRegSquarePlus,
  FaPenToSquare,
  FaTrash,
  FaRegCircleLeft,
} from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import AvatarHeader from "../admin-header/admin-header.jsx";
//API
//get productbyId
const proById = "/api/admin/product";
//Get des title
const getTitle = "/api/admin/desTitles";
//Add desInfo
const addDes = "/api/admin/product/add-desinfo";
//Update desInfo
const updateDes = "/api/admin/product/update-desinfo";
//Delete des info
const deleteDes = "/api/admin/product/delete-desinfo";
//Get Size
const getSize = "/api/admin/detail-size";
//Delete Size
const deleteSize = "/api/admin/delete-size";

const ProductDetail = () => {
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

  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const loadProduct = async () => {
    try {
      const result = await axios.get(`${proById}/${id}`);
      setProductDetail(result.data);
    } catch (error) {
      console.error("Failed to load product:", error);
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  // Modal state for deleting size
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProItemId, setSelectedProItemId] = useState(null);

  useEffect(() => {
    loadProduct();
    loadDesTitles();
    loadGetSize();
  }, [id]);

  //Fetch size
  const [getSizes, setSize] = useState([]);
  const loadGetSize = async () => {
    try {
      const result = await axios.get(`${getSize}/${id}`);
      setSize(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Create Des
  const [show2, setShow2] = useState(false);

  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const [desTitles, setDesTitles] = useState([]);
  const loadDesTitles = async () => {
    try {
      const result = await axios.get(`${getTitle}`);
      setDesTitles(result.data);
    } catch (error) {
      console.error("Error fetching description titles:", error);
    }
  };

  const [newDesInfo, setDesInfo] = useState({
    desTitleID: "",
    desInfo: "",
    isDelete: 1,
  });

  const [currentProductId, setCurrentProductId] = useState(null);

  const handleDesInfoChange = (e) => {
    const { name, value } = e.target;
    setDesInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //Add Des
  const [desError, setDesError] = useState("");
  const [desSuccess, setDesSuccess] = useState("");

  const handleAddDesInfo = async () => {
    setDesError("");
    setDesSuccess("");

    if (!newDesInfo.desInfo.trim()) {
      setDesError("Please enter description information.");
      setTimeout(() => setDesError(""), 3000);
      return;
    }

    const desRegex = /^[a-zA-Z0-9,.]+([ ]?[a-zA-Z0-9,.]+)*$/;
    if (!desRegex.test(newDesInfo.desInfo.trim())) {
      setDesError(
        "Description information can only contain letters, numbers, commas, dots, and single spaces between words."
      );
      setTimeout(() => setDesError(""), 3000);
      return;
    }

    const existingDescription = productDetail.productInfo.some(
      (info) =>
        info.desInfo.toLowerCase() === newDesInfo.desInfo.trim().toLowerCase()
    );

    if (existingDescription) {
      setDesError(
        "This description information already exists for the product."
      );
      setTimeout(() => setDesError(""), 3000);
      return;
    }

    try {
      // Submit the description information
      const response = await axios.post(
        `${addDes}/${currentProductId}`,
        newDesInfo
      );

      if (response.status === 201 || response.status === 200) {
        setDesSuccess("Description added successfully!");
        setTimeout(() => setDesSuccess(""), 3000);

        // Reset the form and reload data
        setDesInfo({ desTitleID: "", desInfo: "", isDelete: 1 });
        loadProduct();
        // handleClose2(); // Close modal after success
      } else {
        setDesError("Unexpected error occurred while adding description.");
        setTimeout(() => setDesError(""), 3000);
      }
    } catch (error) {
      console.error("Error adding description info:", error);
      setDesError("Failed to add description. Please try again.");
      setTimeout(() => setDesError(""), 3000);
    }
  };

  //Edit
  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);
  const [editDesError, setEditDesError] = useState("");
  const [editDesSuccess, setEditDesSuccess] = useState("");

  const [editDes, setEditDes] = useState({
    desTitleId: "",
    desInfo: "",
  });
  const [desIdEdit, setDesIdEdit] = useState(null);

  // Fix: Correct the input change handler to work properly with form fields
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditDes((prevEditDes) => ({
      ...prevEditDes,
      [name]: value,
    }));
  };

  //Delete Size
  const [deleteSizes, setDeleteSizes] = useState("");
  const [successSizes, setSuccessSizes] = useState("");

  // Fix: Update only desInfo
  const editDesSubmit = async (e) => {
    // Clear previous error or success messages
    setEditDesError("");
    setEditDesSuccess("");

    // Validation: Check if description info is filled
    if (!editDes.desInfo.trim()) {
      setEditDesError("Please enter description information.");
      setTimeout(() => setEditDesError(""), 3000);
      return;
    }

    // Validation: Ensure description information is formatted correctly
    const desRegex = /^[a-zA-Z0-9,.:]+([ ]?[a-zA-Z0-9,.:]+)*$/;
    if (!desRegex.test(editDes.desInfo.trim())) {
      setEditDesError(
        "Description information can only contain letters, numbers, commas, dots, and single spaces between words."
      );
      setTimeout(() => setEditDesError(""), 3000);
      return;
    }
    e.preventDefault();
    try {
      const payload = {
        desTitleId: editDes.desTitleId,
        desInfo: editDes.desInfo.trim(),
      };

      const response = await axios.put(`${updateDes}/${id}`, payload);

      if (response.status === 200) {
        setEditDesSuccess("Description updated successfully!");
        setTimeout(() => setEditDesSuccess(""), 3000);

        // handleCloseEdit(); // Close the modal after a successful update
        loadProduct(); // Reload the product details to reflect changes
      } else {
        setEditDesError(
          "Unexpected error occurred while updating the description."
        );
        setTimeout(() => setEditDesError(""), 3000);
      }
    } catch (error) {
      console.error("Error editing description information:", error);
      setEditDesError("Failed to update description. Please try again.");
      setTimeout(() => setEditDesError(""), 3000);
    }
  };

  const [show3, setShow3] = useState(false);
  const [deleteDesTitleId, setDeleteDesTitleId] = useState(null);

  const handleClose3 = () => setShow3(false);

  // Modify handleShow3 to include a console log to ensure it's triggered
  const handleShow3 = () => {
    console.log("handleShow3 is called"); // Debugging to verify if it's triggered
    setShow3(true);
  };

  // Function to delete product description
  const handleDeleteDesInfo = async () => {
    try {
      const payload = {
        desTitleId: deleteDesTitleId,
      };
      await axios.delete(`${deleteDes}/${id}`, {
        data: payload,
      });
      console.log("Description info deleted successfully");
      setDeleteDesTitleId(null);
      loadProduct();
      handleClose3();
    } catch (error) {
      console.error("Error deleting description info:", error);
    }
  };

  // If don't have anything
  if (loading) return <div>Loading...</div>; // Show loading state

  // Ensure productDetail and productInfo are available before rendering the table
  if (!productDetail || !productDetail.productInfo) {
    return <div>No product details available.</div>;
  }

  //Delete Size
  const handleDeleteSize = async () => {
    try {
      const response = await axios.put(`${deleteSize}/${selectedProItemId}`);
      if (response.status === 200) {
        setSuccessSizes("Successfully deleted this size in product!");
        setTimeout(() => setSuccessSizes(), 3000);
        setShowDeleteModal(false);
        loadGetSize();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setDeleteSizes(error.response.data);
        setTimeout(() => setDeleteSizes(), 3000);
      } else {
        setDeleteSizes("Error deleting size:", error);
        setTimeout(() => setDeleteSizes(), 3000);
        setDeleteSizes("Failed to delete product size. Please try again.");
        setTimeout(() => setDeleteSizes(), 3000);
      }
    }
  };

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
        <Sidebar onLogout={handleLogoutClick} />
        <div className="product__wrap">
          <div className="upper-title">
            <div className="profile-header1">
              <h2 style={{ paddingTop: "0px" }}>Detail Products</h2>
              <p>
                <Link to="/dashboard">Home</Link> / Catlog / Product / Detail
              </p>
            </div>
            <AvatarHeader />
          </div>
          <hr className="hrr" />

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
                  onClick={() => {
                    setCurrentProductId(id);
                    handleShow2();
                  }}
                />
                <Modal show={show2} onHide={handleClose2}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Product Description</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group className="mb-3" controlId="desTitleID">
                        <Form.Label>Description Title</Form.Label>
                        <Form.Select
                          name="desTitleID"
                          value={newDesInfo.desTitleID}
                          onChange={handleDesInfoChange}
                        >
                          <option value="">Select Description Title</option>
                          {desTitles.map((title, index) => (
                            <option key={index} value={index + 1}>
                              {title}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="desInfo">
                        <Form.Label>Description Information</Form.Label>
                        <Form.Control
                          type="text"
                          name="desInfo"
                          value={newDesInfo.desInfo}
                          onChange={handleDesInfoChange}
                        />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose2}>
                      Close
                    </Button>
                    <Button variant="success" onClick={handleAddDesInfo}>
                      Create
                    </Button>
                  </Modal.Footer>
                  {desError && <Alert variant="danger">{desError}</Alert>}
                  {desSuccess && <Alert variant="success">{desSuccess}</Alert>}
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
                    {productDetail.productInfo.map((item, index) => {
                      const matchedTitle = productDetail.productTitle.find(
                        (title) => title.desTitleID === item.desTitleID
                      );

                      return (
                        <tr key={index}>
                          <td className="td">{index + 1}</td>
                          <td className="td">
                            {matchedTitle ? matchedTitle.desTitleName : "N/A"}
                          </td>
                          <td className="td">{item.desInfo}</td>
                          <td className="td">
                            <div className="icon-container3">
                              <div className="icon-container4">
                                <FaPenToSquare
                                  className="product__icon1 product__icon--edit"
                                  onClick={() => {
                                    setDesIdEdit(item.desTitleID);
                                    setEditDes({
                                      desTitleId: item.desTitleID,
                                      desInfo: item.desInfo,
                                    });
                                    handleShowEdit();
                                  }}
                                />
                              </div>
                              <div className="icon-container5">
                                <FaTrash
                                  className="product__icon1 product__icon--delete"
                                  onClick={() => {
                                    setDeleteDesTitleId(item.desTitleID);
                                    handleShow3();
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>

            <div className="product__body">
              <div className="product__body--head">
                <h4 className="product__body--title">Product Details Size</h4>
              </div>

              <div className="product__body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">Product ID</th>
                      <th className="th">Detail Size</th>
                      <th className="th">Price</th>
                      <th className="th">Quantity in Stock</th>
                      <th className="th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSizes.map((item, index) => (
                      <tr key={index}>
                        <td className="td">{index + 1}</td>
                        <td className="td">{item.size}</td>
                        <td className="td">{formatCurrency(item.price)}</td>
                        <td className="td">{item.qtyInStock}</td>
                        <td className="td">
                          <FaTrash
                            className="product__icon1 product__icon--delete"
                            onClick={() => {
                              setSelectedProItemId(item.proItemId);
                              setShowDeleteModal(true);
                            }}
                          />
                          {/* Delete Size Modal */}
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

      {/* Update Des Modal */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Update Product Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={editDesSubmit}>
            <Form.Group className="mb-3" controlId="desTitleID">
              <Form.Label>Description Title</Form.Label>
              <Form.Select
                name="desTitleId"
                value={editDes.desTitleId}
                onChange={handleEditInputChange}
                disabled
              >
                <option value="">Select Description Title</option>
                {desTitles.map((title, index) => (
                  <option key={index} value={index + 1}>
                    {title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="desInfo">
              <Form.Label>Description Information</Form.Label>
              <Form.Control
                type="text"
                name="desInfo"
                value={editDes.desInfo}
                onChange={handleEditInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button variant="warning" onClick={editDesSubmit}>
            Update
          </Button>
        </Modal.Footer>
        {editDesError && <Alert variant="danger">{editDesError}</Alert>}
        {editDesSuccess && <Alert variant="success">{editDesSuccess}</Alert>}
      </Modal>

      {/* Delete Des Modal */}
      <Modal show={show3} onHide={handleClose3}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this product description?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose3}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteDesInfo}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Size Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Size</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this size?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteSize}>
            Delete
          </Button>
        </Modal.Footer>
        {successSizes && (
          <Alert variant="success" className="text-center">
            {successSizes}
          </Alert>
        )}
        {deleteSizes && (
          <Alert variant="danger" className="text-center">
            {deleteSizes}
          </Alert>
        )}
      </Modal>
    </>
  );
};

export default ProductDetail;
