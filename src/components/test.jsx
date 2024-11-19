import "../styles/sidebar.css";
import { useState } from "react";
import {
  FaChartLine,
  FaUsers,
  FaDatabase,
  FaPalette,
  FaMoneyBillTransfer,
  FaAngleDown,
  FaChartSimple,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";

const Sidebar = ({ onLogout }) => {
  const [openMenu, setOpenMenu] = useState(""); // Track which menu is open
  const [selected, setSelected] = useState("");

  const handleMenuClick = (menuName) => {
    // Check if there is a selected item inside the current dropdown
    const selectedItems = {
      customer: [
        "customer",
        "manage_customer",
        "banned_customer",
        "deleted_customer",
      ],
      catalog: [
        "catalog",
        "category",
        "product",
        "out_of_stock",
        "deleted_category",
        "deleted_product",
      ],
      sales: ["sales", "order", "canceled_order", "coupons"],
      report: ["reports", "report", "statistic"],
    };

    const isSelectedInMenu =
      selectedItems[menuName]?.includes(selected) || false;

    // Toggle the menu open/close based on current state
    if (openMenu === menuName && !isSelectedInMenu) {
      setOpenMenu(""); // Close the menu if it's already open
    } else {
      setOpenMenu(menuName); // Open the dropdown
    }
  };

  const handleSelected = (selection) => {
    setSelected(selection); // Set the selected item
  };

  return (
    <>
      <div className="sidebar__wrap">
        <div className="sidebar">
          <div className="sidebar__head">
            <img src="../../../images/logo2.png" alt="Logo" />
          </div>
          <div className="sidebar__body">
            <div className="title">
              <h3 className="title__main">OVERVIEW</h3>
            </div>
            <div className="sidebar__content">
              <Link className="sidebar__link" href="#">
                <div
                  className={`menu__list ${
                    selected === "Dashboard" ? "active" : ""
                  }`}
                  onClick={() => handleSelected("Dashboard")}
                >
                  <FaChartLine className="list__icon" />
                  <h3 className="list__title">Dashboard</h3>
                </div>
              </Link>

              {/* Customer Section */}
              <Link
                href="#"
                className="sidebar__link"
                onClick={() => handleMenuClick("customer")}
              >
                <div
                  className={`menu__list ${
                    selected === "customer" ? "active" : ""
                  }`}
                  onClick={() => handleSelected("customer")}
                >
                  <FaUsers className="list__icon" />
                  <h3 className="list__title">Customer</h3>
                  <FaAngleDown
                    className={`icon__down ${
                      openMenu === "customer" ? "rotate" : ""
                    }`}
                  />
                </div>
                {openMenu === "customer" && (
                  <div className="list__subitems">
                    <Link
                      className={`sidebar__link ${
                        selected === "manage_customer" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("manage_customer")}
                      href="#"
                    >
                      <h4 className="item__cate">Manage Customer</h4>
                    </Link>
                    <Link
                      className={`sidebar__link ${
                        selected === "banned_customer" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("banned_customer")}
                      href="#"
                    >
                      <h4 className="item__cate">Banned Customer</h4>
                    </Link>
                    <Link
                      className={`sidebar__link ${
                        selected === "deleted_customer" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("deleted_customer")}
                      href="#"
                    >
                      <h4 className="item__cate">Deleted Customer</h4>
                    </Link>
                  </div>
                )}
              </Link>

              {/* Catalog Section */}
              <Link
                className="sidebar__link"
                onClick={() => handleMenuClick("catalog")}
              >
                <div
                  className={`menu__list ${
                    selected === "catalog" ? "active" : ""
                  }`}
                  onClick={() => handleSelected("catalog")}
                >
                  <FaDatabase className="list__icon" />
                  <h3 className="list__title">Catalog</h3>
                  <FaAngleDown
                    className={`icon__down ${
                      openMenu === "catalog" ? "rotate" : ""
                    }`}
                  />
                </div>
                {openMenu === "catalog" && (
                  <div className="list__subitems">
                    <Link
                      to={"/main-category"}
                      className={`sidebar__link ${
                        selected === "category" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("category")}
                    >
                      <h4 className="item__cate">Category</h4>
                    </Link>
                    <Link
                      to={"/product"}
                      className={`sidebar__link ${
                        selected === "product" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("product")}
                    >
                      <h4 className="item__cate">Product</h4>
                    </Link>
                    <Link
                      to={"/out-of-stock"}
                      className={`sidebar__link ${
                        selected === "out_of_stock" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("out_of_stock")}
                    >
                      <h4 className="item__cate">Out of Stock</h4>
                    </Link>
                    <Link
                      to={"/deleted-category"}
                      className={`sidebar__link ${
                        selected === "deleted_category" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("deleted_category")}
                    >
                      <h4 className="item__cate">Deleted Category</h4>
                    </Link>

                    <Link
                      to={"/deleted-product"}
                      className={`sidebar__link ${
                        selected === "delect_product" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("deleted-product")}
                      href=""
                    >
                      <h4 className="item__cate">Deleted Product</h4>
                    </Link>
                  </div>
                )}
              </Link>

              {/* Sales Section */}
              <Link
                href="#"
                className="sidebar__link"
                onClick={() => handleMenuClick("sales")}
              >
                <div
                  className={`menu__list ${
                    selected === "sales" ? "active" : ""
                  }`}
                  onClick={() => handleSelected("sales")}
                >
                  <FaMoneyBillTransfer className="list__icon" />
                  <h3 className="list__title">Sales</h3>
                  <FaAngleDown
                    className={`icon__down ${
                      openMenu === "sales" ? "rotate" : ""
                    }`}
                  />
                </div>
                {openMenu === "sales" && (
                  <div className="list__subitems">
                    <Link
                      to={"/order"}
                      className={`sidebar__link ${
                        selected === "order" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("order")}
                      href=""
                    >
                      <h4 className="item__cate">Order</h4>
                    </Link>
                    <Link
                      to={"/canceled-order"}
                      className={`sidebar__link ${
                        selected === "canceled_order" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("canceled_order")}
                      href=""
                    >
                      <h4 className="item__cate">Canceled Order</h4>
                    </Link>
                    <Link
                      to={"/coupon"}
                      className={`sidebar__link ${
                        selected === "coupons" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("coupons")}
                    >
                      <h4 className="item__cate">Coupons</h4>
                    </Link>
                  </div>
                )}
              </Link>

              {/* Banner Section */}
              <Link className="sidebar__link" href="#">
                <div
                  className={`menu__list ${
                    selected === "banner" ? "active" : ""
                  }`}
                  onClick={() => handleSelected("banner")}
                >
                  <FaPalette className="list__icon" />
                  <h3 className="list__title">Banners</h3>
                </div>
              </Link>

              {/* Reports Section */}
              <Link
                href="#"
                className="sidebar__link"
                onClick={() => handleMenuClick("report")}
              >
                <div
                  className={`menu__list ${
                    selected === "reports" ? "active" : ""
                  }`}
                  onClick={() => handleSelected("reports")}
                >
                  <FaChartSimple className="list__icon" />
                  <h3 className="list__title">Reports</h3>
                  <FaAngleDown
                    className={`icon__down ${
                      openMenu === "report" ? "rotate" : ""
                    }`}
                  />
                </div>
                {openMenu === "report" && (
                  <div className="list__subitems">
                    <Link
                      className={`sidebar__link ${
                        selected === "report" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("report")}
                      href="#"
                    >
                      <h4 className="item__cate">Report</h4>
                    </Link>
                    <Link
                      className={`sidebar__link ${
                        selected === "statistic" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("statistic")}
                      href="#"
                    >
                      <h4 className="item__cate">Statistic</h4>
                    </Link>
                  </div>
                )}
              </Link>
            </div>
          </div>
          <div className="sidebar__footer">
            <Link to="#" onClick={onLogout}>
              <div className="footer__list">
                <VscSignOut className="footer__icon" />
                <h3 className="footer__title">Sign Out</h3>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
