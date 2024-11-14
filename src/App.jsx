import { Link, Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import HomePage from "./HomePage";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import OtpVerification from "./OtpVerification";
import ResetPassword from "./ResetPassword";
import Profile from "./Profile";
import EditProfile from "./components/EditProfile";
import ChangePassword from "./components/ChangePassword";
import UserHeader from "./components/Header"; // Renamed to UserHeader
import UserFooter from "./components/Footer"; // Renamed to UserFooter
import "bootstrap/dist/css/bootstrap.min.css";
import Product from "./Product/Product";
import Cart from "./Cart/Cart";
import Checkout from "./Checkout/Checkout";
import Order from "./Order/Order";

function App() {
  const [userCart, setUserCart] = useState([]);
  const [userId, setUserId] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!(localStorage.getItem("jwt") || sessionStorage.getItem("jwt"));
  });

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
      return null;
    }
  });

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    sessionStorage.removeItem("jwt");
  };

  const location = useLocation();

  // Define routes where UserHeader and UserFooter should be shown
  const userRoutes = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
    "/profile",
    "/edit-profile",
    "/change-password",
    "/order",
    "/cart",
    "/checkout",
    "/product",
  ];

  // Show header and footer only if the current path matches one of the userRoutes
  const shouldShowUserHeaderFooter = userRoutes.includes(location.pathname);

  return (
    <div className="d-flex flex-column min-vh-100">
      {shouldShowUserHeaderFooter && (
        <UserHeader isLoggedIn={isLoggedIn} user={user} />
      )}

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/profile"
            element={<Profile onLogout={handleLogout} />}
          />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route
            path="/cart"
            element={<Cart userId={userId} setUserCart={setUserCart} />}
          />
          <Route path="/checkout" element={<Checkout userCart={userCart} />} />
          <Route path="/order" element={<Order />} />
        </Routes>
      </main>
      {shouldShowUserHeaderFooter && <UserFooter />}
    </div>
  );
}

export default App;
