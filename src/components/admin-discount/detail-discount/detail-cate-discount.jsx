import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import { BsFillForwardFill } from "react-icons/bs";
import { Pagination, Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../styles/admin-discount/detail-cate-discount.css";
import Sidebar from "../../admin-sidebar/sidebar";
import AvatarHeader from "../../admin-header/admin-header";
import SearchCommonDiscount from "../search/search-common-discount";
import SearchDiscount from "../search/search-discount";
import axios from "axios";
import ConfirmDeleteModal from "./comfirm-delete-modal";
import ConfirmReplaceModal from "./comfirm-replace-modal";
import EditDiscreteDiscount from "./edit-discrete-discount";
import AddDiscreteDiscount from "./add-discrete-discount";

const apiDiscountActivate = "/api/admin/detail-discount-activate";
const apiDiscreteInactivate = "/api/admin/detail-discount-inactivate";
const apiCommonInactivate = "/api/admin/detail-common-discount-activate";
const apiAddDiscreteDiscount = "/api/admin/add-discrete-discount";
const apiRemoveCurrentDiscount = "/api/admin/remove-current-discount";
const apiReplaceCurrentDiscount = "/api/admin/replace-current-discount";

const DetailCateDiscount = () => {
  const { discountCategoryId } = useParams();
  const location = useLocation();
  const cateName = location.state?.cateName || "Unknown Category";
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [showEditDiscreteModal, setShowEditDiscreteModal] = useState(false);
  const [showAddDiscreteModal, setShowAddDiscreteModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [discount, setDiscount] = useState({});
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [discountActivate, setDiscountActivate] = useState([]); //discount activate
  const [discountDiscrete, setDiscountDiscrete] = useState([]); //discount discrete
  const [discountCommon, setDiscountCommon] = useState([]); //discount common
  const [filteredDiscrete, setFilteredDiscrete] = useState([]);
  const [filteredCommon, setFilteredCommon] = useState([]);
  const [searchDiscrete, setSearchDiscrete] = useState("");
  const [searchCommon, setSearchCommon] = useState("");

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

  const fetchDiscount = async (discountCategoryId) => {
    try {
      const responseDiscountActivate = await axios.get(
        `${apiDiscountActivate}/${discountCategoryId}`
      );
      const responseDiscreteInactivate = await axios.get(
        `${apiDiscreteInactivate}/${discountCategoryId}`
      );
      const responseCommonInactivate = await axios.get(
        `${apiCommonInactivate}/${discountCategoryId}`
      );

      setDiscountActivate(responseDiscountActivate.data);
      setDiscountDiscrete(responseDiscreteInactivate.data);
      setDiscountCommon(responseCommonInactivate.data);
    } catch (error) {
      console.log("catch error: ", error);
    }
  };

  useEffect(() => {
    fetchDiscount(discountCategoryId);
  }, [discountCategoryId]);

  useEffect(() => {
    const resultsDiscrete = discountDiscrete.filter(
      (di) =>
        di.discountName.toLowerCase().includes(searchDiscrete.toLowerCase()) ||
        di.discountRate.toLowerCase().includes(searchDiscrete.toLowerCase())
    );
    setFilteredDiscrete(resultsDiscrete);
    setCurrentPageDiscrete(1);

    const resultsCommon = discountCommon.filter(
      (dc) =>
        dc.discountName.toLowerCase().includes(searchCommon.toLowerCase()) ||
        dc.discountRate.toLowerCase().includes(searchCommon.toLowerCase())
    );
    setFilteredCommon(resultsCommon);
    setCurrentPageCommon(1);
  }, [searchDiscrete, discountDiscrete, searchCommon, discountCommon]);

  const handleDeleteClick = (discount) => {
    setSelectedDiscount(discount);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    // Perform the delete operation here, like calling an API to remove the discount
    // console.log("Deleting discount:", selectedDiscount);
    try {
      await axios.put(`${apiRemoveCurrentDiscount}/${discountCategoryId}`);
      console.log("remove successfully!");
      fetchDiscount(discountCategoryId);
      setShowDeleteModal(false);
    } catch (error) {
      console.log("remove current discount error: ", error);
    }
  };

  const parseDate = (dateString) => {
    // console.log("Parsing date:", dateString);
    if (!dateString) return null; // Handle null or undefined

    // Replace space between date and time with 'T'
    const isoFormattedString = dateString.replace(" ", "T");

    // Return a new Date object
    return new Date(isoFormattedString);
  };

  const handleReplaceClick = (discountCateId) => {
    if (!discountCateId) {
      console.error("No discount data provided to handleReplaceClick");
      return;
    }
    const currentDate = new Date();
    const endDate = parseDate(discountCateId.endDate);
    // console.log("check data: ", currentDate);
    // console.log("check data: ", endDate);

    if (!endDate || isNaN(endDate.getTime())) {
      console.error("Failed to parse endDate:", discount.endDate);
      return;
    }

    if (endDate < currentDate) {
      setShowExpiredModal(true);
    } else {
      setSelectedDiscount(discountCateId);
      setShowReplaceModal(true);
    }
  };

  const handleCloseExpiredModal = () => {
    setShowExpiredModal(false);
  };

  const handleCloseReplaceModal = () => {
    setShowReplaceModal(false);
  };

  const handleConfirmReplace = async (catedisId) => {
    // Perform the Replace operation here, like calling an API to remove the discount
    // console.log("Replacing discount:", selectedDiscount);
    try {
      await axios.put(
        `${apiReplaceCurrentDiscount}/${discountCategoryId}/${catedisId}`
      );
      // console.log("replace successfully!");
      fetchDiscount(discountCategoryId);
      setShowReplaceModal(false);
    } catch (error) {
      console.log("remove current discount error: ", error);
    }
  };

  const handleEditDiscreteClick = (discount) => {
    setShowEditDiscreteModal(true);
    setSelectedDiscount(discount);
  };

  const handleCloseEditDiscreteModal = () => {
    setShowEditDiscreteModal(false);
  };

  const handleAddDiscreteClick = (discount) => {
    setShowAddDiscreteModal(true);
    setSelectedDiscount(discount);
  };

  const handleCloseAddDiscreteModal = () => {
    setShowAddDiscreteModal(false);
  };

  const handleAddDiscreteDiscount = async (discount) => {
    try {
      const addPayload = {
        name: discount.discountName,
        description: discount.description,
        discountRate: parseFloat(discount.discountRate),
        startDate: discount.startDate,
        endDate: discount.endDate,
      };

      // console.log("Adding discount:", addPayload);

      const response = await axios.post(
        `${apiAddDiscreteDiscount}/${discountCategoryId}`,
        addPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // console.log("Discount added successfully:", response.data); // Debugging success
        fetchDiscount(discountCategoryId);
        handleCloseAddDiscreteModal();
      }
    } catch (error) {
      console.log("error adding discount: ", error);
    }
  };

  const [itemPerPageDiscrete, setItemPerPageDiscrete] = useState(2);
  const [itemPerPageCommon, setItemPerPageCommon] = useState(2);

  const [currentPageDiscrete, setCurrentPageDiscrete] = useState(1);
  const [currentPageCommon, setCurrentPageCommon] = useState(1);

  const totalResultDiscrete = filteredDiscrete.length;
  const totalResultCommon = filteredCommon.length;

  const totalPagesDiscrete = Math.ceil(
    totalResultDiscrete / itemPerPageDiscrete
  );
  const totalPagesCommon = Math.ceil(totalResultCommon / itemPerPageCommon);

  const pagedResultDiscrete = filteredDiscrete.slice(
    (currentPageDiscrete - 1) * itemPerPageDiscrete,
    currentPageDiscrete * itemPerPageDiscrete
  );

  const pagedResultCommon = filteredCommon.slice(
    (currentPageCommon - 1) * itemPerPageCommon,
    currentPageCommon * itemPerPageCommon
  );

  //Discrete
  const goToNextPageDiscrete = () => {
    if (currentPageDiscrete < totalPagesDiscrete) {
      setCurrentPageDiscrete(currentPageDiscrete + 1);
    }
  };
  const goToPreviousPageDiscrete = () => {
    if (currentPageDiscrete > 1) {
      setCurrentPageDiscrete(currentPageDiscrete - 1);
    }
  };

  const goToFirstPageDiscrete = () => {
    setCurrentPageDiscrete(1);
  };

  const goToLastPageDiscrete = () => {
    setCurrentPageDiscrete(totalPagesDiscrete);
  };

  const handleItemPerPageChangeDiscrete = (e) => {
    setItemPerPageDiscrete(Number(e.target.value));
    setCurrentPageDiscrete(1);
  };

  //common
  const goToNextPageCommon = () => {
    if (currentPageCommon < totalPagesCommon) {
      setCurrentPageCommon(currentPageCommon + 1);
    }
  };
  const goToPreviousPageCommon = () => {
    if (currentPageCommon > 1) {
      setCurrentPageCommon(currentPageCommon - 1);
    }
  };

  const goToFirstPageCommon = () => {
    setCurrentPageCommon(1);
  };

  const goToLastPageCommon = () => {
    setCurrentPageCommon(totalPagesCommon);
  };

  const handleItemPerPageChangeCommon = (e) => {
    setItemPerPageCommon(Number(e.target.value));
    setCurrentPageCommon(1);
  };

  return (
    <div className="discount-table-container">
      <div>
        <Sidebar onLogout={handleLogoutClick} />
      </div>
      <div className="discount-subtable-container">
        <div>
          <div className="upper-title">
            <div className="profile-header1">
              <h2>Category Discount</h2>
              <p>
                <Link to="/dashboard">Home</Link> / Catalog /{" "}
                <Link to="/admin-discount">Discount</Link> / Discount Category
              </p>
            </div>
            <AvatarHeader />
          </div>
          <hr className="hrr" />

          <div className="container">
            <h2 className="category-title">Category: {cateName}</h2>

            {/* Current Discount Section */}
            <div className="discount-section">
              <h3>Current Discount</h3>
              <table className="table table-bordered text-center">
                <thead>
                  <tr>
                    <th>Discount Name</th>
                    <th>Discount Rate</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Check if there are current discount is activate */}
                  {discountActivate.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        <div className="no-data-message">
                          No discount in using.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    discountActivate.map((disAct, index) => (
                      <tr key={index}>
                        <td>{disAct.discountName}</td>
                        <td>{disAct.discountRate}%</td>
                        <td>{disAct.startDate}</td>
                        <td>{disAct.endDate}</td>
                        <td>
                          <button
                            className="btn btn-outline-secondary btn-sm mx-1"
                            onClick={() => handleDeleteClick(disAct)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Discrete Discount Section */}
            <div className="top-discrete-discount">
              <div className="add-new-container">
                <IoIosAddCircleOutline
                  className="add-new-common-discount"
                  onClick={() => handleAddDiscreteClick(discountCategoryId)}
                />
              </div>
              <div>
                <SearchDiscount
                  search={searchDiscrete}
                  setSearch={setSearchDiscrete}
                />
              </div>
            </div>
            <AddDiscreteDiscount
              show={showAddDiscreteModal}
              handleClose={handleCloseAddDiscreteModal}
              handleSave={handleAddDiscreteDiscount}
            />
            <div className="items-per-page">
              <div>
                <label>Items per page: </label>
                <select
                  value={itemPerPageDiscrete}
                  onChange={handleItemPerPageChangeDiscrete}
                >
                  <option value={2}>2</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                </select>
              </div>
            </div>
            <div className="discount-section">
              <h3>Discrete Discount</h3>
              <table className="table table-bordered text-center">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Discount Name</th>
                    <th>Discount Rate</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Check if there are any discount is inactivate */}
                  {filteredDiscrete.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        <div className="no-data-message">
                          No discrete discount inactivate.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    pagedResultDiscrete.map((disDisIct, index) => (
                      <tr key={index}>
                        <td>
                          {(currentPageDiscrete - 1) * itemPerPageDiscrete +
                            index +
                            1}
                        </td>
                        <td>{disDisIct.discountName}</td>
                        <td>{disDisIct.discountRate}%</td>
                        <td>{disDisIct.startDate}</td>
                        <td>{disDisIct.endDate}</td>
                        <td>
                          <button
                            className="btn btn-outline-secondary btn-sm mx-1"
                            onClick={() => handleEditDiscreteClick(disDisIct)}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm mx-1"
                            onClick={() => handleReplaceClick(disDisIct)}
                          >
                            🔼
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <EditDiscreteDiscount
                show={showEditDiscreteModal}
                handleClose={handleCloseEditDiscreteModal}
                discount={selectedDiscount}
                fetchData={fetchDiscount}
              />
              {/* Pagination (simulated for display only) */}
              <div className="pagging">
                <Pagination className="custom-pagination">
                  <Pagination.First
                    onClick={goToFirstPageDiscrete}
                    disabled={currentPageDiscrete <= 1}
                  />
                  <Pagination.Prev
                    onClick={goToPreviousPageDiscrete}
                    disabled={currentPageDiscrete <= 1}
                  />

                  <Pagination.Item>
                    {currentPageDiscrete} / {totalPagesDiscrete}
                  </Pagination.Item>

                  <Pagination.Next
                    onClick={goToNextPageDiscrete}
                    disabled={currentPageDiscrete >= totalPagesDiscrete}
                  />
                  <Pagination.Last
                    onClick={goToLastPageDiscrete}
                    disabled={currentPageDiscrete >= totalPagesDiscrete}
                  />
                </Pagination>
              </div>
            </div>

            {/* Common Discount Section */}
            <SearchCommonDiscount
              search={searchCommon}
              setSearch={setSearchCommon}
            />
            <div className="items-per-page">
              <div>
                <label>Items per page: </label>
                <select
                  value={itemPerPageCommon}
                  onChange={handleItemPerPageChangeCommon}
                >
                  <option value={2}>2</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                </select>
              </div>
            </div>
            <div className="discount-section">
              <h3>Common Discount</h3>
              <table className="table table-bordered text-center">
                <thead>
                  <tr>
                    <th>#</th>
                    {/* <th>id check</th> */}
                    <th>Discount Name</th>
                    <th>Discount Rate</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Check if there are any common discount is inactivate */}
                  {filteredCommon.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        <div className="no-data-message">
                          No common discount inactivate.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    pagedResultCommon.map((disComIct, index) => (
                      <tr key={index}>
                        <td>
                          {(currentPageCommon - 1) * itemPerPageCommon +
                            index +
                            1}
                        </td>
                        {/* <td>{disComIct.discountId}</td> */}
                        <td>{disComIct.discountName}</td>
                        <td>{disComIct.discountRate}%</td>
                        <td>{disComIct.startDate}</td>
                        <td>{disComIct.endDate}</td>
                        <td>
                          <div className="w-full ">
                            <div className="flex flex-row justify-center items-center">
                              <button
                                className="btn btn-outline-secondary btn-sm mx-1"
                                onClick={() => handleReplaceClick(disComIct)}
                              >
                                🔼
                              </button>
                              <Link
                                to={`/admin-common-discount/${disComIct.discountId}`}
                              >
                                <BsFillForwardFill className="forward-button-discount" />
                              </Link>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {/* Pagination (simulated for display only) */}
              <div className="pagging">
                <Pagination className="custom-pagination">
                  <Pagination.First
                    onClick={goToFirstPageCommon}
                    disabled={currentPageCommon <= 1}
                  />
                  <Pagination.Prev
                    onClick={goToPreviousPageCommon}
                    disabled={currentPageCommon <= 1}
                  />

                  <Pagination.Item>
                    {currentPageCommon} / {totalPagesCommon}
                  </Pagination.Item>

                  <Pagination.Next
                    onClick={goToNextPageCommon}
                    disabled={currentPageCommon >= totalPagesCommon}
                  />
                  <Pagination.Last
                    onClick={goToLastPageCommon}
                    disabled={currentPageCommon >= totalPagesCommon}
                  />
                </Pagination>
              </div>
            </div>

            {/* Expired Modal */}
            <Modal show={showExpiredModal} onHide={handleCloseExpiredModal}>
              <Modal.Header closeButton>
                <Modal.Title>Discount Expired</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                This discount is expired. Please update the start date and end
                date to continue using it.
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseExpiredModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
              show={showDeleteModal}
              handleClose={handleCloseDeleteModal}
              handleConfirm={handleConfirmDelete}
            />
            {/* Confirm Replace Modal */}
            <ConfirmReplaceModal
              show={showReplaceModal}
              handleClose={handleCloseReplaceModal}
              handleConfirm={() =>
                handleConfirmReplace(selectedDiscount.discountCateId)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailCateDiscount;
