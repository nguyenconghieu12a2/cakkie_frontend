import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FlowProvider, useFlow } from "./components/admin-login/Flow";
import "./App.css";
// LOGIN PAGE
import AdminLogin from "./components/admin-login/admin-login";
import AdminResetPasswordEmail from "./components/admin-login/reset-password-email";
import AdminNewPassword from "./components/admin-login/new-password";
import AdminOTPEmail from "./components/admin-login/otp-email";
//DASHBOARD
import Dashboard from "./components/dashboard/dashboard";
//BANNERS
import AdminBanner from "./components/admin-banners/admin-banner";
import AdminAddBanner from "./components/admin-banners/admin-add-banner";
import AdminEditBanner from "./components/admin-banners/admin-edit-banner";
//ADMIN PROFILES
import AdminProfile from "./components/admin-profile/manage-profile";
import AdminEditProfile from "./components/admin-profile/edit-profile";
import AdminChangePassword from "./components/admin-profile/change-password";
//CUSTOMERS
import AdminManageCustomer from "./components/admin-customers/admin-manage-customer";
import AdminBannedCustomer from "./components/admin-customers/admin-banned-customer";
import AdminDeletedCustomer from "./components/admin-customers/admin-deleted-customer";
import AdminDetailCustomer from "./components/admin-customers/admin-detail-customer";
import AdminDetailBannedCustomer from "./components/admin-customers/admin-detail-banned-customer";
import AdminEditCustomer from "./components/admin-customers/admin-edit-customer";

//MANAGE REVIEWS
import AdminPendingReviews from "./components/admin-review/AdminPendingReviews";
import AdminApprovedReviews from "./components/admin-review/AdminApprovedReviews";
import AdminRejectedReviews from "./components/admin-review/AdminRejectedReviews";

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

//REPORTS (X2)
import AdminReports from "./components/admin-reports/admin-report";
import AdminStatistic from "./components/admin-statistic/admin-statistic";
//OTHERS
import FourOhFour from "./components/not-found/not-found";

import CategoryDiscount from "./components/admin-discount/category-discount";
import CommonDiscount from "./components/admin-discount/common-discount/common-discount";
import DetailCateDiscount from "./components/admin-discount/detail-discount/detail-cate-discount";

const ProtectedRoute = ({ allowedStep, element }) => {
  const { flowStep } = useFlow();
  return flowStep === allowedStep ? (
    element
  ) : (
    <Navigate to="/admin-reset-email" />
  );
};

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <FlowProvider>
          <Routes>
            {/* LOGIN PAGE */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/admin-reset-email"
              element={<AdminResetPasswordEmail />}
            />
            <Route
              path="/admin-reset-otp"
              element={
                <ProtectedRoute allowedStep="otp" element={<AdminOTPEmail />} />
              }
            />
            <Route
              path="/admin-reset-password"
              element={
                <ProtectedRoute
                  allowedStep="new-password"
                  element={<AdminNewPassword />}
                />
              }
            />
            {/* DASHBOARD */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* BANNERS */}
            <Route path="/admin-banners" element={<AdminBanner />} />
            <Route path="/admin-add-banners" element={<AdminAddBanner />} />
            <Route path="/admin-edit-banners" element={<AdminEditBanner />} />

            {/* ADMIN PROFILES */}
            <Route path="/admin-profile" element={<AdminProfile />} />
            <Route path="/admin-profile/edit" element={<AdminEditProfile />} />
            <Route
              path="/admin-change-password"
              element={<AdminChangePassword />}
            />
            {/* CUSTOMERS */}
            <Route path="/admin-customers" element={<AdminManageCustomer />} />
            <Route
              path="/admin-banned-customers"
              element={<AdminBannedCustomer />}
            />
            <Route
              path="/admin-banned-customers/detail/:id"
              element={<AdminDetailBannedCustomer />}
            />
            <Route
              path="/admin-deleted-customers"
              element={<AdminDeletedCustomer />}
            />
            <Route
              path="/admin-customers/detail/:id"
              element={<AdminDetailCustomer />}
            />
            <Route
              path="/admin-customers/edit/:id"
              element={<AdminEditCustomer />}
            />

            {/* MANAGE REVIEW */}
            <Route
              path="/admin-reviews/pending"
              element={<AdminPendingReviews />}
            />
            <Route
              path="/admin-reviews/approved"
              element={<AdminApprovedReviews />}
            />
            <Route
              path="/admin-reviews/rejected"
              element={<AdminRejectedReviews />}
            />

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

            {/* DISCOUNT */}
            <Route path="/admin-discount" element={<CategoryDiscount />} />
            <Route
              path="/admin-common-discount/:commonDiscountId"
              element={<CommonDiscount />}
            />
            <Route
              path="/admin-detail-category-discount/:discountCategoryId"
              element={<DetailCateDiscount />}
            />

            {/* REPORTS (X2) */}
            <Route path="/admin-reports" element={<AdminReports />} />
            <Route path="/admin-statistics" element={<AdminStatistic />} />

            {/* 404 Not Found Route */}
            <Route path="*" element={<FourOhFour />} />
          </Routes>
        </FlowProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
