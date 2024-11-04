import React, { useEffect, useState } from "react";
import "../styles/checkout.css";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";

const Checkout = () => {
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [coupon, setCoupon] = useState("THANHDEPCHAILMAOLMAOLMAO");
  const [shippingOption, setShippingOption] = useState("Thanhdepchai");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

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
      {console.log(cart)}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left rtl:text-right mt-12 py-5">
          <thead className="text-xs b">
            <tr>
              <th scope="col" className="px-16 py-3 text-center">
                Product
              </th>
              <th scope="col" className="px-16 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            {cart.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="flex flex-row justify-content-center">
                    <img
                      className="w-10 h-10"
                      src={product.imageUrl}
                      alt={product.name}
                    />
                    <div className="px-2 ">
                      <p>{product.name}</p>
                    </div>
                  </div>
                </td>
                <td>
                  {(
                    product.price -
                    (product.price * product.discount) / 100
                  ).toLocaleString()}{" "}
                  VND
                </td>
                <td>{product.quantity}</td>
                <td>
                  {(product.unitPrice * product.quantity).toLocaleString()} VND
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between py-4 px-16 bg-slate-50">
          <div className="flex flex-col items-center mb-2 px-4">
            <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Message for shop
            </label>
            <input
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Type here..."
            />
          </div>

          <div className="flex flex-col items-center mb-2 px-4">
            <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Shipping Option
            </label>
            <div className="flex">
              <p className="px-2">Thanh dep trai</p>
              <p className="px-2 text-blue-500">Change</p>
            </div>
            <div className="py-2"></div>
            <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Cakkie coupon
            </label>
            <div className="flex">
              <p className="px-2">THANHDEPCHAILMAOLMAOLMAO</p>
              <p className="px-2 text-blue-500">Change</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex items-center mb-2 px-4">
              <h3>Order Total (2 Item): 40.000 d</h3>
            </div>
            <div className="flex items-center mb-1 px-4">
              <button
                type="button"
                className="text-white bg-orange-500 hover:bg-orange-700/80 focus:ring-4 focus:outline-none focus:ring-[#]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-orange-700/40 dark:focus:ring-gray-600 me-2 mb-2"
              >
                Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
