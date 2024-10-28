import React, { useState } from "react";
import "../styles/order.css";
import Header from "../components/Header";
const Order = () => {
  const [selectedTab, setSelectedTab] = useState("All");

  const products = [
    {
      id: 1,
      name: "Anyname T-shirt",
      description: "lmaolmaolmao",
      size: "M",
      unitPrice: 20000,
      quantity: 1,
      subtotal: 20000,
      imageUrl: "path_to_your_image.jpg", // Replace with your image URL
    },
    {
      id: 2,
      name: "Anyname T-shirt",
      description: "lmaolmaolmao",
      unitPrice: 20000,
      quantity: 1,
      subtotal: 20000,
      imageUrl: "path_to_your_image.jpg", // Replace with your image URL
    },
    {
      id: 3,
      name: "Anyname T-shirt",
      description: "lmaolmaolmao",
      unitPrice: 20000,
      quantity: 1,
      subtotal: 20000,
      imageUrl: "path_to_your_image.jpg", // Replace with your image URL
    },
  ];

  const tabs = [
    "All",
    "To Pay",
    "To Ship",
    "To Receive",
    "Completed",
    "Cancelled",
  ];

  return (
    <div className="order-list-page">
      <Header Title={"Order"} />
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${selectedTab === tab ? "active" : ""}`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="product-list">
        {products.map((product) => (
          <div className="product-item" key={product.id}>
            <div className="product-info">
              <img src={product.imageUrl} alt={product.name} />
              <div>
                <p>{product.name}</p>
                <p>{product.description}</p>
                {product.size && <p>Size: {product.size}</p>}
              </div>
            </div>
            <div className="product-details">
              <p>{product.unitPrice.toLocaleString()} đ</p>
              <p>{product.quantity}</p>
              <p>{product.subtotal.toLocaleString()} đ</p>
            </div>
            <button className="review-button">Review</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
