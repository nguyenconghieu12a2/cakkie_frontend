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

function SubSubCategory() {
  const { parentId } = useParams();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show1, setShow1] = useState(false);

  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  const [show2, setShow2] = useState(false);

  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const [subSubCate, setSubSubCate] = useState([]);
  // Fetch Subcategories
  const loadSubSub = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8080/api/category/sub-category/${parentId}`
      );
      setSubSubCate(result.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    loadSubSub();
  }, [parentId]);

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
            <Link to={(`/main-category/sub-category/${parentId}`)}>
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
                      <Form>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>Category Name</Form.Label>
                          <Form.Control type="text" autoFocus />
                        </Form.Group>
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                      <Button variant="primary" onClick={handleClose}>
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
                        <td className="td">{index + 1 + currentPage * pageCount}</td>
                        <td className="td">{item.cateName}</td>
                        <td className="th handle__icon">
                          <a className="link__icon">
                            <FaPenToSquare
                              className="sub__subcategory__icon sub__subcategory__icon--edit"
                              onClick={handleShow1}
                            />
                            <Modal show={show1} onHide={handleClose1}>
                              <Modal.Header closeButton>
                                <Modal.Title>Edit Category</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <Form>
                                  <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlInput1"
                                  >
                                    <Form.Label>Category Name</Form.Label>
                                    <Form.Control
                                      type="text"
                                      autoFocus
                                      value={"Chocolate Cakes"}
                                    />
                                  </Form.Group>
                                </Form>
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="secondary"
                                  onClick={handleClose1}
                                >
                                  Close
                                </Button>
                                <Button
                                  variant="warning"
                                  onClick={handleClose1}
                                >
                                  Edit
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          </a>

                          <a className="link__icon">
                            <FaTrash
                              className="sub__subcategory__icon sub__subcategory__icon--delete"
                              onClick={handleShow2}
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
                                <Button variant="danger">Delete</Button>
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
