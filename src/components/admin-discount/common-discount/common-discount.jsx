import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Table, Pagination, Button } from "react-bootstrap";
import { FaRegEdit } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../styles/admin-discount/common-discount.css";
import AvatarHeader from "../../admin-header/admin-header";
import Sidebar from "../../admin-sidebar/sidebar";
import SearchCateDiscount from "../search/search-category-discount";
import FourOhFour from "../../not-found/not-found";
import EditCommonDiscount from "./edit-common-discount";
import axios from "axios";
import AddCategoryToCommon from "./add-cate-to-common-dis";

const api = "/api/admin/detail-common-discount";
const apiEditCommonDiscount = "/api/admin/edit-common-discount";
const apiNotAppliedCate = "/api/admin/cate-not-applied-common-discount";
const apiAddNotAppliedCate = "/api/admin/add-category-to-common";
const apiRemoveCurrentDiscount = "/api/admin/remove-current-discount";
const apiReplaceCurrentDiscount = "/api/admin/replace-current-discount";

const CommonDiscount = ({ onLogout }) => {
  const navigate = useNavigate();
  const { commonDiscountId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [discount, setDiscount] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [commonCate, setCommonCate] = useState([]);
  const [filteredCate, setFilteredCate] = useState([]);
  const [notAppliedCate, setNotAppliedCate] = useState([]);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [search, setSearch] = useState("");
  // const [selectedCate, setSelectedCate] = useState(null);
  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemPerPage, setItemPerPage] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const jwtToken = sessionStorage.getItem("jwtAdmin");
    if (!jwtToken) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogoutClick = () => {
    sessionStorage.removeItem("jwtAdmin");
    onLogout();
    navigate("/admin-login");
  };

  const fetchDetailCommonDiscount = async (commonDiscountId) => {
    try {
      const response = await axios.get(`${api}/${commonDiscountId}`);
      if (response.status === 200) {
        const data = response.data;
        setDiscount(data);
        setCommonCate(data.commonCateApplieds);
        setFilteredCate(data.commonCateApplieds);

        //check discount is expired
        const currentDate = new Date();
        const endDate = new Date(data.endDate);
        if (endDate < currentDate) {
          setIsExpired(true);
        } else {
          setIsExpired(false);
        }
      }
    } catch (error) {
      console.log("catch 1 error: ", error);

      // If error is a 500 or data is missing, render 404
      if (error.response?.status === 500 || error.response?.status === 404) {
        setDiscount(null); // Set discount to null to trigger the 404 page
      }
    }
  };

  const fetchNotAppliedCate = async (commonDiscountId) => {
    try {
      const response = await axios.get(
        `${apiNotAppliedCate}/${commonDiscountId}`
      );
      if (response.status === 200) {
        setNotAppliedCate(response.data);
      }
    } catch (error) {
      console.log("catch 2 error: ", error);

      // If error is a 500 or data is missing, render 404
      if (
        error.response?.status === 500 ||
        error.response?.status === 404 ||
        error.response?.status === 400
      ) {
        setDiscount(null); // Set discount to null to trigger the 404 page
      }
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoadingTimeout(true);
    }, 7000);

    fetchDetailCommonDiscount(commonDiscountId);
    fetchNotAppliedCate(commonDiscountId);

    return () => clearTimeout(timeoutId);
  }, [commonDiscountId]);

  useEffect(() => {
    const results = commonCate.filter((cc) =>
      cc.cateName.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCate(results);
    setCurrentPage(1);
  }, [search, commonCate]);

  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddClick = () => {
    setShowAddModal(true);
    fetchNotAppliedCate(commonDiscountId);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleAddCategory = async (category) => {
    try {
      const addPayload = {
        categoryId: category.cateId,
        discountId: commonDiscountId,
      };

      console.log("Adding category:", addPayload);

      const response = await axios.post(`${apiAddNotAppliedCate}`, addPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        console.log("Category added successfully:", category); // Debugging success

        // Add the new category to the categories list
        setCommonCate((prev) => {
          const updatedList = [...prev, category];
          console.log("Updated category list:", updatedList); // Debugging the updated list
          return updatedList;
        });
        fetchDetailCommonDiscount(commonDiscountId);
      } else {
        console.error("Error updating discount:", response.data);
      }
    } catch (error) {
      console.error("Error saving updated discount:", error);
    }
  };

  const handleSave = async (updatedDiscount) => {
    try {
      const payload = {
        id: commonDiscountId,
        name: updatedDiscount.discountName,
        description: updatedDiscount.description,
        discountRate: updatedDiscount.discountRate,
        startDate: updatedDiscount.startDate,
        endDate: updatedDiscount.endDate,
      };

      // console.log("check startDate: ", updatedDiscount.startDate);
      // console.log("check endDate: ", updatedDiscount.endDate);

      const response = await axios.put(
        `${apiEditCommonDiscount}/${commonDiscountId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setDiscount((prev) => ({
          ...prev,
          ...updatedDiscount,
        }));
        // check if the new endDate is after the current date
        const currentDate = new Date();
        const endDate = new Date(updatedDiscount.endDate);

        // update the isExpired = false
        if (endDate > currentDate) {
          setIsExpired(false);
        } else {
          setIsExpired(true);
        }
      } else {
        console.error("Error updating discount:", response.data);
      }
    } catch (error) {
      console.error("Error saving updated discount:", error);
    }
  };

  const handleActivate = async (cateId, catedisId) => {
    // console.log(`Activating category with ID: ${cateId}`);
    // Add API call or state update logic here
    try {
      await axios.put(`${apiReplaceCurrentDiscount}/${cateId}/${catedisId}`);
      console.log("replace successfully!");
      fetchDetailCommonDiscount(commonDiscountId);
    } catch (error) {
      console.log("remove current discount error: ", error);
    }
  };

  const handleDeactivate = async (cateId) => {
    // console.log(`Deactivating category with ID: ${cateId}`);
    // Add API call or state update logic here
    try {
      await axios.put(`${apiRemoveCurrentDiscount}/${cateId}`);
      // console.log("remove successfully!");
      fetchDetailCommonDiscount(commonDiscountId);
    } catch (error) {
      console.log("remove current discount error: ", error);
    }
  };

  const totalResult = filteredCate.length;
  const totalPages = Math.ceil(totalResult / itemPerPage);

  const pagedResult = filteredCate.slice(
    (currentPage - 1) * itemPerPage,
    currentPage * itemPerPage
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleItemPerPageChange = (e) => {
    setItemPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loadingTimeout && !discount) {
    return <FourOhFour />; // Display FourOhFour if loading takes too long without response
  }

  if (discount === null) {
    return <FourOhFour />; // Render 404 page if no discount data is found
  }

  if (!commonCate) {
    return <p>Loading...</p>; // Display a loading message while waiting for data
  }

  return (
    <div className="discount-table-container">
      <div>
        <Sidebar onLogout={handleLogoutClick} />
      </div>
      <div className="discount-subtable-container">
        <div>
          <div className="upper-title">
            <div className="profile-header1">
              <h2>Common Discount</h2>
              <p>
                <Link to="/dashboard">Home</Link> / Catalog /{" "}
                <Link to="/admin-discount">Discount</Link> / Common Discount
              </p>
            </div>
            <AvatarHeader />
          </div>
          <hr className="hrr" />
          {isExpired && (
            <div className="alert alert-warning">
              Discount is Expired. Please update Start Date and End Date to
              continue using.
            </div>
          )}
          <div className="p-4 bg-light rounded shadow-sm mb-4">
            <h5>
              <strong style={{ marginRight: "20px" }}>Discount: </strong>
              {discount.discountName}
            </h5>
            <p>
              <strong style={{ marginRight: "5px" }}>Discount rate: </strong>
              {discount.discountRate}
            </p>
            <p>
              <strong style={{ marginRight: "20px" }}>Description: </strong>
              {discount.description}
            </p>
            <p>
              <strong style={{ marginRight: "33px" }}>Start-date: </strong>
              {discount.startDate}
            </p>
            <p>
              <strong style={{ marginRight: "38px" }}>End-date: </strong>
              {discount.endDate}
            </p>
            <button
              className="btn btn-primary float-end"
              style={{ marginTop: "-200px" }}
              onClick={handleEditClick}
            >
              <FaRegEdit />
            </button>
            <EditCommonDiscount
              show={showModal}
              handleClose={handleCloseModal}
              discount={discount}
              handleSave={handleSave}
            />
          </div>

          <SearchCateDiscount search={search} setSearch={setSearch} />

          <div className="items-per-page">
            <div>
              <label>Items per page: </label>
              <select value={itemPerPage} onChange={handleItemPerPageChange}>
                <option value={2}>2</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
            </div>
            <div className="add-cate-btn">
              <button className="btn" onClick={handleAddClick}>
                Add Category
              </button>
            </div>
            {/* Add Category Modal */}
            <AddCategoryToCommon
              show={showAddModal}
              handleClose={handleCloseAddModal}
              handleAddCategory={handleAddCategory}
              notAppliedCate={notAppliedCate}
            />
          </div>
        </div>

        <div className="p-4 bg-light rounded shadow-sm">
          <h5 className="text-center mb-4">Usage Category</h5>
          <Table bordered>
            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Activation</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pagedResult.map((category, index) => (
                <tr key={category.cateId}>
                  <td>{(currentPage - 1) * itemPerPage + index + 1}</td>
                  <td>{category.cateName}</td>
                  <td>{category.isDeleted ? "Activate" : "Inactivate"}</td>
                  <td className="text-center">
                    {category.isDeleted ? (
                      <Button
                        variant="danger"
                        onClick={() => handleDeactivate(category.cateId)}
                        disabled={isExpired}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={() =>
                          handleActivate(category.cateId, category.cateDisId)
                        }
                        disabled={isExpired}
                      >
                        Activate
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* <div className="d-flex justify-content-between align-items-center"> */}
          <div className="pagging">
            <Pagination className="custom-pagination">
              <Pagination.First
                onClick={goToFirstPage}
                disabled={currentPage <= 1}
              />
              <Pagination.Prev
                onClick={goToPreviousPage}
                disabled={currentPage <= 1}
              />

              <Pagination.Item>
                {currentPage} / {totalPages}
              </Pagination.Item>

              <Pagination.Next
                onClick={goToNextPage}
                disabled={currentPage >= totalPages}
              />
              <Pagination.Last
                onClick={goToLastPage}
                disabled={currentPage >= totalPages}
              />
            </Pagination>
          </div>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};
export default CommonDiscount;
