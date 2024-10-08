import "../styles/sidebar.css";
import { useState } from "react";
import logo from "../images/logo2.png";
import {
  FaChartLine,
  FaUsers,
  FaDatabase,
  FaPalette,
  FaMoneyBillTransfer,
  FaAngleDown,
  FaChartSimple,
} from "react-icons/fa6";

import { AiOutlineLogout } from "react-icons/ai";

function Sidebar() {
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

    // If the menu is open and there's no selected item, toggle close. Otherwise, toggle open.
    if (openMenu === menuName && !isSelectedInMenu) {
      setOpenMenu("");
      // Close the dropdown
    } else {
      setOpenMenu(menuName); // Open the dropdown
    }
  };

  const handleSelected = (selection) => {
    setSelected(selection);
  };

  return (
    <>
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
              <a className="sidebar__link" href="#">
                <div
                  className={`menu__list ${
                    selected === "Dashboard" ? "active" : ""
                  }`}
                  onClick={() => handleSelected("Dashboard")}
                >
                  <FaChartLine className="list__icon" />
                  <h3 className="list__title">Dashboard</h3>
                </div>
              </a>

              <a
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
                    <a
                      className={`sidebar__link ${
                        selected === "manage_customer" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("manage_customer")}
                      href="#"
                    >
                      <h4 className="item__cate">Manage Customer</h4>
                    </a>
                    <a
                      className={`sidebar__link ${
                        selected === "banned_customer" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("banned_customer")}
                      href="#"
                    >
                      <h4 className="item__cate">Banned Customer</h4>
                    </a>
                    <a
                      className={`sidebar__link ${
                        selected === "deleted_customer" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("deleted_customer")}
                      href="#"
                    >
                      <h4 className="item__cate">Deleted Customer</h4>
                    </a>
                  </div>
                )}
              </a>

              <a
                href="#"
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
                    <a
                      className={`sidebar__link ${
                        selected === "category" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("category")}
                      href="#"
                    >
                      <h4 className="item__cate">Category</h4>
                    </a>
                    <a
                      className={`sidebar__link ${
                        selected === "product" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("product")}
                      href="#"
                    >
                      <h4 className="item__cate">Product</h4>
                    </a>
                  </div>
                )}
              </a>

              <a
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
                    <a
                      className={`sidebar__link ${
                        selected === "order" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("order")}
                      href="#"
                    >
                      <h4 className="item__cate">Order</h4>
                    </a>
                    <a
                      className={`sidebar__link ${
                        selected === "canceled_order" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("canceled_order")}
                      href="#"
                    >
                      <h4 className="item__cate">Canceled Order</h4>
                    </a>
                    <a
                      className={`sidebar__link ${
                        selected === "coupons" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("coupons")}
                      href="#"
                    >
                      <h4 className="item__cate">Coupons</h4>
                    </a>
                  </div>
                )}
              </a>

              <a className="sidebar__link" href="#">
                <div
                  className={`menu__list ${
                    selected === "banner" ? "active" : ""
                  }`}
                  onClick={() => handleSelected("banner")}
                >
                  <FaPalette className="list__icon" />
                  <h3 className="list__title">Banners</h3>
                </div>
              </a>

              <a
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
                    <a
                      className={`sidebar__link ${
                        selected === "report" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("report")}
                      href="#"
                    >
                      <h4 className="item__cate">Report</h4>
                    </a>
                    <a
                      className={`sidebar__link ${
                        selected === "statistic" ? "active" : ""
                      }`}
                      onClick={() => handleSelected("statistic")}
                      href="#"
                    >
                      <h4 className="item__cate">Statistic</h4>
                    </a>
                  </div>
                )}
              </a>
            </div>
          </div>
          <div className="sidebar__footer">
            <a href="#">
              <div className="footer__list">
                <AiOutlineLogout className="footer__icon" />
                <h3 className="footer__title">Sign Out</h3>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
