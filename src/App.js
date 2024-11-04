import "./App.css";
import Cart from "./Cart/Cart";
import Checkout from "./Checkout/Checkout";
import Order from "./Order/Order";
import Product from "./Product/Product";
import Footer from "./Footer/Footer";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home/Home";
function App() {
  const [userCart, setUserCart] = useState([]);
  const [userId, setUserId] = useState(1);
  return (
    <div className="App">
      <Router>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/product">Product</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/checkout">Checkout</Link>
          <Link to="/order">Order</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route
            path="/cart"
            element={<Cart userId={userId} setUserCart={setUserCart} />}
          />
          <Route path="/checkout" element={<Checkout userCart={userCart} />} />
          <Route path="/order" element={<Order />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
