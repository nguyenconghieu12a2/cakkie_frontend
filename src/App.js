import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
// LOGIN PAGE
import Login from "./components/admin-login/admin-login";
import ResetPasswordEmail from "./components/admin-login/reset-password-email";
import NewPassword from "./components/admin-login/new-password";
//DASHBOARD
import Dashboard from "./components/dashboard/dashboard";
//BANNERS
import AdminBanner from "./components/admin-banners/admin-banner";
import AddBanner from "./components/admin-banners/admin-add-banner";
import EditBanner from "./components/admin-banners/admin-edit-banner";
//ADMIN PROFILES
import AdminProfile from "./components/admin-profile/manage-profile";
import EditProfile from "./components/admin-profile/edit-profile";
import ChangePassword from "./components/admin-profile/change-password";
//CUSTOMERS
import ManageCustomer from "./components/customers/admin-manage-customer";
import BannedCustomer from "./components/customers/admin-banned-customer";
import DeletedCustomer from "./components/customers/admin-deleted-customer";
import DetailCustomer from "./components/customers/admin-detail-customer";
import EditCustomer from "./components/customers/admin-edit-customer";
//REPORTS (X2)
import Reports from "./components/reports/admin-report";
import Statistic from "./components/statistic/admin-statistic";
//OTHERS
import Header from "./components/header/admin-header";

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Routes>
          {/* LOGIN PAGE */}
          <Route path="/admin-login" element={<Login />} />
          <Route path="/admin-reset-email" element={<ResetPasswordEmail />} />
          <Route path="/admin-reset-password" element={<NewPassword />} />
          {/* DASHBOARD */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* BANNERS */}
          <Route path="/banners" element={<AdminBanner />} />
          <Route path="/add-banners" element={<AddBanner />} />
          <Route path="/edit-banners" element={<EditBanner />} />

          {/* ADMIN PROFILES */}
          <Route path="/admin-profile" element={<AdminProfile />} />
          <Route
            path="/admin-profile/edit/:adminId"
            element={<EditProfile />}
          />
          <Route path="/change-password" element={<ChangePassword />} />
          {/* CUSTOMERS */}
          <Route path="/customers" element={<ManageCustomer />} />
          <Route path="/banned-customers" element={<BannedCustomer />} />
          <Route path="/deleted-customers" element={<DeletedCustomer />} />
          <Route path="/customers/detail/:id" element={<DetailCustomer />} />
          <Route path="/customers/edit/:id" element={<EditCustomer />} />

          {/* REPORTS (X2) */}
          <Route path="/reports" element={<Reports />}></Route>

          <Route path="/statistics" element={<Statistic />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
