import Sidebar from "../sidebar";
import { useState } from "react";
import "../../styles/product.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FaArrowsRotate, FaTrash, FaRegCircleLeft } from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import "../../styles/subsubcategory.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

function DeletedSubSubCategory() {
  const nevigate = useNavigate();

  const [show1, setShow1] = useState(false);

  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  const [show2, setShow2] = useState(false);

  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const data = [];
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const pageCount = Math.ceil(data.length / itemsPerPage);

  const displayData = data.slice(
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
              <h3 className="sub__subcategory__title">Deleted Category</h3>
              <div className="admin__avater">
                <img src="../images/diddy.jpg" alt="Avatar" />
              </div>
            </div>

            <div className="sub__subcategory__breadcrumb">
              <Breadcrumb>
                <Breadcrumb.Item active>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Catelog</Breadcrumb.Item>
                <Breadcrumb.Item active>Deleted Category</Breadcrumb.Item>
                <Breadcrumb.Item active>Main Deleted Category</Breadcrumb.Item>
                <Breadcrumb.Item active>Deleted Sub-Category</Breadcrumb.Item>
                <Breadcrumb.Item active>Deleted Category</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr />
          </div>

          <div className="link__back">
            <a href="" onClick={() => nevigate("/deleted-sub-category")}>
              <FaRegCircleLeft className="back__icon" />
            </a>
          </div>

          <div className="sub__subcategory__body__wrap">
            <div className="sub__subcategory__body">
              <div className="sub__subcategory__body--head">
                <h4 className="sub__subcategory__body--title">
                  Deleted Category
                </h4>
              </div>

              <div className="sub__subcategory__body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">Category ID</th>
                      <th className="th">Sub-Category</th>
                      <th className="th">Category Name</th>
                      <th className="th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="td">1</td>
                      <td className="td">Table cell</td>
                      <td className="td">Table cell</td>
                      <td className="th handle__icon">
                        <a className="link__icon">
                          <FaArrowsRotate
                            className="sub__subcategory__icon sub__subcategory__icon--edit"
                            onClick={handleShow1}
                          />
                          <Modal
                            show={show1}
                            onHide={handleClose1}
                            backdrop="static"
                            keyboard={false}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>Recovery Category</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              Are you sure to recovery this category?
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                variant="secondary"
                                onClick={handleClose1}
                              >
                                Close
                              </Button>
                              <Button variant="success">Recovery</Button>
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
                              Are you sure to delete this category?
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

export default DeletedSubSubCategory;
