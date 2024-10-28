import React, { useState } from "react";
import "../styles/checkout.css";
import Header from "../components/Header";

const Checkout = () => {
  const [message, setMessage] = useState("");
  const [coupon, setCoupon] = useState("THANHDEPCHAILMAOLMAOLMAO");
  const [shippingOption, setShippingOption] = useState("Thanhdepchai");

  const products = [
    {
      id: 1,
      name: "Anyname Cake",
      description: "lmaolmaolmao",
      unitPrice: 20000,
      quantity: 1,
      imageUrl: "./images/logo2.png", // Replace with your image URL
    },
    {
      id: 2,
      name: "Anyname Cake",
      description: "lmaolmaolmao",
      unitPrice: 20000,
      quantity: 1,
      imageUrl: "./images/logo2.png", // Replace with your image URL
    },
  ];

  const orderTotal = products.reduce(
    (total, product) => total + product.unitPrice * product.quantity,
    0
  );

  return (
    <div className="checkout-page">
      <Header Title={"Products Ordered"} />
      <div className="order-page">
        <div className="checkout-address">
          <div className="user-address">
            <h1>Delivery Address</h1>
            <div className="shipping-info">
              <p>Name</p>
              <p>Phone Number </p>
              <p>Address</p>
              <p>default</p>
              <button>change</button>
            </div>
          </div>
        </div>
        <table className="product-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Item Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="product-info">
                    <img src={product.imageUrl} alt={product.name} />
                    <div>
                      <p>{product.name}</p>
                      <p>{product.description}</p>
                    </div>
                  </div>
                </td>
                <td>{product.unitPrice.toLocaleString()} đ</td>
                <td>{product.quantity}</td>
                <td>
                  {(product.unitPrice * product.quantity).toLocaleString()} đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="order-options">
          <div className="message-for-shop">
            <label>Message for shop</label>
            <input
              type="text"
              placeholder="Please leave a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="shipping-option">
            <label>Shipping Option: </label>
            <span>{shippingOption}</span>
            <button onClick={() => alert("Change Shipping Option")}>
              Change
            </button>
          </div>
        </div>

        <div className="order-summary">
          <p>Order Total ({products.length} Item):</p>
          <p>{orderTotal.toLocaleString()} đ</p>
        </div>

        <div className="coupon-section">
          <span>🎫 Cakkie coupon</span>
          <span>{coupon}</span>
          <button onClick={() => alert("Change Coupon")}>Change</button>
        </div>

        <div className="Order-button">
          <button>Order</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
