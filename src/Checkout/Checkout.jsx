import React, { useEffect, useState } from "react";
import "../styles/checkout.css";
import Header from "../components/Header";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [coupon, setCoupon] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [userId, setUserId] = useState(2);
  const [shippingOption, setShippingOption] = useState([]);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [shippingId, setShippingId] = useState(0);
  const [paymentMethodList, setPaymentMethodList] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("empty");
  const [paymentMethodId, setPaymentMethodId] = useState(0);
  const [address, setAddress] = useState([]);
  const [addressId, setAddressId] = useState(0);
  const [discountId, setDiscountId] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { product } = location.state || {};
  console.log(product);
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (storedCart != [] && !product) {
      setCart(storedCart);
      fetchCoupon();
      fetchShippingMethod();
      fetchPaymentMethod();
      fetchUserAddess();
    } else if (!product) {
      navigate("/");
    }
  }, []);

  const fetchCoupon = async () => {
    try {
      const couponResponse = await axios.get(`/coupon/`);
      console.log(couponResponse.data);
      setCoupon(couponResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPaymentMethod = async () => {
    try {
      const shippingResponse = await axios.get(`/getPaymentMethods/`);
      console.log(shippingResponse.data);
      setPaymentMethodList(shippingResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchShippingMethod = async () => {
    try {
      const shippingResponse = await axios.get(`/shippingMethod/`);
      console.log(shippingResponse.data);
      setShippingOption(shippingResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserAddess = async () => {
    try {
      const shippingResponse = await axios.get(`/address/${userId}`);
      console.log(shippingResponse.data);
      setAddress(shippingResponse.data);

      const defaultAddress = shippingResponse.data.find(
        (addr) => addr.isDefault === 1
      );
      if (defaultAddress) {
        setAddressId(defaultAddress.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeCart = async () => {
    try {
      const response = await axios.delete(`/clear/${userId}`);

      if (response.status === 200) {
        console.log(cart);
      }
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const addNewOrder = async (order) => {
    const orderLineList = cart.map((product) => ({
      productItemId: product.productItemId,
      price: product.price,
      quantity: product.quantity,
      discountPrice: (product.price * product.discount) / 100,
      note: message || "",
    }));
    const data = {
      userId: userId,
      shippingMethodId: shippingId,
      shippingAddress: addressId,
      paymentMethodId: paymentMethodId,
      orderStatus: 2,
      couponsId: discountId || 0,
      orderTotal: calculateOrderTotal(cart),
      orderLineList: orderLineList,
    };

    try {
      const response = await axios.post(`/addToOrder`, data);

      if (response.status === 200) {
        alert("that ok!");
        removeCart();
        localStorage.removeItem("cart");
        navigate("/");
      }
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleInputChange = (event) => {
    setMessage(event.target.value);
    console.log(message);
  };
  const handleCouponChange = (e) => {
    const selectedCoupon = JSON.parse(e.target.value);
    console.log("Selected ID:", selectedCoupon.id);
    console.log("Selected Price Discount:", selectedCoupon.priceDiscount);
    setDiscount(selectedCoupon.priceDiscount);
    setDiscountId(selectedCoupon.id);
  };

  const handleSetDefault = (e) => {
    const updatedAddresses = address.map((address) =>
      address.id == e.target.value
        ? { ...address, isDefault: 1 }
        : { ...address, isDefault: 0 }
    );
    setAddress(updatedAddresses);
    setAddressId(e.target.value);
    console.log(updatedAddresses);
    console.log(e.target.value);
  };

  const handleShippingMethodChange = (e) => {
    const selectedShippingMethod = JSON.parse(e.target.value);
    setShippingPrice(selectedShippingMethod.shippingPrice);
    setShippingId(selectedShippingMethod.id);

    console.log(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    const selectedPaymentMethod = JSON.parse(e.target.value);
    setPaymentMethod(selectedPaymentMethod.paymentMethod);
    setPaymentMethodId(selectedPaymentMethod.id);
    console.log(paymentMethod, paymentMethodId);
  };

  const OrderProcess = () => {
    if (shippingPrice == 0) {
      alert("You must choose one Shipping Method!!!");
      return;
    }

    if (paymentMethod === "empty") {
      alert("You must choose the Payment Method!!!!");
      return;
    }
    addNewOrder();
  };

  const calculateOrderTotal = (cart) => {
    if (!Array.isArray(cart)) {
      throw new Error("Invalid cart: Must be an array of products.");
    }

    let orderTotal = 0;

    for (const product of cart) {
      if (
        typeof product !== "object" ||
        !product.hasOwnProperty("price") ||
        isNaN(product.price) ||
        !product.hasOwnProperty("discount") ||
        isNaN(product.discount) ||
        !product.hasOwnProperty("quantity") ||
        isNaN(product.quantity) ||
        product.quantity <= 0
      ) {
        throw new Error("Invalid product: Missing or invalid properties.");
      }

      const discountedPrice = product.price * (1 - product.discount / 100);

      orderTotal += discountedPrice * product.quantity;
    }

    return orderTotal - (discount || 0) - shippingPrice;
  };

  return (
    <div className="checkout-page">
      {console.log(cart)}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div>
          <label>Select Default Address: </label>
          <select
            onChange={handleSetDefault}
            value={address.find((address) => address.isDefault)?.id || ""}
          >
            {address.map((address) => (
              <option key={address.id} value={address.id}>
                {address.receiveName} - {address.detailAddress}, {address.wards}
                , {address.district}, {address.province}
              </option>
            ))}
          </select>

          {address
            .filter((address) => address.id === addressId)
            .map((address) => (
              <div
                key={address.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "16px",
                  margin: "16px 0",
                  backgroundColor: address.isDefault ? "#f0f8ff" : "#fff",
                }}
              >
                <h3>{address.receiveName}</h3>
                <p>Phone: {address.phone}</p>
                <p>
                  Address: {address.detailAddress}, {address.wards},{" "}
                  {address.district}, {address.province}
                </p>
                {address.isDefault && (
                  <p>
                    <strong>Default Address</strong>
                  </p>
                )}
              </div>
            ))}
        </div>
        <table className="w-full text-left rtl:text-right mt-12 py-5">
          <thead className="text-xs b">
            <tr>
              <th scope="col" className="px-16 py-3 text-center">
                Product
              </th>
              <th scope="col" className="px-16 py-3 text-center">
                Size
              </th>
              <th scope="col" className="px-16 py-3 text-center">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            {cart.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="flex flex-row align-items-center">
                    <img
                      className="w-20 h-20"
                      src={`./${product.productImage}.jpg`}
                      alt={product.name}
                    />
                    <div className="px-2 align-middle">
                      <p>{product.name}</p>
                    </div>
                  </div>
                </td>
                <td className="text-center">{product.size}</td>
                <td className="text-center">
                  {(
                    product.price -
                    (product.price * product.discount) / 100
                  ).toLocaleString()}{" "}
                  VND
                </td>
                <td className="text-center">{product.quantity}</td>
                <td className="text-center">
                  {(
                    (product.price - (product.price * product.discount) / 100) *
                    product.quantity
                  ).toLocaleString()}{" "}
                  VND
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
              onChange={(event) => handleInputChange(event)}
            />
          </div>

          <div className="flex flex-col items-center mb-2 px-4">
            <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Shipping Option
            </label>
            <div className="flex">
              <select
                name="shippingMethod"
                id="shippingMethod"
                onChange={handleShippingMethodChange}
              >
                <option value={0}>Select shipping method</option>
                {shippingOption.map((shippingMethod) => (
                  <option
                    key={shippingMethod.id}
                    value={JSON.stringify({
                      id: shippingMethod.id,
                      shippingPrice: shippingMethod.price,
                    })}
                  >
                    {shippingMethod.name}{" "}
                    {shippingMethod.price.toLocaleString("vi-VN")} VND
                  </option>
                ))}
              </select>
            </div>
            <div className="py-2"></div>
            <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Cakkie coupon
            </label>
            <div className="flex">
              <p className="px-2">
                <select name="coupon" id="coupon" onChange={handleCouponChange}>
                  <option value={0}>Select a Coupon</option>
                  {coupon.map((ticket) => (
                    <option
                      key={ticket.id}
                      value={JSON.stringify({
                        id: ticket.id,
                        priceDiscount: ticket.priceDiscount,
                      })}
                    >
                      {ticket.code}{" "}
                      {ticket.priceDiscount.toLocaleString("vi-VN")} VND
                    </option>
                  ))}
                </select>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center mb-2 px-4">
            <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Payment Method
            </label>
            <div className="flex">
              <select
                name="shippingMethod"
                id="shippingMethod"
                onChange={handlePaymentMethodChange}
              >
                <option
                  value={JSON.stringify({
                    id: 0,
                    paymentMethod: "empty",
                  })}
                >
                  Select Payment Method
                </option>
                {paymentMethodList.map((paymentMethod) => (
                  <option
                    key={paymentMethod.id}
                    value={JSON.stringify({
                      id: paymentMethod.id,
                      paymentMethod: paymentMethod.name,
                    })}
                  >
                    {paymentMethod.name}{" "}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex items-center mb-2 px-4">
              <h4>
                Order Total ({cart.length} Item):{" "}
                {calculateOrderTotal(cart).toLocaleString("vi-VN")} VND
              </h4>
            </div>
            <div className="flex items-center mb-1 px-4">
              <button
                type="button"
                className="text-white bg-orange-500 hover:bg-orange-700/80 focus:ring-4 focus:outline-none focus:ring-[#]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-orange-700/40 dark:focus:ring-gray-600 me-2 mb-2"
                onClick={() => {
                  OrderProcess();
                }}
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
