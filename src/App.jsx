import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./components/admin-sidebar/sidebar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// LOGIN PAGE
import Login from "./components/admin-login/admin-login";
import ResetPasswordEmail from "./components/admin-login/reset-password-email";
import NewPassword from "./components/admin-login/new-password";

//PRODUCT
import Product from "./components/admin-products/admin-product";
import DeletedProduct from "./components/admin-products/admin-deleted-product";
import ProductDetail from "./components/admin-products/admin-detail-product";
import OutOfStock from "./components/admin-products/out-of-stock";

//CATEGORY
import Category from "./components/admin-categories/admin-category";
import DeletedCategory from "./components/admin-categories/admin-deleted-category";
import SubCategory from "./components/admin-categories/admin-sub-category";
import SubSubCategory from "./components/admin-categories/admin-sub-sub-category";

//CANCELED ORDER
import CanceledOrder from "./components/admin-canceled-orders/admin-canceled-order";
import ListCanceledOrder from "./components/admin-canceled-orders/admin-list-canceled";
import DetailCanceledOrder from "./components/admin-canceled-orders/admin-detail-canceled-order";

//ORDER
import Order from "./components/admin-orders/admin-order";
import DetailOrder from "./components/admin-orders/admin-detail-order";

//COUPON
import Coupon from "./components/admin-coupons/admin-coupon";

//NOT FOUND
import FourOhFour from "./components/not-found/not-found";


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* LOGIN PAGE */}
          <Route path="/admin-login" element={<Login />} />
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

          {/* NOT FOUND */}
          <Route path="*" element={<FourOhFour />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
