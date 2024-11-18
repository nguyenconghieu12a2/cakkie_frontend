import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/admin-discount/category-discount.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoIosAddCircleOutline } from "react-icons/io";
import { CiViewList } from "react-icons/ci";
import Pagination from "react-bootstrap/Pagination";
import AvatarHeader from "../admin-header/admin-header";
import Sidebar from "../admin-sidebar/sidebar";
import SearchCateDiscount from "./search/search-category-discount";
import SearchCommonDiscount from "./search/search-common-discount";
import AddCommonDiscount from "./add-common-discount";
import axios from "axios";

const api1 = "/api/admin/category-discount-list";
const api2 = "/api/admin/common-discount-list";
const apiAddCommonDiscount = "/api/admin/add-common-discount";

const CategoryDiscount = () => {
  const navigate = useNavigate();
  const [categoryDiscount, setCategoryDiscount] = useState([]);
  const [discountCommon, setDiscountCommon] = useState([]);

  const [filteredDiscount, setFilteredDiscount] = useState([]);
  const [filteredCommon, setFilteredCommon] = useState([]);

  const [searchDiscount, setSearchDiscount] = useState("");
  const [searchCommon, setSearchCommon] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);

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

  const fetchCateDiscount = async () => {
    try {
      const response = await axios.get(`${api1}`);
      setCategoryDiscount(response.data);
      setFilteredDiscount(response.data);
    } catch (error) {
      console.log("catch error: ", error);
    }
  };

  const fetchCommonDiscount = async () => {
    try {
      const response = await axios.get(`${api2}`);
      setDiscountCommon(response.data);
      setFilteredCommon(response.data);
    } catch (error) {
      console.log("catch error: ", error);
    }
  };

  useEffect(() => {
    fetchCateDiscount();
    fetchCommonDiscount();
  }, []);

  useEffect(() => {
    const resultsDiscount = categoryDiscount.filter(
      (cd) =>
        cd.cateName.toLowerCase().includes(searchDiscount.toLowerCase()) ||
        cd.currentDiscount
          .toLowerCase()
          .includes(searchDiscount.toLowerCase()) ||
        cd.discountRate.toLowerCase().includes(searchDiscount.toLowerCase())
    );
    setFilteredDiscount(resultsDiscount);
    setCurrentPageDiscount(1);

    const resultsCommon = discountCommon.filter(
      (dc) =>
        dc.discountName.toLowerCase().includes(searchCommon.toLowerCase()) ||
        dc.discountRate.toLowerCase().includes(searchCommon.toLowerCase())
    );
    setFilteredCommon(resultsCommon);
    setCurrentPageCommon(1);
  }, [searchDiscount, categoryDiscount, searchCommon, discountCommon]);

  const handleViewDetailCommonDiscount = (discountId) => {
    navigate(`/admin-common-discount/${discountId}`);
  };

  const handleViewDetailCategoryDiscount = (discountCategoryId, cateName) => {
    navigate(`/admin-detail-category-discount/${discountCategoryId}`, {
      state: { cateName }, // Pass the category name as state
    });
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleCloseAddClick = () => {
    setShowAddModal(false);
  };

  const handleAddCommonDiscount = async (discount) => {
    try {
      const addPayload = {
        name: discount.discountName,
        description: discount.description,
        discountRate: parseFloat(discount.discountRate),
        startDate: discount.startDate,
        endDate: discount.endDate,
        applyCategory: discount.selectedCategory,
      };

      const response = await axios.post(`${apiAddCommonDiscount}`, addPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        // console.log("Check payload", payload);
        fetchCommonDiscount();
        handleCloseAddClick();
      }
    } catch (error) {
      console.error("Error adding common discount: ", error);
    }
  };

  const [itemPerPageDiscount, setItemPerPageDiscount] = useState(5);
  const [itemPerPageCommon, setItemPerPageCommon] = useState(5);

  const [currentPageDiscount, setCurrentPageDiscount] = useState(1);
  const [currentPageCommon, setCurrentPageCommon] = useState(1);

  const totalResultDiscount = filteredDiscount.length;
  const totalResultCommon = filteredCommon.length;

  const totalPagesDiscount = Math.ceil(
    totalResultDiscount / itemPerPageDiscount
  );
  const totalPagesCommon = Math.ceil(totalResultCommon / itemPerPageCommon);

  const pagedResultDiscount = filteredDiscount.slice(
    (currentPageDiscount - 1) * itemPerPageDiscount,
    currentPageDiscount * itemPerPageDiscount
  );

  const pagedResultCommon = filteredCommon.slice(
    (currentPageCommon - 1) * itemPerPageCommon,
    currentPageCommon * itemPerPageCommon
  );

  //discount
  const goToNextPageDiscount = () => {
    if (currentPageDiscount < totalPagesDiscount) {
      setCurrentPageDiscount(currentPageDiscount + 1);
    }
  };
  const goToPreviousPageDiscount = () => {
    if (currentPageDiscount > 1) {
      setCurrentPageDiscount(currentPageDiscount - 1);
    }
  };

  const goToFirstPageDiscount = () => {
    setCurrentPageDiscount(1);
  };

  const goToLastPageDiscount = () => {
    setCurrentPageDiscount(totalPagesDiscount);
  };

  const handleItemPerPageChangeDiscount = (e) => {
    setItemPerPageDiscount(Number(e.target.value));
    setCurrentPageDiscount(1);
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
                <Link to="/admin-discount">Discount</Link> / Category Discount
              </p>
            </div>
            <AvatarHeader />
          </div>
          <hr className="hrr" />
          <SearchCateDiscount
            search={searchDiscount}
            setSearch={setSearchDiscount}
          />
          <div className="items-per-page">
            <div>
              <label>Items per page: </label>
              <select
                value={itemPerPageDiscount}
                onChange={handleItemPerPageChangeDiscount}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
            </div>
          </div>
        </div>
        <div className="discount-card mb-4">
          <h3 className="text-center">Category Discount</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Current Discount</th>
                <th>Discount percent</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pagedResultDiscount.map((cateDis, index) => (
                <tr key={index}>
                  <td>
                    {(currentPageDiscount - 1) * itemPerPageDiscount +
                      index +
                      1}
                  </td>
                  <td>{cateDis.cateName}</td>
                  <td>{cateDis.currentDiscount}</td>
                  <td>{cateDis.discountRate}%</td>
                  <td>
                    <button className="btn btn-outline-secondaryy">
                      <CiViewList
                        onClick={() =>
                          handleViewDetailCategoryDiscount(
                            cateDis.cateId,
                            cateDis.cateName
                          )
                        }
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagging">
            <Pagination className="custom-pagination">
              <Pagination.First
                onClick={goToFirstPageDiscount}
                disabled={currentPageDiscount <= 1}
              />
              <Pagination.Prev
                onClick={goToPreviousPageDiscount}
                disabled={currentPageDiscount <= 1}
              />

              <Pagination.Item>
                {currentPageDiscount} / {totalPagesDiscount}
              </Pagination.Item>

              <Pagination.Next
                onClick={goToNextPageDiscount}
                disabled={currentPageDiscount >= totalPagesDiscount}
              />
              <Pagination.Last
                onClick={goToLastPageDiscount}
                disabled={currentPageDiscount >= totalPagesDiscount}
              />
            </Pagination>
          </div>
        </div>

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
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <div className="add-new-container">
            <IoIosAddCircleOutline
              className="add-new-common-discount"
              onClick={() => handleAddClick()}
            />
          </div>
        </div>

        <AddCommonDiscount
          show={showAddModal}
          handleClose={handleCloseAddClick}
          categories={categoryDiscount}
          handleSave={handleAddCommonDiscount}
        />

        <div className="discount-card mb-4">
          <h3 className="text-center">Common Discount</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Discount Name</th>
                <th>Discount percent</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pagedResultCommon.map((comdis, index) => (
                <tr key={index}>
                  <td>
                    {(currentPageCommon - 1) * itemPerPageCommon + index + 1}
                  </td>
                  <td>{comdis.discountName}</td>
                  <td>{comdis.discountRate}%</td>
                  <td>{comdis.startDate}</td>
                  <td>{comdis.endDate}</td>
                  <td>
                    <button className="btn btn-outline-secondaryy">
                      <CiViewList
                        onClick={() =>
                          handleViewDetailCommonDiscount(comdis.discountId)
                        }
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      </div>
    </div>
  );
};
export default CategoryDiscount;
