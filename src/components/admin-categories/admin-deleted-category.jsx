import Sidebar from "../sidebar.jsx";
import { useEffect, useState } from "react";
import "../../styles/admin-category/deleted-category.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FaArrowsRotate } from "react-icons/fa6";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

//API
//Get Deleted SubSubCate
const api = "/api/admin/view-deleted/sub-sub-category";

//Recover
const recoverApi = "/api/admin/recover/sub-sub-category";

//Get All Deleted Cate
const allDelete = "/api/admin/full-deleted-categories";

//Get All Sub Deleted
const getAllSubDeleted = "/api/admin/full-sub-deleted";

const DeletedCategory = () => {
  // Logout
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwtAdmin");
    if (!jwtToken) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogoutClick = () => {
    console.log("Logging out...");
    sessionStorage.removeItem("jwtAdmin");
    // onLogout();
    navigate("/admin-login");
  };

  //Search Logic
  const [filteredOrders, setFilteredOrders] = useState([]); // For filtered results
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = deletedSubSub.filter((item) =>
      Object.values(item)
        .map((value) => String(value))
        .join(" ")
        .toLowerCase()
        .includes(term)
    );

    setFilteredOrders(filtered);
    setCurrentPage(0);
  };

  //Fetch Deleted Category Level 3
  const [deletedSubSub, setDeletedSubSub] = useState([]);

  const loadDeletedSubSub = async () => {
    try {
      const result = await axios.get(`${api}`);
      setDeletedSubSub(result.data);
      setFilteredOrders(result.data);
    } catch (error) {
      console.log("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    loadDeletedSubSub();
    loadAllDelete();
    loadAllSubDeleted();
  });

  //Recovery
  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (id) => {
    setSubSubRecoverId(id);
    setShowDelete(true);
  };

  const [subSubRecoverId, setSubSubRecoverId] = useState([]);
  const [recoverError, setRecoverError] = useState("");
  const [recoverSuccess, setRecoverSuccess] = useState("");

  const recoverySubSubCate = async () => {
    try {
      await axios.delete(`${recoverApi}/${subSubRecoverId}`);
      setRecoverSuccess("The sub sub-category recovery successfully!");
      setTimeout(() => setRecoverSuccess(""), 5000);
      // handleCloseDelete();
      loadDeletedSubSub();
    } catch (error) {
      if (error.response && error.response.data) {
        setRecoverError(
          "Cannot deleted this sub sub-category because the sub-category is not existed"
        );
      } else {
        setRecoverError(
          "Failed to recover the sub-subcategory. Please try again."
        );
      }
      setTimeout(() => setRecoverError(""), 5000);
      // handleCloseDelete();
    }
  };

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(filteredOrders.length / itemsPerPage);
  const displayData = filteredOrders.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = (e) => {
    setCurrentPage(e.selected);
  };

  //Fetch All Delete
  const [allDeleteCate, setAllDeleteCate] = useState([]);
  const loadAllDelete = async () => {
    const result = await axios.get(`${allDelete}`);
    setAllDeleteCate(result.data);
  };

  const [currentPage1, setCurrentPage1] = useState(0);
  const itemsPerPage1 = 10;
  const pageCount1 = Math.ceil(allDeleteCate.length / itemsPerPage);
  const displayData1 = allDeleteCate.slice(
    currentPage1 * itemsPerPage1,
    (currentPage1 + 1) * itemsPerPage1
  );

  const handlePageClick1 = (e) => {
    setCurrentPage1(e.selected);
  };

  //Fetch All SubDelete
  const [allSubDeleted, setAllSubDeleted] = useState("");
  const loadAllSubDeleted = async () => {
    const result = await axios.get(`${getAllSubDeleted}`);
    setAllSubDeleted(result.data);
  };

  const [currentPage2, setCurrentPage2] = useState(0);
  const itemsPerPage2 = 10;
  const pageCount2 = Math.ceil(allSubDeleted.length / itemsPerPage);
  const displayData2 = allSubDeleted.slice(
    currentPage2 * itemsPerPage2,
    (currentPage2 + 1) * itemsPerPage2
  );

  const handlePageClick2 = (e) => {
    setCurrentPage2(e.selected);
  };

  return (
    <>
      <div className="main__wrap">
        <div className="navbar">
          <Sidebar onLogout={handleLogoutClick} />
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

          <div className="deleted__subSubCategory--body--wrap">
            <div className="deleted__subSubCategory--body">
              <div className="deleted__subSubCategory--body--head">
                <h4 className="deleted__subSubCategory--body--title">
                  View Deleted Sub Sub-Category
                </h4>
              </div>

              <div className="deleted__subSubCategory--body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">Sub Sub-Category ID</th>
                      <th className="th">Sub Sub-Category Name</th>
                      <th className="th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.length > 0 ? (
                      displayData.map((item, index) => (
                        <tr>
                          <td className="td">{index + 1}</td>
                          <td className="td">{item.cateName}</td>
                          <td className="th handle__icon">
                            <Link className="link__icon">
                              <FaArrowsRotate
                                className="deleted__subSubCategory--icon deleted__subSubCategory--icon--edit"
                                onClick={() => handleShowDelete(item.id)}
                              />
                              <Modal
                                show={showDelete}
                                onHide={handleCloseDelete}
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
                                {recoverError && (
                                  <Alert
                                    variant="danger"
                                    className="text-center"
                                  >
                                    {recoverError}
                                  </Alert>
                                )}
                                {recoverSuccess && (
                                  <Alert
                                    variant="success"
                                    className="text-center"
                                  >
                                    {recoverSuccess}
                                  </Alert>
                                )}
                              </Modal>
                            </Link>
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

            <div className="deleted__subSubCategory--body">
              <div className="deleted__subSubCategory--body--head">
                <h4 className="deleted__subSubCategory--body--title">
                  View Deleted Sub-Category
                </h4>
              </div>

              <div className="deleted__subSubCategory--body--table">
                <Table className="table">
                  <thead className="thead">
                    <tr>
                      <th className="th">#</th>
                      <th className="th">Sub Category</th>
                      <th className="th">Sub Sub-Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData2.length > 0 ? (
                      displayData2.map((item, index) => (
                        <tr key={index}>
                          <td className="td">
                            {index + 1 + pageCount2 * currentPage2}
                          </td>
                          <td className="td">{item.subName}</td>
                          <td className="td">{item.subSubName}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>

                <div>
                  <ReactPaginate
                    className="pagination"
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick2}
                    pageRangeDisplayed={5}
                    pageCount={pageCount2}
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
                      <th className="th">#</th>
                      <th className="th">Main Category</th>
                      <th className="th">Sub Category</th>
                      <th className="th">Sub Sub-Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData1.length > 0 ? (
                      displayData1.map((item, index) => (
                        <tr key={index}>
                          <td className="td">
                            {index + 1 + pageCount1 * currentPage1}
                          </td>
                          <td className="td">{item.cateName}</td>
                          <td className="td">{item.subName}</td>
                          <td className="td">{item.subSubName}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>

                <div>
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
        </div>
      </div>
    </>
  );
};

export default DeletedCategory;
