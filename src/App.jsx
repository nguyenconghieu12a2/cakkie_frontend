import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import HomePage from './HomePage';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import OtpVerification from './OtpVerification';
import ResetPassword from './ResetPassword';
import Profile from './Profile';
import EditProfile from './components/EditProfile';
import ChangePassword from './components/ChangePassword';
import Header from './components/Header';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!(localStorage.getItem('jwt') || sessionStorage.getItem('jwt'));
  });

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
      return null;
    }
  });

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    sessionStorage.removeItem('jwt');
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header isLoggedIn={isLoggedIn} user={user} />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
