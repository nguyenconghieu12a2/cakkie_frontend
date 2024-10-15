import React from "react";
import { useState } from "react";
import Header from "./Header";
import "../styles/cart.css";
import CartItem from "./CartItem";

const Cart = () => {
  const [user, setUser] = useState({ name: "", age: 0 });

  const updateName = (newName) => {
    setUser((prevUser) => ({ ...prevUser, name: newName }));
  };

  const data = [
    {
      product_id: 1,
      product_image: "/images/logo2.png",
      product_name: "hehe",
      quantity: 20,
      price: 100,
    },
    {
      product_id: 2,
      product_image: "/images/logo2.png",
      product_name: "haha",
      quantity: 20,
      price: 100,
    },
    {
      product_id: 3,
      product_image: "/images/logo2.png",
      product_name: "hoho",
      quantity: 20,
      price: 100,
    },
  ];

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

          {data.map((product, i) => (
            <CartItem
              key={i}
              product_image={product.product_image}
              product_name={product.product_name}
              product_qty={product.quantity}
              price={product.price}
            />
          ))}

          <tr>
            <td colspan="4">
              <p>Subtotal: $60.00</p>
            </td>
            <td>
              <button class="checkout-button">Checkout</button>
            </td>
          </tr>

          <div class="select-all">
            <input type="checkbox" id="selectAll" />
            <label for="selectAll">Select all</label>
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
