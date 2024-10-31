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
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left rtl:text-right mt-12 py-5">
          <thead class="text-xs b">
            <tr>
              <th scope="col" class="px-16 py-3 text-center">
                Product
              </th>
              <th scope="col" class="px-16 py-3">
                Price
              </th>
              <th scope="col" class="px-6 py-3">
                Quantity
              </th>
              <th scope="col" class="px-6 py-3">
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="flex flex-row">
                    <img
                      className="w-10 h-10"
                      src={product.imageUrl}
                      alt={product.name}
                    />
                    <div className="px-2">
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

        <div className="flex justify-between py-4 px-16 bg-slate-50">
          <div className="flex flex-col items-center mb-2 px-4">
            <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Message for shop
            </label>
            <input
              class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
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
                className="text-white bg-[#050708] hover:bg-[#050708]/80 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#050708]/40 dark:focus:ring-gray-600 me-2 mb-2"
              >
                <svg
                  className="w-5 h-5 me-2 -ms-1"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="apple"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                >
                  <path
                    fill="currentColor"
                    d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                  ></path>
                </svg>
                Order
              </button>
            </div>
          </div>
        </div>
      </div>
      <footer class="bg-white dark:bg-gray-900">
        <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
          <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <div class="sm:flex sm:items-center sm:justify-between">
            <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
              © 2023{" "}
              <a href="" class="hover:underline">
                CAKKIE™
              </a>
              . All Rights Reserved.
            </span>
            <div class="flex mt-4 sm:justify-center sm:mt-0">
              <a
                href="#"
                class="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <svg
                  class="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 8 19"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="sr-only">Facebook page</span>
              </a>
              <a
                href="#"
                class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
              >
                <svg
                  class="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="sr-only">GitHub account</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
