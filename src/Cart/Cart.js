import React from "react";
import { useState } from "react";
import Header from "../components/Header";
import "../styles/cart.css";
import CartItem from "./CartItem";

const Cart = () => {
  const [checkAll, setCheckAll] = useState(false);

  const [data, setData] = useState([
    {
      product_id: 1,
      product_image: "/images/logo2.png",
      product_name: "hehe",
      quantity: 20,
      price: 100000,
      selected: false,
    },
    {
      product_id: 2,
      product_image: "/images/logo2.png",
      product_name: "haha",
      quantity: 20,
      price: 100,
      selected: false,
    },
    {
      product_id: 3,
      product_image: "/images/logo2.png",
      product_name: "hoho",
      quantity: 20,
      price: 100,
      selected: false,
    },
  ]);

  const handleProductChange = (id) => {
    const updatedProducts = data.map((product) =>
      product.product_id === id
        ? { ...product, selected: !product.selected }
        : product
    );
    setData(updatedProducts);

    const allSelected = updatedProducts.every((product) => product.selected);
    setCheckAll(allSelected);
  };

  const handleCheckAllChange = () => {
    const newCheckAll = !checkAll;
    const updatedProducts = data.map((product) => ({
      ...product,
      selected: newCheckAll,
    }));
    setData(updatedProducts);
    setCheckAll(newCheckAll);
  };

  const handlePayment = () => {
    const selectedProducts = data.filter((product) => product.selected);
    console.log("Selected products for payment:", selectedProducts);
  };

  return (
    <>
      <div class="">
        <Header Title={"Shopping Cart"} />
        <div class="cart">
          <div className="cart-title">
            <div>Product</div>
            <div>Quantity</div>
            <div>Price</div>
            <div>Total</div>
            <div>Action</div>
          </div>

          {data.map((product) => (
            <div key={product.product_id} className="cart-list">
              <input
                type="checkbox"
                className="checkbox"
                checked={product.selected}
                onChange={() => handleProductChange(product.product_id)}
              />
              <CartItem
                product_image={product.product_image}
                product_name={product.product_name}
                product_qty={product.quantity}
                price={product.price}
              />
            </div>
          ))}

          <div className="Allbar">
            <div class="select-all">
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
        <div class="footer">
          <h3>&copy; 2023 CAKKIE</h3>
        </div>
      </div>
    </>
  );
};

export default Cart;
