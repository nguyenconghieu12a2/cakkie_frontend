import Sidebar from "../sidebar";
import { useState } from "react";
import "../../styles/deleted-category.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FaArrowsRotate, FaBars, FaTrash } from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import "../../styles/category.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

function DeletedCategory() {
  const data = [];

  const nevigate = useNavigate();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show1, setShow1] = useState(false);

  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(data.length / itemsPerPage);
  const displayData = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = (e) => {
    setCurrentPage(e.selected);
  };

  return (
    <>
      <div className="main__wrap">
        <div className="navbar">
          <Sidebar />
        </div>
        <div className="deleted__category--wrap">
          <div className="deleted__category--head">
            <div className="deleted__category--head--main">
              <h3 className="deleted__category--title">Deleted Category</h3>
              <div className="admin__avater">
                <img src="../images/diddy.jpg" alt="Avatar" />
              </div>
            </div>

            <div className="deleted__category--breadcrumb">
              <Breadcrumb>
                <Breadcrumb.Item active>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Catelog</Breadcrumb.Item>
                <Breadcrumb.Item active>Category</Breadcrumb.Item>
                <Breadcrumb.Item active>Deleted Category</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr />
          </div>

          <div className="deleted__category--body--wrap">
            <div className="deleted__category--body">
              <div className="deleted__category--body--head">
                <h4 className="deleted__category--body--title">
                  Main Deleted Category
                </h4>
              </div>

              <div className="deleted__category--body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">Main Category ID</th>
                      <th className="th">Main Category</th>
                      <th className="th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="td">1</td>
                      <td className="td">Table cell</td>
                      <td className="th handle__icon">
                        <a className="link__icon" href="">
                          <FaBars
                            className="deleted__category--icon deleted__category--icon--menu"
                            onClick={() => nevigate("/deleted-sub-category")}
                          />
                        </a>

                        <a className="link__icon">
                          <FaArrowsRotate
                            className="deleted__category--icon deleted__category--icon--edit"
                            onClick={handleShow}
                          />
                          <Modal
                            show={show}
                            onHide={handleClose}
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
                              <Button variant="secondary" onClick={handleClose}>
                                Close
                              </Button>
                              <Button variant="success">Recovery</Button>
                            </Modal.Footer>
                          </Modal>
                        </a>

                        <a className="link__icon">
                          <FaTrash
                            className="deleted__category--icon deleted__category--icon--delete"
                            onClick={handleShow1}
                          />
                          <Modal
                            show={show1}
                            onHide={handleClose1}
                            backdrop="static"
                            keyboard={false}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>Delete Category</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              Are you sure to delete category?
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                variant="secondary"
                                onClick={handleClose1}
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

export default DeletedCategory;
