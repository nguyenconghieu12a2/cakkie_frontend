import "./style/sidebar.css";
import { useState } from "react";
import {
  FaChalkboard,
  FaUsers,
  FaDatabase,
  FaPalette,
  FaMoneyBillTransfer,
  FaAngleDown,
} from "react-icons/fa6";

import { AiOutlineLogout } from "react-icons/ai";

function Sidebar() {
  const [openMenu, setOpenMenu] = useState(""); // Track which menu is open

  const handleMenuClick = (menuName) => {
    setOpenMenu(openMenu === menuName ? "" : menuName); // Toggle the menu
  };

  return (
    <>
      <div className="sidebar__wrap">
        <div className="sidebar">
          <div className="sidebar__head">
            <img src="/public/images/5.png" alt="Logo" />
          </div>
          <div className="sidebar__body">
            <div className="title">
              <h3 className="title__main">OVERVIEW</h3>
            </div>
            <div className="sidebar__content">
              <a className="sidebar__link" href="#">
                <div className="menu__list">
                  <FaChalkboard className="list__icon" />
                  <h3 className="list__title">Dashboard</h3>
                </div>
              </a>

              <a className="sidebar__link" href="#">
                <div className="menu__list">
                  <FaUsers className="list__icon" />
                  <h3 className="list__title">User</h3>
                </div>
              </a>

              <a
                href="#"
                className="sidebar__link"
                onClick={() => handleMenuClick("catalog")}
              >
                <div className="menu__list">
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
                    <a className="sidebar__link" href="#">
                      <h4 className="item__cate">Category</h4>
                    </a>
                    <a className="sidebar__link" href="#">
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
                <div className="menu__list">
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
                    <a className="sidebar__link" href="#">
                      <h4 className="item__cate">Order</h4>
                    </a>
                    <a className="sidebar__link" href="#">
                      <h4 className="item__cate">Canceled Order</h4>
                    </a>
                    <a className="sidebar__link" href="#">
                      <h4 className="item__cate">Coupons</h4>
                    </a>
                  </div>
                )}
              </a>

              <a className="sidebar__link" href="#">
                <div className="menu__list">
                  <FaPalette className="list__icon" />
                  <h3 className="list__title">Design</h3>
                </div>
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
