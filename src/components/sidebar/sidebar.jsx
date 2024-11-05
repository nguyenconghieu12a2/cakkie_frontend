import "../../styles/sidebar/sidebar.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../logo2.png";
import {
  FaChartLine,
  FaUsers,
  FaDatabase,
  FaPalette,
  FaMoneyBillTransfer,
  FaAngleDown,
} from "react-icons/fa6";
import { VscSignOut } from "react-icons/vsc";
import { AiOutlineLogout } from "react-icons/ai";
import { BsClipboardDataFill } from "react-icons/bs";

function Sidebar({ onLogout }) {
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
      catalog: ["catalog", "category", "product"],
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
    <div className="sidebar__wrap">
      <div className="sidebar">
        <div className="sidebar__head">
          <img src={logo} alt="Logo" />
        </div>
        <div className="sidebar__body">
          <div className="title">
            <h3 className="title__main">OVERVIEW</h3>
          </div>
          <div className="sidebar__content">
            {/* Dashboard Link */}
            <Link to="/dashboard" className="sidebar__link">
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

            {/* Customer Menu */}
            <a
              // href="#"
              className="sidebar__link"
              onClick={() => handleMenuClick("customer")}
            >
              <div className="menu__list">
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
                    to="/customers"
                  >
                    <h4 className="item__cate">Manage Customer</h4>
                  </Link>
                  <Link
                    className={`sidebar__link ${
                      selected === "banned_customer" ? "active" : ""
                    }`}
                    onClick={() => handleSelected("banned_customer")}
                    to="/banned-customers"
                  >
                    <h4 className="item__cate">Banned Customer</h4>
                  </Link>
                  <Link
                    className={`sidebar__link ${
                      selected === "deleted_customer" ? "active" : ""
                    }`}
                    onClick={() => handleSelected("deleted_customer")}
                    to="/deleted-customers"
                  >
                    <h4 className="item__cate">Deleted Customer</h4>
                  </Link>
                </div>
              )}
            </a>

            {/* Catalog Menu */}
            <a
              // href="#"
              className="sidebar__link"
              onClick={() => handleMenuClick("catalog")}
            >
              <div
                className={`menu__list ${
                  selected === "catalog" ? "active" : ""
                }`}
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
                    className={`sidebar__link ${
                      selected === "category" ? "active" : ""
                    }`}
                    onClick={() => handleSelected("category")}
                    to="#"
                  >
                    <h4 className="item__cate">Category</h4>
                  </Link>
                  <Link
                    className={`sidebar__link ${
                      selected === "product" ? "active" : ""
                    }`}
                    onClick={() => handleSelected("product")}
                    to="#"
                  >
                    <h4 className="item__cate">Product</h4>
                  </Link>
                </div>
              )}
            </a>

            {/* Sales Menu */}
            <a
              // href="#"
              className="sidebar__link"
              onClick={() => handleMenuClick("sales")}
            >
              <div
                className={`menu__list ${selected === "sales" ? "active" : ""}`}
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
                    className={`sidebar__link ${
                      selected === "order" ? "active" : ""
                    }`}
                    onClick={() => handleSelected("order")}
                    href="#"
                  >
                    <h4 className="item__cate">Order</h4>
                  </Link>
                  <Link
                    className={`sidebar__link ${
                      selected === "canceled_order" ? "active" : ""
                    }`}
                    onClick={() => handleSelected("canceled_order")}
                    href="#"
                  >
                    <h4 className="item__cate">Canceled Order</h4>
                  </Link>
                  <Link
                    className={`sidebar__link ${
                      selected === "coupons" ? "active" : ""
                    }`}
                    onClick={() => handleSelected("coupons")}
                    to="#"
                  >
                    <h4 className="item__cate">Coupons</h4>
                  </Link>
                </div>
              )}
            </a>

            {/* Banner Link */}
            <Link className="sidebar__link" to="/banners">
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

            {/* Report Menu */}
            <a
              // href="#"
              className="sidebar__link"
              onClick={() => handleMenuClick("report")}
            >
              <div
                className={`menu__list ${
                  selected === "reports" ? "active" : ""
                }`}
              >
                <BsClipboardDataFill className="list__icon" />
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
                    to="/reports"
                  >
                    <h4 className="item__cate">Report</h4>
                  </Link>
                  <Link
                    className={`sidebar__link ${
                      selected === "statistic" ? "active" : ""
                    }`}
                    onClick={() => handleSelected("statistic")}
                    to="/statistics"
                  >
                    <h4 className="item__cate">Statistic</h4>
                  </Link>
                </div>
              )}
            </a>
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
  );
}

export default Sidebar;
