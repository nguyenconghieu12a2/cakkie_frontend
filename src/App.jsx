import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import HomePage from './HomePage';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import Profile from './Profile';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check for JWT in localStorage or sessionStorage on app load
    return !!(localStorage.getItem('jwt') || sessionStorage.getItem('jwt'));
  });

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Update login state when login is successful
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Update login state when user logs out
    localStorage.removeItem('jwt'); // Optionally remove token from storage
    sessionStorage.removeItem('jwt');
  };

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn}/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
