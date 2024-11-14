import Sidebar from "../sidebar";
import { useEffect, useState } from "react";
import "../../styles/product.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {
  FaRegSquarePlus,
  FaPenToSquare,
  FaTrash,
  FaRegCircleLeft,
} from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import "../../styles/subsubcategory.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import ReactPaginate from "react-paginate";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import { BiSave } from "react-icons/bi";

function SubSubCategory() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { parentId } = useParams();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show1, setShow1] = useState(false);

  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  const [show2, setShow2] = useState(false);

  const handleClose2 = () => setShow2(false);
  const handleShow2 = (id) => {
    setDeleteSubId(id); 
    setShow2(true);
  };
  const [subSubCate, setSubSubCate] = useState([]);
  // Fetch Subcategories
  const loadSubSub = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8080/api/category/sub-category/${parentId}/sub-sub-category`
      );
      setSubSubCate(result.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    loadSubSub();
  }, [parentId]);

  //Create new subSubCate
  const [newSubSubCate, setNewSubSubCate] = useState({
    cateName: "",
    parentId: parentId,
    isDeleted: 1,
  });

  const handleInputChange = (e) => {
    setNewSubSubCate({ ...newSubSubCate, [e.target.name]: e.target.value });
  };

  const saveSubSubCate = async (e) => {
    e.preventDefault();
    const regex = /^[a-zA-Z][a-zA-Z0-9\s]*$/;
    const cateExisted = subSubCate.some(
      (item) =>
        item.cateName.toLowerCase() === newSubSubCate.cateName.toLowerCase()
    );
    if (!regex.test(newSubSubCate.cateName)) {
      setError(
        "Category name cannot start with whitespace or contain special characters!"
      );
      setSuccess("");
      return;
    } else if (newSubSubCate.cateName.length > 30) {
      setError("Category name should be less than 30 characters!");
      setSuccess("");
      return;
    } else if (newSubSubCate.cateName.length < 4) {
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
      console.log("Submitting new sub-category data:", newSubSubCate);

      const response = await axios.post(
        `http://localhost:8080/api/category/sub-category/${parentId}/sub-sub-category`,
        {
          cateName: newSubSubCate.cateName,
          isDeleted: newSubSubCate.isDeleted,
        }
      );

      setSuccess("Subcategory created successfully!");
      loadSubSub();
      newSubSubCate({
        cateName: "",
        parentId: parentId,
        isDeleted: 1,
      });

      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (error) {
      console.error("Error saving subcategory:", error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  //Edit
  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);
  const [editSubCate, setEditSubCate] = useState({});
  const [cateIdSubEdit, setCateIdSubEdit] = useState(null);

  const handleEditInputChange = (e) => {
    setEditSubCate({ ...editSubCate, [e.target.name]: e.target.value });
    console.log("Edit input changed:", { [e.target.name]: e.target.value });
  };

  const editSubSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting edit for ID:", cateIdSubEdit);
    console.log("Data to submit:", editSubCate);
    try {
      const response = await axios.put(
        `http://localhost:8080/api/category/${cateIdSubEdit}`,
        editSubCate
      );
      if (response.status === 200) {
        setSuccess("Category updated successfully!");
      } else {
        setError("Unexpected response status: " + response.status);
      }
      handleCloseEdit();
      loadSubSub();
      setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
    } catch (error) {
      console.error("Error editing sub-category:", error);
      setError("Failed to update sub-category. Please try again.");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  //Delete SubSubCate
  const [deleteSubId, setDeleteSubId] = useState(null);
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/delete/sub-sub-category/${deleteSubId}`
      );
      loadSubSub();
      handleClose2();
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  //Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const pageCount = Math.ceil(subSubCate.length / itemsPerPage);

  const displayData = subSubCate.slice(
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
        <div className="sub__subcategory__wrap">
          <div className="sub__subcategory__head">
            <div className="sub__subcategory__head--main">
              <h3 className="sub__subcategory__title">Category</h3>
              <div className="admin__avater">
                <img src="../images/diddy.jpg" alt="Avatar" />
              </div>
            </div>

            <div className="sub__subcategory__breadcrumb">
              <Breadcrumb>
                <Breadcrumb.Item active>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Catelog</Breadcrumb.Item>
                <Breadcrumb.Item active>Category</Breadcrumb.Item>
                <Breadcrumb.Item active>Main Category</Breadcrumb.Item>
                <Breadcrumb.Item active>Sub-Category</Breadcrumb.Item>
                <Breadcrumb.Item active>Category</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr />
          </div>

          <div className="link__back">
            <Link to={`/main-category`}>
              <FaRegCircleLeft className="back__icon" />
            </Link>
          </div>

          <div className="sub__subcategory__body__wrap">
            <div className="sub__subcategory__body">
              <div className="sub__subcategory__body--head">
                <h4 className="sub__subcategory__body--title">Category</h4>
                <a>
                  <FaRegSquarePlus
                    className="sub__subcategory__icon--add"
                    onClick={handleShow}
                  />
                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Add Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form onSubmit={saveSubSubCate}>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>Category Name</Form.Label>
                          <Form.Control
                            autoFocus
                            type="text"
                            name="cateName"
                            value={newSubSubCate.cateName}
                            onChange={handleInputChange}
                            placeholder="Enter category name"
                          />
                        </Form.Group>
                        {success && <Alert variant="success">{success}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                      <Button
                        variant="success"
                        type="submit"
                        form="addSubCateForm"
                        onClick={saveSubSubCate}
                      >
                        Create
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </a>
              </div>

              <div className="sub__subcategory__body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">Category ID</th>
                      <th className="th">Category Name</th>
                      <th className="th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.map((item, index) => (
                      <tr key={item.id}>
                        <td className="td">
                          {index + 1 + currentPage * pageCount}
                        </td>
                        <td className="td">{item.cateName}</td>
                        <td className="th handle__icon">
                          <a className="link__icon">
                            <FaPenToSquare
                              className="sub__subcategory__icon sub__subcategory__icon--edit"
                              onClick={() => {
                                setCateIdSubEdit(item.id);
                                setEditSubCate(item);
                                handleShowEdit();
                              }}
                            />
                            <Modal show={showEdit} onHide={handleCloseEdit}>
                              <Modal.Header closeButton>
                                <Modal.Title>Edit Sub-SubCategory</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <Form
                                  id="editSubCateForm"
                                  onSubmit={editSubSubmit}
                                >
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
                                  form="editSubCateForm"
                                >
                                  Update
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          </a>

                          <a className="link__icon">
                            <FaTrash
                              className="sub__subcategory__icon sub__subcategory__icon--delete"
                              onClick={() => handleShow2(item.id)}
                            />
                            <Modal
                              show={show2}
                              onHide={handleClose2}
                              backdrop="static"
                              keyboard={false}
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>Delete Category</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                Are you sure to delete this category because
                                many products will be effected?
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="secondary"
                                  onClick={handleClose2}
                                >
                                  Close
                                </Button>
                                <Button variant="danger" onClick={handleDelete}>Delete</Button>
                              </Modal.Footer>
                            </Modal>
                          </a>
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

export default SubSubCategory;