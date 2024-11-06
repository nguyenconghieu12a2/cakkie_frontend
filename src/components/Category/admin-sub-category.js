import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../sidebar";
import "../../styles/subcategory.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {
  FaRegSquarePlus,
  FaBars,
  FaPenToSquare,
  FaTrash,
  FaRegCircleLeft,
} from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Alert from "react-bootstrap/Alert";

function SubCategory() {
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

  // Error and Success States
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch Subcategories
  const loadSub = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8080/api/sub-category/${parentId}`
      );
      setSubCate(result.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    console.log("Navigating to subcategory with ID:", parentId);
    loadSub();
  }, [parentId]);

  // Create Sub category
  const [newSubCate, setNewSubCate] = useState({
    cateName: "",
    parentId: parentId,
    isDeleted: 1,
  });

  const handleInputChange = (e) => {
    setNewSubCate({ ...newSubCate, [e.target.name]: e.target.value });
  };

  const saveSubCate = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Log the data to be sent for debugging
      console.log("Submitting new sub-category data:", newSubCate);

      const response = await axios.post(
        `http://localhost:8080/api/sub-category/${parentId}`,
        {
          cateName: "",
          parentId: parentId,
          isDeleted: 1,
        }
      );

      setSuccess("Category created successfully!");
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
      console.error(
        "Error saving category:",
        error.response ? error.response.data : error.message
      );
      setError("Failed to create category. Please try again.");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  // Pagination setup
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(subCate.length / itemsPerPage);
  const displayData = subCate.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <>
      <div className="main__wrap">
        <Sidebar />
        <div className="subcategory__wrap">
          <div className="subcategory__head">
            <div className="subcategory__head--main">
              <h3 className="subcategory__title">Sub-Category</h3>
              <div className="admin__avatar">
                <img src="../../images/diddy.jpg" alt="Avatar" />
              </div>
            </div>

            <div className="subcategory__breadcrumb">
              <Breadcrumb>
                <Breadcrumb.Item active>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Catalog</Breadcrumb.Item>
                <Breadcrumb.Item active>Category</Breadcrumb.Item>
                <Breadcrumb.Item active>Main Category</Breadcrumb.Item>
                <Breadcrumb.Item active>Sub-Category</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr />
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
                    <Form onSubmit={saveSubCate}>
                      <Form.Group className="mb-3">
                        <Form.Label>Sub-Category Name</Form.Label>
                        <Form.Control
                          type="text"
                          autoFocus
                          name="cateName" // Updated to match state
                          value={newSubCate.cateName}
                          onChange={handleInputChange}
                          placeholder="Enter category name"
                        />
                      </Form.Group>
                      {/* Show success message if exists */}
                      {success && <Alert variant="success">{success}</Alert>}
                      {/* Show error message if exists */}
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
                      onClick={saveSubCate}
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
                    {displayData.map((item, index) => (
                      <tr key={item.id}>
                        <td className="td">
                          {index + 1 + currentPage * itemsPerPage}
                        </td>
                        <td className="td">{item.cateName}</td>
                        <td className="th handle__icon">
                          <Link
                            to={`/main-category/sub-category/category/${item.id}`}
                            className="link__icon"
                          >
                            <FaBars className="subcategory__icon subcategory__icon--menu" />
                          </Link>
                          <FaPenToSquare
                            className="subcategory__icon subcategory__icon--edit"
                            onClick={handleShowEdit}
                          />
                          <Modal show={showEdit} onHide={handleCloseEdit}>
                            <Modal.Header closeButton>
                              <Modal.Title>Edit Sub-Category</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <Form>
                                <Form.Group className="mb-3">
                                  <Form.Label>Sub-Category Name</Form.Label>
                                  <Form.Control
                                    type="text"
                                    autoFocus
                                    defaultValue={item.subCateName} // Use defaultValue to show current name
                                  />
                                </Form.Group>
                              </Form>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                variant="secondary"
                                onClick={handleCloseEdit}
                              >
                                Close
                              </Button>
                              <Button variant="warning">Edit</Button>
                            </Modal.Footer>
                          </Modal>
                          <FaTrash
                            className="subcategory__icon subcategory__icon--delete"
                            onClick={handleShowDelete}
                          />
                          <Modal
                            show={showDelete}
                            onHide={handleCloseDelete}
                            backdrop="static"
                            keyboard={false}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>Delete Sub-Category</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              Are you sure you want to delete this sub-category?
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                variant="secondary"
                                onClick={handleCloseDelete}
                              >
                                Close
                              </Button>
                              <Button variant="danger">Delete</Button>
                            </Modal.Footer>
                          </Modal>
                        </td>
                      </tr>
                    ))}
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
}

export default SubCategory;
