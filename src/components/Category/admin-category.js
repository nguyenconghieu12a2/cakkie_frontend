import Sidebar from "../sidebar";
import { useEffect, useState } from "react";
import "../../styles/category.css";
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

function Category() {
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

  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (id) => {
    setCategoryIdToDelete(id);
    setShowDelete(true);
  };

  const [cate, setCate] = useState([]);
  const loadCate = async () => {
    const result = await axios.get(`http://localhost:8080/api/category`);
    setCate(result.data);
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
      setError("Category name cannot start with whitespace or contain special characters!");
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
      await axios.post(`http://localhost:8080/api/category`, newCate);
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

  const handleEditInputChange = (e) => {
    setEditCate({ ...editCate, [e.target.name]: e.target.value });
  };

  const editCateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/api/category/${categoryIdToEdit}`,
        editCate
      );
      handleCloseEdit();
      loadCate();
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  // Delete category state
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);

  const deleteCategory = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/category/${categoryIdToDelete}`
      );
      handleCloseDelete();
      loadCate();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(cate.length / itemsPerPage);
  const displayData = cate.slice(
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
                    {displayData.map((item, index) => (
                      <tr key={item.id}>
                        <td className="td">
                          {index + 1 + currentPage * itemsPerPage}
                        </td>
                        <td className="td">{item.cateName}</td>
                        <td className="td">
                        <Link
                            key={item.id}
                            to={(`/main-category/sub-category/${item.id}`)} 
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
                                  <Form.Label>Main Category Name</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="cateName"
                                    value={editCate.cateName}
                                    onChange={handleEditInputChange}
                                    placeholder="Enter category name"
                                    autoFocus
                                  />
                                </Form.Group>
                              </Form>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={handleCloseEdit}>
                                Close
                              </Button>
                              <Button variant="warning" type="submit" onClick={editCateSubmit}>
                                Update
                              </Button>
                            </Modal.Footer>
                          </Modal>

                          <FaTrash
                            className="category__icon category__icon--delete"
                            onClick={() => handleShowDelete(item.id)}
                          />
                          <Modal show={showDelete} onHide={handleCloseDelete}>
                            <Modal.Header closeButton>
                              <Modal.Title>Delete Main Category</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              Are you sure you want to delete this category?
                            </Modal.Body>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={handleCloseDelete}>
                                Cancel
                              </Button>
                              <Button variant="danger" onClick={deleteCategory}>
                                Delete
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </td>
                      </tr>
                    ))}
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
