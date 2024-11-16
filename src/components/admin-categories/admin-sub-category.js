import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../sidebar";
import "../../styles/admin-category/subcategory.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {
  FaRegSquarePlus,
  FaBars,
  FaPenToSquare,
  FaRegCircleLeft,
} from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Alert from "react-bootstrap/Alert";

//API
//Get SubCate
const api = "/api/admin/category/sub-category";
//Add SubCate
const addSub = "/api/admin/category/add-sub-category";
//Update Cate
const updateSub = "/api/admin/update-category";
//Get Null SubCate
const nullSub = "/api/admin/null-sub-subCate";

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSub = async () => {
    try {
      const result = await axios.get(`${api}/${parentId}`);
      setSubCate(result.data);
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
        `${updateSub}/${cateIdSubEdit}`,
        editSubCate
      );
      if (response.status === 200) {
        setSuccess("Category updated successfully!");
      } else {
        setError("Unexpected response status: " + response.status);
      }
      handleCloseEdit();
      loadSub();
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
  //Pagination
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

  //Load Sub SubCate Null
  const [nullSubSub, setNullSubSub] = useState([]);
  const loadNull = async () => {
    const result = await axios.get(`${nullSub}`);
    setNullSubSub(result.data);
  };

  useEffect(() => {
    loadNull();
  }, []);

  //Pagination Null
  //Pagination
  const [currentPage1, setCurrentPage1] = useState(0);
  const itemsPerPage1 = 10;
  const pageCount1 = Math.ceil(nullSubSub.length / itemsPerPage);
  const displayData1 = nullSubSub.slice(
    currentPage1 * itemsPerPage1,
    (currentPage1 + 1) * itemsPerPage1
  );

  const handlePageClick1 = (event) => {
    setCurrentPage1(event.selected);
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
                    {displayData.map((item, index) => (
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
                            <Modal show={showEdit} onHide={handleCloseEdit}>
                              <Modal.Header closeButton>
                                <Modal.Title>Edit Sub-Category</Modal.Title>
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
                            {/* <FaTrash
                            className="subcategory__icon subcategory__icon--delete"
                            onClick={handleShowDelete}
                          />
                          <Modal show={showDelete} onHide={handleCloseDelete}>
                            <Modal.Header closeButton>
                              <Modal.Title>Confirm Delete</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              Are you sure you want to delete this category?
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                variant="secondary"
                                onClick={handleCloseDelete}
                              >
                                Close
                              </Button>
                              <Button
                                variant="danger"
                                onClick={handleCloseDelete}
                              >
                                Delete
                              </Button>
                            </Modal.Footer>
                          </Modal> */}
                          </div>
                        </td>
                      </tr>
                    ))}
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

          <div className="subcategory__body__wrap">
            <div className="subcategory__body">
              <div className="subcategory__body--head">
                <h4 className="subcategory__body--title">
                  Null Sub Sub-Category
                </h4>
              </div>

              <div className="subcategory__body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">Sub-Category ID</th>
                      <th className="th">Sub-Category Name</th>
                      <th className="th">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData1.map((item, index) => (
                      <tr key={index}>
                        <td className="td">
                          {index + 1 + currentPage1 * pageCount1}
                        </td>
                        <td className="td">{item.cateName}</td>
                        <td className="td">Null</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <ReactPaginate
                className="pagination"
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick1}
                pageRangeDisplayed={5}
                pageCount={pageCount1}
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
    </>
  );
}

export default SubCategory;
