import Sidebar from "../sidebar";
import { useEffect, useState } from "react";
import "../../styles/admin-category/deleted-category.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FaArrowsRotate } from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import axios from "axios";

//API
//Get Deleted SubSubCate
const api = "/api/admin/view-deleted/sub-sub-category";

//Recover
const recoverApi = "/api/admin/recover/sub-sub-category";

function DeletedCategory() {
  //Fetch Deleted Category Level 3
  const [deletedSubSub, setDeletedSubSub] = useState([]);

  const loadDeletedSubSub = async () => {
    try {
      const result = await axios.get(
        `${api}`
      );
      setDeletedSubSub(result.data);
    } catch (error) {
      console.log("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    loadDeletedSubSub();
  });

  //Recovery
  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (id) => {
    setSubSubRecoverId(id);
    setShowDelete(true);
  };

  const [subSubRecoverId, setSubSubRecoverId] = useState([]);

  const recoverySubSubCate = async () => {
    try {
      await axios.delete(
        `${recoverApi}/${subSubRecoverId}`
      );
      handleCloseDelete();
      loadDeletedSubSub();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(deletedSubSub.length / itemsPerPage);
  const displayData = deletedSubSub.slice(
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

          <div className="deleted__subSubCategory--body--wrap">
            <div className="deleted__subSubCategory--body">
              <div className="deleted__subSubCategory--body--head">
                <h4 className="deleted__subSubCategory--body--title">
                  View Deleted Category
                </h4>
              </div>

              <div className="deleted__subSubCategory--body--table">
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
                      <tr>
                        <td className="td">{index + 1}</td>
                        <td className="td">{item.cateName}</td>
                        <td className="th handle__icon">
                          <Link className="link__icon">
                            <FaArrowsRotate
                              className="deleted__subSubCategory--icon deleted__subSubCategory--icon--edit"
                              onClick={() => handleShowDelete(item.id)}
                            />
                            <Modal show={showDelete} onHide={handleCloseDelete}>
                              <Modal.Header closeButton>
                                <Modal.Title>Recovery Category</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                Are you sure to recovery this category?
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="secondary"
                                  onClick={handleCloseDelete}
                                >
                                  Close
                                </Button>
                                <Button
                                  variant="success"
                                  onClick={recoverySubSubCate}
                                >
                                  Recovery
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          </Link>
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

export default DeletedCategory;
