import React, { useEffect, useState } from "react";
import "../styles/order.css";
import Header from "../components/Header";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation

const Order = () => {
  const [selectedTab, setSelectedTab] = useState("All");
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));
  const [orderList, setOrderList] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const navigate = useNavigate();
  const statusMapping = {
    All: null,
    Pending: 2,
    Confirm: 1,
    Shipping: 3,
    Received: 4,
    Cancelled: 5,
  };
  const statusNames = {
    1: "Confirmed",
    2: "Pending",
    3: "Shipping",
    4: "Received",
    5: "Cancelled",
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/order/${userId}`);
      const order = response.data;
      console.log(order);
      setOrderList(response.data);
      fetchAllOrderItems(order);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllOrderItems = async (orders) => {
    try {
      const itemsResponses = await Promise.all(
        orders.map((order) => axios.get(`/orderItem/${order.orderId}`))
      );

      const itemsData = await Promise.all(
        itemsResponses.map(async (response, index) => {
          const orderId = orders[index].orderId;
          const orderItems = response.data;

          const productItems = await Promise.all(
            orderItems.map(async (item) => {
              const productItemResponse = await axios.get(
                `/productItem/${item.productItemId}`
              );
              return {
                ...item,
                productDetails: productItemResponse.data,
              };
            })
          );

          return { orderId, productItems };
        })
      );

      const formattedItemsData = itemsData.reduce(
        (acc, { orderId, productItems }) => {
          acc[orderId] = productItems;
          return acc;
        },
        {}
      );

      setOrderItems(formattedItemsData);
      console.log("Order Items:", formattedItemsData);
    } catch (error) {
      console.error("Error fetching order items:", error);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await axios.post(`/order/cancel/${orderId}`);
      setOrderList(orderList.filter((order) => order.orderId !== orderId));
      delete orderItems[orderId];
      setOrderItems({ ...orderItems });
      alert("Order canceled successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Failed to cancel order. Please try again.");
    }
  };

  const filteredOrders =
    selectedTab === "All"
      ? orderList
      : orderList.filter(
          (order) => order.orderStatus === statusMapping[selectedTab]
        );

  const tabs = [
    "All",
    "Pending",
    "Confirm",
    "Shipping",
    "Received",
    "Cancelled",
  ];

  return (
    <div className="order-list-page">
      <div className="tabs flex gap-4 justify-center py-4 bg-gray-100 dark:bg-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button px-4 py-2 rounded-md font-medium ${
              selectedTab === tab
                ? "bg-blue-500 text-white"
                : "bg-gray-500 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="order-list container mx-auto px-4 py-6">
        {filteredOrders.map((order) => (
          <div
            className="order-item bg-white shadow-md rounded-md p-4 mb-6 dark:bg-gray-900"
            key={order.orderId}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Order {order.orderId} -{" "}
              <span className="font-bold text-gray-800">
                {statusNames[order.orderStatus] || "Unknown Status"}
              </span>
              <br />
              {new Intl.DateTimeFormat("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(order.orderDate))}
              {order.orderStatusId === 5 && (
                <span className="text-red-500 ml-2">
                  (Canceled on{" "}
                  {new Intl.DateTimeFormat("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                  }).format(new Date(order.canceledDate))}
                  )
                </span>
              )}
            </h3>
            <div className="products-in-order">
              {orderItems[order.orderId]?.map((item) => (
                <div
                  className="product-item flex items-center gap-4 py-4 border-b border-gray-200 dark:border-gray-700"
                  key={item.id}
                >
                  <img
                    src={`./${item.productDetails[0]?.productImage}.jpg`}
                    alt={item.productDetails[0]?.name || "Product"}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div className="product-info">
                    <p className="font-medium text-black dark:text-white">
                      {item.productDetails[0]?.name}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-400 p-2">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-black dark:text-gray-300">
                      Price: {item.price.toLocaleString()} đ
                    </p>
                    <p className="text-black dark:text-gray-300">
                      Subtotal: {(item.price * item.quantity).toLocaleString()}{" "}
                      đ
                    </p>
                    <div className="mt-2">
                      <Link
                        to={`/review/${item.productItemId}`}
                        className="text-decoration-none px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {order.orderStatus === 2 && (
              <div className="text-right mt-4">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => cancelOrder(order.orderId)}
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
