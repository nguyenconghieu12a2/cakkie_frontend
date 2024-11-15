import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./components/sidebar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// LOGIN PAGE
import Login from "./components/Login/admin-login";
import ResetPasswordEmail from "./components/Login/reset-password-email";
import NewPassword from "./components/Login/new-password";

import Product from "./components/Product/admin-product";
import Category from "./components/Category/admin-category";
import Order from "./components/Orders/admin-order";
import DetailOrder from "./components/Orders/admin-detail-order";
import Coupon from "./components/Coupons/admin-coupon";
import DeletedProduct from "./components/Product/admin-deleted-product";
import DeletedCategory from "./components/Category/admin-deleted-category";
import SubCategory from "./components/Category/admin-sub-category";
import SubSubCategory from "./components/Category/admin-sub-sub-category";
import CanceledOrder from "./components/Orders/admin-canceled-order";
import ListCanceledOrder from "./components/Orders/admin-list-canceled";
import DetailCanceledOrder from "./components/Orders/admin-detail-canceled-order";
import ProductDetail from "./components/Product/admin-detail-product";
import OutOfStock from "./components/Product/out-of-stock";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* LOGIN PAGE */}
          <Route path="/" element={<Login />} />
          <Route path="/admin-reset-email" element={<ResetPasswordEmail />} />
          <Route path="/admin-reset-password" element={<NewPassword />} />

          <Route path="/sidebar" element={<Sidebar />} />

          {/* PRODUCT PAGE */}
          <Route path="/product" element={<Product />} />
          <Route path="/product/detail/:id" element={<ProductDetail />} />
          <Route path="/deleted-product" element={<DeletedProduct />} />
          <Route path="/out-of-stock" element={<OutOfStock />} />

          {/* CATEGORY PAGE */}
          <Route path="/main-category" element={<Category />} />
          <Route
            path="/main-category/sub-category/:parentId"
            element={<SubCategory />}
          />
          <Route
            path="/main-category/sub-category/category/:parentId"
            element={<SubSubCategory />}
          />
          <Route path="/deleted-category" element={<DeletedCategory />} />

          {/* ORDER PAGE */}
          <Route path="/order" element={<Order />} />
          <Route path="/order/detail/:id" element={<DetailOrder />} />

          {/* CANCELED PAGE */}
          <Route path="/canceled-order" element={<CanceledOrder />} />
          <Route path="/list-canceled/:id" element={<ListCanceledOrder />} />
          <Route
            path="/detail-canceled/:id"
            element={<DetailCanceledOrder />}
          />

          {/* COUPON PAGE */}
          <Route path="/coupon" element={<Coupon />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
