import Sidebar from "../sidebar";
import { useEffect, useState } from "react";
import "../../styles/admin-category/category.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {
  FaRegSquarePlus,
  FaBars,
  FaPenToSquare,
  FaTrash,
} from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import { Col, Container, Row } from "react-bootstrap";

//API
//Get Cate
const api = "/api/admin/category";
//Add Cate
const addCate = "/api/admin/add-category";
//Update Cate
const updateCate = "/api/admin/update-category";
//Delete Cate
const deleteCate = "/api/admin/delete/category";
function Category() {
  //Search
  const [filteredOrders, setFilteredOrders] = useState([]); // For filtered results
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = cate.filter((item) =>
      Object.values(item)
        .map((value) => String(value))
        .join(" ")
        .toLowerCase()
        .includes(term)
    );

    setFilteredOrders(filtered);
    setCurrentPage(0);
  };

  //Fectach
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setSuccess(""); // Clear success message when modal closes
    setError(""); // Clear error message when modal closes
  };
  const handleShow = () => setShow(true);

  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => {
    setShowEdit(false);
    setEditCate({});
  };
  const handleShowEdit = () => setShowEdit(true);

  const [cate, setCate] = useState([]);
  const loadCate = async () => {
    const result = await axios.get(`${api}`);
    setCate(result.data);
    setFilteredOrders(result.data);
  };

  useEffect(() => {
    loadCate();
  }, []);

  // Create category
  const [newCate, setNewCate] = useState({
    cateName: "",
    parentId: null,
    isDeleted: 1,
  });

  const handleInputChange = (e) => {
    setNewCate({ ...newCate, [e.target.name]: e.target.value });
  };

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const saveCate = async (e) => {
    e.preventDefault();
    const regex = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
    const cateExisted = cate.some(
      (item) => item.cateName.toLowerCase() === newCate.cateName.toLowerCase()
    );
    if (!regex.test(newCate.cateName)) {
      setError(
        "Category name cannot start with whitespace or contain special characters!"
      );
      setSuccess("");
      return;
    } else if (newCate.cateName.length > 30) {
      setError("Category name should be less than 30 characters!");
      setSuccess("");
      return;
    } else if (newCate.cateName.length < 4) {
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
      await axios.post(`${addCate}`, newCate);
      setSuccess("Category created successfully!");
      loadCate();
      setNewCate({
        cateName: "",
        parentId: null,
        isDeleted: 1,
      }); // Reset form

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(""); // Clear success message after 5 seconds
      }, 5000);
    } catch (error) {
      console.error("Error saving category:", error);
      setError("Failed to create category. Please try again."); // Set an error message
      // Clear error message after 5 seconds
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  // Edit category state
  const [editCate, setEditCate] = useState({});
  const [categoryIdToEdit, setCategoryIdToEdit] = useState(null);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  const handleEditInputChange = (e) => {
    setEditCate({ ...editCate, [e.target.name]: e.target.value });
  };

  const editCateSubmit = async (e) => {
    e.preventDefault();

    const regex = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
    const cateExisted = cate.some(
      (item) =>
        item.cateName.toLowerCase() === editCate.cateName.toLowerCase() &&
        item.id !== categoryIdToEdit
    );

    if (!regex.test(editCate.cateName)) {
      setEditError(
        "Category name cannot start with whitespace or contain special characters!"
      );
      setEditSuccess("");
      setTimeout(() => {
        setEditError("");
      }, 3000);
      return;
    } else if (editCate.cateName.length > 30) {
      setEditError("Category name should be less than 30 characters!");
      setEditSuccess("");
      setTimeout(() => {
        setEditError("");
      }, 3000);
      return;
    } else if (editCate.cateName.length < 4) {
      setEditError("Category name should be greater than 4 characters!");
      setEditSuccess("");
      setTimeout(() => {
        setEditError("");
      }, 3000);
      return;
    } else if (cateExisted) {
      setEditError("Category already exists!");
      setEditSuccess("");
      setTimeout(() => {
        setEditError("");
      }, 3000);
      return;
    }

    try {
      await axios.put(`${updateCate}/${categoryIdToEdit}`, editCate);
      setEditSuccess("Category updated successfully!");
      setEditError("");
      setTimeout(() => {
        setEditSuccess("");
      }, 3000);
      loadCate();
      // handleCloseEdit();
    } catch (error) {
      console.error("Error editing category:", error);
      setEditError("Failed to update category. Please try again.");
      setEditSuccess("");
      setTimeout(() => {
        setEditError("");
      }, 3000);
    }
  };

  // Delete category state
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null); // ID of category to delete
  const [showDelete, setShowDelete] = useState(false);

  // Function to show the delete modal for a specific category
  const handleShowDelete = (id) => {
    setCategoryIdToDelete(id);
    setShowDelete(true);
  };

  // Function to handle closing the delete modal
  const handleCloseDelete = () => {
    setCategoryIdToDelete(null);
    setShowDelete(false);
    setDeleteError(""); // Clear any existing error messages
    setDeleteSuccess(""); // Clear any success messages
  };
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${deleteCate}/${id}`);
      setDeleteSuccess("Category deleted successfully!");
      setTimeout(() => setDeleteSuccess(""), 3000);
      loadCate();
      handleCloseDelete(); // Close the modal
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setDeleteError(
          "Category can not delete because the sub-category is existed!"
        );
      } else {
        setDeleteError("Failed to delete category. Please try again.");
      }
      setTimeout(() => setDeleteError(""), 5000);
    }
  };

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

  return (
    <>
      <div className="main__wrap">
        <div className="navbar">
          <Sidebar />
        </div>
        <div className="category__wrap">
          <div className="category__head">
            <div className="category__head--main">
              <h3 className="category__title">Category</h3>
              <div className="admin__avatar">
                <img src="../images/diddy.jpg" alt="Avatar" />
              </div>
            </div>

            <div className="category__breadcrumb">
              <Breadcrumb>
                <Breadcrumb.Item active>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Catalog</Breadcrumb.Item>
                <Breadcrumb.Item active>Category</Breadcrumb.Item>
                <Breadcrumb.Item active>Main Category</Breadcrumb.Item>
              </Breadcrumb>
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

          <div className="category__body__wrap">
            <div className="category__body">
              <div className="category__body--head">
                <h4 className="category__body--title">Main Category</h4>
                <FaRegSquarePlus
                  className="category__icon--add"
                  onClick={handleShow}
                />
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Main Category</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form onSubmit={saveCate}>
                      <Form.Group className="mb-3">
                        <Form.Label>Main Category Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="cateName"
                          value={newCate.cateName}
                          onChange={handleInputChange}
                          placeholder="Enter category name"
                          autoFocus
                        />
                      </Form.Group>
                      {/* Show success message if exists */}
                      {success && <Alert variant="success">{success}</Alert>}
                      {/* Show error message if exists */}
                      {error && <Alert variant="danger">{error}</Alert>}
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="success" type="submit" onClick={saveCate}>
                      Create
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>

              <div className="category__body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">Main Category ID</th>
                      <th className="th">Main Category</th>
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
                          <td className="td">
                            <div className="icon__container">
                              <Link
                                key={item.id}
                                to={`/main-category/sub-category/${item.id}`}
                                className="link__icon"
                              >
                                <FaBars className="category__icon category__icon--menu" />
                              </Link>
                              <FaPenToSquare
                                className="category__icon category__icon--edit"
                                onClick={() => {
                                  setCategoryIdToEdit(item.id);
                                  setEditCate(item);
                                  handleShowEdit();
                                }}
                              />
                              <Modal show={showEdit} onHide={handleCloseEdit}>
                                <Modal.Header closeButton>
                                  <Modal.Title>Edit Main Category</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  <Form onSubmit={editCateSubmit}>
                                    <Form.Group className="mb-3">
                                      <Form.Label>
                                        Main Category Name
                                      </Form.Label>
                                      <Form.Control
                                        type="text"
                                        name="cateName"
                                        value={editCate.cateName}
                                        onChange={handleEditInputChange}
                                        placeholder="Enter category name"
                                        autoFocus
                                      />
                                    </Form.Group>
                                    {editSuccess && (
                                      <Alert variant="success">
                                        {editSuccess}
                                      </Alert>
                                    )}
                                    {editError && (
                                      <Alert variant="danger">
                                        {editError}
                                      </Alert>
                                    )}
                                  </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                  <Button
                                    variant="secondary"
                                    onClick={handleCloseEdit}
                                  >
                                    Close
                                  </Button>
                                  <Button
                                    variant="warning"
                                    type="submit"
                                    onClick={editCateSubmit}
                                  >
                                    Update
                                  </Button>
                                </Modal.Footer>
                              </Modal>

                              <FaTrash
                                className="category__icon category__icon--delete"
                                onClick={() => {
                                  handleShowDelete(item.id);
                                }}
                              />
                              <Modal
                                show={showDelete}
                                onHide={handleCloseDelete}
                              >
                                <Modal.Header closeButton>
                                  <Modal.Title>Delete Category</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  "Are you sure you want to delete this
                                  category? This action cannot be undone."
                                </Modal.Body>
                                <Modal.Footer>
                                  <Button
                                    variant="secondary"
                                    onClick={handleCloseDelete}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="danger"
                                    onClick={() => {
                                      if (categoryIdToDelete) {
                                        deleteCategory(categoryIdToDelete);
                                      }
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </Modal.Footer>
                                {deleteError && (
                                  <Alert variant="danger">{deleteError}</Alert>
                                )}
                                {deleteSuccess && (
                                  <Alert variant="success">
                                    {deleteSuccess}
                                  </Alert>
                                )}
                              </Modal>
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
                <div className="pagination__wrap">
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
}

export default Category;
