import React, { useEffect, useState } from "react";
import "../styles/product.css";
import Header from "../components/Header";
import axios from "axios";
import request from "../utils/request";
import { type } from "@testing-library/user-event/dist/type";
const Product = () => {
  const [current, setCurrent] = useState(0);
  const [id, setId] = useState(2);
  const [spec, setSpec] = useState(false);
  const [couponId, setCouponId] = useState(1);
  const [content, setContent] = useState();
  const [toogle, setToogle] = useState(false);
  const [data, setData] = useState();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [coupon, setCoupon] = useState([]);
  const [productList, setProductList] = useState([]);
  const [descriptionList, setDescriptionList] = useState([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // axios
    //   .get(`http://localhost:8080/Product/${id}`)
    //   .then((res) => {
    //     console.log(res.data);
    //     if (res.data) {
    //       const { productList, descriptionList } = res.data;

    //       setProductList(productList);
    //       console.log(productList);
    //       setDescriptionList(descriptionList);
    //       console.log(descriptionList);
    //     } else {
    //       console.error("The response data is missing or malformed.");
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching product data:", error);
    //   })
    //   .finally(() => {
    //     // Set loading to false after data is fetched
    //     setLoading(false);
    //   });
    fetchProduct();
    fetchCoupon();
  }, []);

  const fetchCoupon = async () => {
    try {
      const couponResponse = await axios.get(
        `http://localhost:8080/coupon/${couponId}`
      );
      console.log(couponResponse);
      setCoupon(couponResponse.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/Product/${id}`);
      console.log(response);
      const { productList, descriptionList } = response.data;

      setProductList(productList);
      console.log(productList);
      setDescriptionList(descriptionList);
      console.log(descriptionList);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const selectedDescription = () => {
    setContent(productList[current].description);
    setSpec(false);
    setToogle(!toogle);
    console.log(toogle , spec)
  };

  const selectedSpecification = () => {
    setSpec(!spec);
    setToogle(false);
  };

  const chooseSize = (size) => {
    for (let i = 0; i < productList.length; i++) {
      if (productList[i].size === size) {
        console.log(`Size "${size}" belongs to product at index ${i}`);
        setCurrent(i);
        setSelectedSize(productList[i].size);
      }
    }
  };

  const handleQuantityChange = (operation) => {
    setQuantity((prevQuantity) =>
      operation === "increment"
        ? prevQuantity + 1
        : Math.max(1, prevQuantity - 1)
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-detail-page">
      <Header Title={"Product"} />

      <div className="product-container">
        <div className="product-gallery">
          <div className="main-image">
            <img src="path_to_your_image.jpg" alt="Main Product" />
          </div>
        </div>

        <div className="product-info">
          <h2>{productList[current].name}</h2>
          <div className="product-rating">
            <span>⭐⭐⭐⭐☆</span>
          </div>

          <div className="product-sizes">
            <p>Size:</p>
            <div className="size-options">
              {productList.map((product) => (
                <button
                  key={product}
                  className={`size-button ${
                    selectedSize === product.size ? "selected" : ""
                  }`}
                  onClick={() => chooseSize(product.size)}
                >
                  {product.size}
                </button>
              ))}
            </div>
          </div>

          <div className="product-pricing">
            <p className="current-price">600,000 VND</p>
            <p className="old-price">{productList[current].price} VND</p>
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
          <button onClick={() => selectedDescription()}>Description</button>
          <button onClick={() => selectedSpecification()}>Specification</button>
          <button>Reviews</button>
        </div>
        <div className="tab-content">
          {toogle ? (
            // Show content when toggle is true
            <p>{content}</p>
          ) : (
            // Show the table when spec is true and toggle is false
            spec && (
              <table border="1" cellSpacing="0" cellPadding="5">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {descriptionList.map((des) => (
                    <tr key={des.desId}>
                      <td>{des.descriptionTitle}</td>
                      <td>{des.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
