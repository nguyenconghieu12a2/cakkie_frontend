import React, { useEffect, useState } from "react";
import "../styles/order.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const [selectedTab, setSelectedTab] = useState("All");
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));
  const [orderList, setOrderList] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewData, setReviewData] = useState({
    orderProductId: null,
    rating: 5,
    feedback: "",
    imageFile: null,
    isHide: -1,
  });
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
      setOrderList(order);
      fetchAllOrderItems(order);
    } catch (error) {
      console.error("Error fetching orders:", error);
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
    } catch (error) {
      console.error("Error fetching order items:", error);
    }
  };

  const handleReviewButtonClick = (orderProductId) => {
    setReviewData({
      orderProductId,
      rating: 0, // Reset rating to 0
      feedback: "",
      imageFile: null,
      isHide: -1, // Default to not hidden
    });
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async () => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("orderProductId", reviewData.orderProductId);
    formData.append("rating", reviewData.rating);
    formData.append("feedback", reviewData.feedback);
    if (reviewData.imageFile) {
      formData.append("imageFile", reviewData.imageFile);
    }

    try {
      await axios.post("/api/review/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Review added successfully!");
      setIsReviewModalOpen(false);
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Failed to add review. Please try again.");
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
            className={`tab-button px-4 py-2 rounded-md font-medium ${selectedTab === tab
              ? "active"
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
            </h3>
            <div className="products-in-order">
              {orderItems[order.orderId]?.map((item, index) => (
                <div
                  className="product-item flex items-center gap-4 py-4 border-b border-gray-200 dark:border-gray-700"
                  key={`${item.productItemId}-${index}`}
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
                    <button
                      className="text-decoration-none px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      onClick={() => handleReviewButtonClick(item.productItemId)}
                    >
                      Add Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isReviewModalOpen && (
        <div
          className="custom-modal fixed inset-0 flex items-center justify-center custom-bg-overlay"
          style={{ zIndex: 1000 }}
        >
          <div className="custom-modal-content custom-bg-white p-6 rounded-md custom-shadow-lg">
            <h2 className="custom-title text-lg font-semibold mb-4 text-center">Add Review</h2>

            {/* Rating Section */}
            <div className="custom-form-group mb-4">
              <label className="custom-label text-gray-700 font-medium block mb-2">
                Rating:
              </label>
              <div
                className="custom-rating flex gap-2"
                onMouseLeave={() => setHoverRating(0)} // Reset hover effect when mouse leaves
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`custom-star text-3xl transition duration-300 ${hoverRating >= star || reviewData.rating >= star
                        ? "text-yellow-400 scale-110"
                        : "text-gray-300"
                      } hover:text-yellow-400 hover:scale-125`} // Add hover effect
                    onMouseEnter={() => setHoverRating(star)} // Set hover effect
                    onClick={() => setReviewData({ ...reviewData, rating: star })} // Set rating on click
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Section */}
            <div className="custom-form-group mb-4">
              <label className="custom-label text-gray-700 font-medium block mb-2">
                Feedback:
              </label>
              <textarea
                className="custom-textarea w-full p-2 custom-border rounded-md"
                value={reviewData.feedback}
                onChange={(e) =>
                  setReviewData({ ...reviewData, feedback: e.target.value })
                }
              />
            </div>

            {/* Image Upload Section */}
            <div className="custom-form-group mb-4">
              <label className="custom-label text-gray-700 font-medium block mb-2">
                Image:
              </label>
              <input
                type="file"
                className="custom-file-input w-full"
                onChange={(e) =>
                  setReviewData({
                    ...reviewData,
                    imageFile: e.target.files[0],
                  })
                }
              />
            </div>

            {/* isHide Checkbox */}
            <div className="custom-form-group mb-4">
              <label className="custom-label text-gray-700 font-medium block mb-2">
                <input
                  type="checkbox"
                  className="custom-checkbox mr-2"
                  onChange={(e) =>
                    setReviewData({
                      ...reviewData,
                      isHide: e.target.checked ? 1 : -1,
                    })
                  }
                  checked={reviewData.isHide === 1}
                />
                Hide Username
              </label>
            </div>

            {/* Buttons Section */}
            <div className="custom-buttons flex gap-4 justify-end">
              <button
                className="custom-cancel-button px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition duration-300"
                onClick={() => setIsReviewModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="custom-submit-button px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                onClick={handleReviewSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
