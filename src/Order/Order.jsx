import React, { useEffect, useState } from "react";
import "../styles/order.css";
import Header from "../components/Header";
import axios from "axios";
const Order = () => {
  const [selectedTab, setSelectedTab] = useState("All");
  const [userId, setUserId] = useState(1);
  const [orderList, setOrderList] = useState([]);
  const [orderItems, setOrderItems] = useState({});

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

      // Convert itemsData into a structure that can be used in state
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
    "Pending",
    "To Ship",
    "To Receive",
    "Completed",
    "Cancelled",
  ];

  return (
    <div className="order-list-page">
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
      <div className="order-list">
        {orderList.map((order) => (
          <div className="order-item" key={order.orderId}>
            <h3>Order #{order.orderId}</h3>
            <div className="products-in-order">
              {orderItems[order.orderId]?.map((item) => (
                <div className="product-item" key={item.id}>
                  <div className="product-info">
                    <img
                      src={`./${item.productDetails[0]?.productImage}.jpg`}
                      alt={item.productDetails[0]?.name || "Product"}
                    />
                    <div>
                      <p>{item.productDetails[0]?.name}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="product-details">
                    <p>Price: {item.price.toLocaleString()} đ</p>
                    <p>
                      Subtotal: {(item.price * item.quantity).toLocaleString()}{" "}
                      đ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
