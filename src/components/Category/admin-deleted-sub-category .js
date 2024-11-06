import Sidebar from "../sidebar";
import { useState } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {
  FaBars,
  FaArrowsRotate,
  FaTrash,
  FaRegCircleLeft,
} from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import "../../styles/subcategory.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import "../../styles/deleted-sub-category.css";
import ReactPaginate from "react-paginate";

function DeletedSubCategory() {
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
        <div className="deleted__sub--wrap">
          <div className="deleted__sub--head">
            <div className="deleted__sub--head--main">
              <h3 className="deleted__sub--title">Deleted Sub-Category</h3>
              <div className="admin__avater">
                <img src="../../images/diddy.jpg" alt="Avatar" />
              </div>
            </div>

            <div className="deleted__sub--breadcrumb">
              <Breadcrumb>
                <Breadcrumb.Item active>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Catelog</Breadcrumb.Item>
                <Breadcrumb.Item active>Category</Breadcrumb.Item>
                <Breadcrumb.Item active>Deleted Category</Breadcrumb.Item>
                <Breadcrumb.Item active>Deleted Sub-Category</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr />
          </div>
          <div className="link__back">
            <a href="" onClick={() => nevigate("/deleted-category")}>
              <FaRegCircleLeft className="back__icon" />
            </a>
          </div>
          <div className="deleted__sub--body--wrap">
            <div className="deleted__sub--body">
              <div className="deleted__sub--body--head">
                <h4 className="deleted__sub--body--title">
                  Deleted Sub-Category
                </h4>
              </div>

              <div className="deleted__sub--body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">Sub-Category ID</th>
                      <th className="th">Main Category</th>
                      <th className="th">Sub-Category Name</th>
                      <th className="th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="td">1</td>
                      <td className="td">Table cell</td>
                      <td className="td">Table cell</td>
                      <td className="th handle__icon">
                        <a className="link__icon" href="">
                          <FaBars
                            className="deleted__sub--icon deleted__sub--icon--menu"
                            onClick={() =>
                              nevigate("/deleted-sub-sub-category")
                            }
                          />
                        </a>

                        <a className="link__icon">
                          <FaArrowsRotate
                            className="deleted__sub--icon deleted--sub--icon--edit"
                            onClick={handleShow1}
                          />
                          <Modal
                            show={show1}
                            onHide={handleClose1}
                            backdrop="static"
                            keyboard={false}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>Recovery Sub-Category</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              Are you sure to recovery this sub-category?
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

                        <a className="link__icon">
                          <FaTrash
                            className="deleted__sub--icon deleted__sub--icon--delete"
                            onClick={handleShow2}
                          />
                          <Modal
                            show={show2}
                            onHide={handleClose2}
                            backdrop="static"
                            keyboard={false}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>Delete Sub-Category</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              Are you sure to delete this sub-category because
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

export default DeletedSubCategory;
