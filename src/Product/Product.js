import React, { useState } from "react";
import "../styles/product.css";
import Header from "../components/Header";
import axios from "axios";
const Product = ({ id }) => {
  const [selectedSize, setSelectedSize] = useState("160 cm (4.2)");
  const [quantity, setQuantity] = useState(1);

  // axios.get(`http://localhost:8080/Product/1`)
  // .then(res => {
  //     console.log(res.data);
  // })
  // .catch(error => {
  //     console.error("Error fetching product:", error);
  // });

  const sizes = [
    "160 cm (4.2)",
    "121 cm (4.6)",
    "189 cm (5.2)",
    "164 cm (5.0)",
    "191 cm (7.1)",
    "210 cm (8.2)",
  ];

  const handleQuantityChange = (operation) => {
    setQuantity((prevQuantity) =>
      operation === "increment"
        ? prevQuantity + 1
        : Math.max(1, prevQuantity - 1)
    );
  };

  return (
    <div className="product-detail-page">
      <Header Title={"Product"}/>

      <div className="product-container">
        <div className="product-gallery">
          <div className="main-image">
            <img src="path_to_your_image.jpg" alt="Main Product" />
          </div>
        </div>

        <div className="product-info">
          <h2>ANYNAME CAKE LMAOLMAOLMAO</h2>
          <div className="product-rating">
            <span>⭐⭐⭐⭐☆</span>
          </div>

          <div className="product-sizes">
            <p>Size:</p>
            <div className="size-options">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`size-button ${
                    selectedSize === size ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="product-pricing">
            <p className="current-price">600,000 VND</p>
            <p className="old-price">800,000 VND</p>
          </div>

          <div className="quantity-control">
            <button onClick={() => handleQuantityChange("decrement")}>-</button>
            <input type="text" value={quantity} readOnly />
            <button onClick={() => handleQuantityChange("increment")}>+</button>
          </div>

          <div className="action-buttons">
            <button className="buy-now">Buy Now</button>
            <button className="add-to-cart">Add to Cart</button>
          </div>
        </div>
      </div>

      <div className="product-description">
        <div className="tabs">
          <button>Description</button>
          <button>Specification</button>
          <button>Reviews</button>
        </div>
        <div className="tab-content">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            tincidunt tristique nisi...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Product;
