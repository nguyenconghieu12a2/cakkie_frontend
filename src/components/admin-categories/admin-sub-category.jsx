import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Sidebar from "../admin-sidebar/sidebar.jsx";
import "../../styles/admin-category/subcategory.css";
import {
  FaRegSquarePlus,
  FaBars,
  FaPenToSquare,
  FaRegCircleLeft,
  FaTrash,
} from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import { Col, Container, Row } from "react-bootstrap";
import AvatarHeader from "../admin-header/admin-header.jsx";

//API
//Get SubCate
const api = "/api/admin/category/sub-category";
//Add SubCate
const addSub = "/api/admin/category/add-sub-category";
//Update Cate
const updateSub = "/api/admin/update-category";
//Get Null SubCate
const nullSub = "/api/admin/null-sub-subCate";
//Delete Sub Cate
const deleteSub = "/api/admin/delete/sub-category";
const SubCategory = () => {
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
  //Search Logic
  const [filteredOrders, setFilteredOrders] = useState([]); // For filtered results
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = subCate.filter((item) =>
      Object.values(item)
        .map((value) => String(value))
        .join(" ")
        .toLowerCase()
        .includes(term)
    );

    setFilteredOrders(filtered);
    setCurrentPage(0);
  };

  //Logic
  const { parentId } = useParams();
  const [showAdd, setShowAdd] = useState(false);
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);
  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);
  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);

  const [subCate, setSubCate] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSub = async () => {
    try {
      const result = await axios.get(`${api}/${parentId}`);
      setSubCate(result.data);
      setFilteredOrders(result.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    console.log("Navigating to subcategory with ID:", parentId);
    loadSub();
  }, [parentId]);

  //Create
  const [newSubCate, setNewSubCate] = useState({
    cateName: "",
    parentId: parentId,
    isDeleted: 1,
  });

  const handleInputChange = (e) => {
    setNewSubCate({ ...newSubCate, [e.target.name]: e.target.value });
  };

  const saveSubCate = async (e) => {
    e.preventDefault();
    const regex = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
    const cateExisted = subCate.some(
      (item) =>
        item.cateName.toLowerCase() === newSubCate.cateName.toLowerCase()
    );
    if (!regex.test(newSubCate.cateName)) {
      setError(
        "Category name cannot start with whitespace or contain special characters!"
      );
      setSuccess("");
      return;
    } else if (newSubCate.cateName.length > 30) {
      setError("Category name should be less than 30 characters!");
      setSuccess("");
      return;
    } else if (newSubCate.cateName.length < 4) {
      setError("Category name should be greater than 4 characters!");
      setSuccess("");
      setTimeout(() => {
        setError("");
      }, 5000); // Clear error after 5 seconds
      return;
    } else if (cateExisted) {
      setError("Category has been existed!");
      setSuccess("");
      setTimeout(() => {
        setError("");
      }, 5000); // Clear error after 5 seconds
      return;
    }
    try {
      console.log("Submitting new sub-category data:", newSubCate);
      const response = await axios.post(`${addSub}/${parentId}`, {
        cateName: newSubCate.cateName,
        isDeleted: newSubCate.isDeleted,
      });

      setSuccess("Subcategory created successfully!");
      loadSub();
      setNewSubCate({
        cateName: "",
        parentId: parentId,
        isDeleted: 1,
      });

      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (error) {
      console.error("Error saving subcategory:", error);
      setError("Failed to create subcategory. Please try again.");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  //Edit
  const [editSubCate, setEditSubCate] = useState({});
  const [cateIdSubEdit, setCateIdSubEdit] = useState(null);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  const handleEditInputChange = (e) => {
    setEditSubCate({ ...editSubCate, [e.target.name]: e.target.value });
    console.log("Edit input changed:", { [e.target.name]: e.target.value });
  };

  const editSubSubmit = async (e) => {
    e.preventDefault();

    const regex = /^[a-zA-Z][a-zA-Z0-9\s]*$/; // Alphanumeric and spaces, cannot start with whitespace
    const cateExisted = subCate.some(
      (item) =>
        item.cateName.toLowerCase() === editSubCate.cateName.toLowerCase() &&
        item.id !== cateIdSubEdit // Exclude the current item being edited
    );

    // Validation conditions
    if (!regex.test(editSubCate.cateName)) {
      setEditError(
        "Category name cannot start with whitespace or contain special characters!"
      );
      setEditSuccess("");
      setTimeout(() => setEditError(""), 3000); // Clear error after 3 seconds
      return;
    } else if (editSubCate.cateName.length > 30) {
      setEditError("Category name should be less than 30 characters!");
      setEditSuccess("");
      setTimeout(() => setEditError(""), 3000);
      return;
    } else if (editSubCate.cateName.length < 4) {
      setEditError("Category name should be greater than 4 characters!");
      setEditSuccess("");
      setTimeout(() => setEditError(""), 3000);
      return;
    } else if (cateExisted) {
      setEditError("Category name already exists!");
      setEditSuccess("");
      setTimeout(() => setEditError(""), 3000);
      return;
    }

    // Proceed with submission if validations pass
    try {
      console.log("Submitting edit for ID:", cateIdSubEdit);
      console.log("Data to submit:", editSubCate);

      const response = await axios.put(
        `${updateSub}/${cateIdSubEdit}`,
        editSubCate
      );

      if (response.status === 200) {
        setEditSuccess("Sub-category updated successfully!");
        setEditError("");
        setTimeout(() => setEditSuccess(""), 3000);
        // handleCloseEdit();
        loadSub();
      } else {
        setEditError("Unexpected response status: " + response.status);
        setTimeout(() => setEditError(""), 3000);
      }
    } catch (error) {
      console.error("Error editing sub-category:", error);
      setEditError("Failed to update sub-category. Please try again.");
      setTimeout(() => setEditError(""), 3000);
    }
  };
  //Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(filteredOrders.length / itemsPerPage);
  const displayData = filteredOrders.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  //Delete SubCate
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");

  const deleteSubCategory = async (id) => {
    try {
      await axios.delete(`${deleteSub}/${id}`);
      setDeleteSuccess("Sub-category deleted successfully!");
      setDeleteError("");
      loadSub();
      handleCloseDelete();
      setTimeout(() => setDeleteSuccess(""), 5000);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setDeleteError(
          "Cannot delete sub-category because it contains sub-subcategories."
        );
      } else {
        setDeleteError("Failed to delete sub-category. Please try again.");
      }
      setTimeout(() => setDeleteError(""), 5000);
    }
  };

  return (
    <>
      <div className="main__wrap">
        <Sidebar onLogout={handleLogoutClick} />
        <div className="subcategory__wrap">
          <div className="subcategory__head">
            <div className="subcategory__head--main">
              <h3 className="subcategory__title">Sub-Category</h3>
              <AvatarHeader />
            </div>

            <div className="subcategory__breadcrumb">
              <p>
                <Link to="/dashboard">Home</Link> / Catlog / Main Category /
                Sub-Category
              </p>
            </div>
            <hr />
          </div>

          <div className="search__bar">
            <Container>
              <Row>
                <Col></Col>
                <Col></Col>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search__input"
                  />
                </Col>
              </Row>
            </Container>
          </div>

          <div className="link__back">
            <Link to="/main-category">
              <FaRegCircleLeft className="back__icon" />
            </Link>
          </div>
          <div className="subcategory__body__wrap">
            <div className="subcategory__body">
              <div className="subcategory__body--head">
                <h4 className="subcategory__body--title">Sub-Category</h4>
                <FaRegSquarePlus
                  className="subcategory__icon--add"
                  onClick={handleShowAdd}
                />
                <Modal show={showAdd} onHide={handleCloseAdd}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Sub-Category</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form id="addSubCateForm" onSubmit={saveSubCate}>
                      <Form.Group className="mb-3">
                        <Form.Label>Sub-Category Name</Form.Label>
                        <Form.Control
                          type="text"
                          autoFocus
                          name="cateName"
                          value={newSubCate.cateName}
                          onChange={handleInputChange}
                          placeholder="Enter category name"
                        />
                      </Form.Group>
                      {success && <Alert variant="success">{success}</Alert>}
                      {error && <Alert variant="danger">{error}</Alert>}
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAdd}>
                      Close
                    </Button>
                    <Button
                      variant="success"
                      type="submit"
                      form="addSubCateForm"
                    >
                      Create
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>

              <div className="subcategory__body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">Sub-Category ID</th>
                      <th className="th">Sub-Category Name</th>
                      <th className="th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.length > 0 ? (
                      displayData.map((item, index) => (
                        <tr key={item.id}>
                          <td className="td">
                            {index + 1 + currentPage * itemsPerPage}
                          </td>
                          <td className="td">{item.cateName}</td>
                          <td className="th handle__icon">
                            <div className="icon__container">
                              <Link
                                to={`/main-category/sub-category/category/${item.id}`}
                                className="link__icon"
                              >
                                <FaBars className="subcategory__icon subcategory__icon--menu" />
                              </Link>
                              <FaPenToSquare
                                className="subcategory__icon subcategory__icon--edit"
                                onClick={() => {
                                  setCateIdSubEdit(item.id);
                                  setEditSubCate(item);
                                  handleShowEdit();
                                }}
                              />

                              <FaTrash
                                className="subcategory__icon subcategory__icon--delete"
                                onClick={() => {
                                  setCateIdSubEdit(item.id);
                                  handleShowDelete();
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
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

      {/* Modal Update */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Sub-Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="editSubCateForm" onSubmit={editSubSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Sub-Category Name</Form.Label>
              <Form.Control
                type="text"
                name="cateName"
                value={editSubCate.cateName || ""}
                onChange={handleEditInputChange}
                placeholder="Enter category name"
                autoFocus
              />
            </Form.Group>
            {editSuccess && <Alert variant="success">{editSuccess}</Alert>}
            {editError && <Alert variant="danger">{editError}</Alert>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button variant="warning" type="submit" form="editSubCateForm">
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Delete */}
      <Modal show={showDelete} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Sub-Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this sub-category?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteSubCategory(cateIdSubEdit)}
          >
            Delete
          </Button>
        </Modal.Footer>
        {deleteError && <Alert variant="danger">{deleteError}</Alert>}
        {deleteSuccess && <Alert variant="success">{deleteSuccess}</Alert>}
      </Modal>
    </>
  );
};

export default SubCategory;
