import React, { useEffect } from "react";
import { useState } from "react";
import Header from "../components/Header";
import "../styles/cart.css";
import CartItem from "./CartItem";
import axios from "axios";
const Cart = () => {
  const [id, setId] = useState(1);
  const [userId, setUserId] = useState(2);
  const [checkAll, setCheckAll] = useState(false);
  const [productList, setProductList] = useState([]);
  const [cart, setCart] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    try {
      const responseCart = await axios.get(
        `http://localhost:8080/cart/${userId}`
      );
      console.log(responseCart.data);
      setCart(responseCart.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (cart.length > 0) {
      fetchAllProducts();
    }
  }, [cart]);

  const fetchAllProducts = async () => {
    try {
      const productFetchPromises = cart.map((car) =>
        fetchProduct(car.productItemId)
      );
      const products = await Promise.all(productFetchPromises);

      const updatedProducts = products.flat().map((product) => ({
        ...product,
        selected: false,
      }));

      setProductList(updatedProducts);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProduct = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/productItem/${productId}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  console.log(productList);

  const handleProductChange = (id, select) => {
    const updatedProducts = productList.map((product) =>
      product.productItemId === id ? { ...product, selected: !product.selected } : product
    );

    const allSelected = updatedProducts.every((product) => product.selected);
    setCheckAll(allSelected);
  };

  const handleCheckAllChange = () => {
    const newCheckAll = !checkAll;
    const updatedProducts = productList.map((product) => ({
      ...product,
      selected: newCheckAll,
    }));
    setProductList(updatedProducts);
    setCheckAll(newCheckAll);
  };

  const handlePayment = () => {
    const selectedProducts = data.filter((product) => product.selected);
    console.log("Selected products for payment:", selectedProducts);
  };

  return (
    <>
      <div className="">
        <Header Title={"Shopping Cart"} />
        <div className="cart">
          <div className="cart-title">
            <div>Product</div>
            <div>Quantity</div>
            <div>Price</div>
            <div>Total</div>
            <div>Action</div>
          </div>

          {productList.map((product) => (
            <div key={product.productItemId} className="cart-list">
              <input
                type="checkbox"
                className="checkbox"
                checked={product.selected}
                onChange={() =>
                  handleProductChange(product.productItemId, product.selected)
                }
              />
              <CartItem
                product_image={product.ProductId}
                product_name={product.product_name}
                product_qty={0}
                price={product.price}
              />
            </div>
          ))}

          <div className="Allbar">
            <div className="select-all">
              <input
                type="checkbox"
                checked={checkAll}
                onChange={handleCheckAllChange}
              />
              <label>Check All</label>
            </div>
            <div className="item remove">
              <button>Remove</button>
            </div>
            <div className="Checkout">
              <h3>Subtotal: $60.00</h3>
              <button onClick={handlePayment}>Checkout</button>
            </div>
          </div>
        </div>
        <div className="footer">
          <h3>&copy; 2023 CAKKIE</h3>
        </div>
      </div>
    </>
  );
};

export default Cart;
