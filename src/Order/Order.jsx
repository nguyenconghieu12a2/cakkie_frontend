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
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

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
      console.log(order);
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
      console.log(formattedItemsData);
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
      fetchOrder();
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

  const getStatusDate = (order) => {
    switch (order.orderStatus) {
      case 4: // Received
        return `Received Date: ${order.arrivedDate}`;
      case 5: // Canceled
        return `Canceled Date: ${order.canceledDate || "N/A"}`;
      case 3: // Shipping
        return `Shipping Date: ${order.shippingDate}`;
      default:
        return `Order Date: ${order.orderDate}`;
    }
  };

  const handleCancelButtonClick = (orderId) => {
    setOrderToCancel(orderId);
    setIsCancelModalOpen(true);
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert("Please provide a reason for canceling the order.");
      return;
    }

    try {
      await axios.post(`/order/cancel/${orderToCancel}`, { cancelReason });
      alert("Order canceled successfully!");
      setIsCancelModalOpen(false);
      setCancelReason("");
      fetchOrder();
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Failed to cancel order. Please try again.");
    }
  };
  return (
    <div className="order-list-page">
      <div className="tabs flex gap-4 justify-center py-4 bg-gray-100 dark:bg-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button px-4 py-2 rounded-md font-medium ${
              selectedTab === tab
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
              Order Status -{" "}
              <span className="font-bold text-gray-800">
                {statusNames[order.orderStatus] || "Unknown Status"}
              </span>
            </h3>
            <p>{getStatusDate(order)}</p>
            <div className="products-in-order">
              {orderItems[order.orderId]?.map((item, index) => (
                <div
                  className="product-item flex items-center gap-4 py-4 border-b border-gray-200 dark:border-gray-700"
                  key={`${item.productItemId}-${index}`}
                >
                  <img
                    src={`/images/${item.productDetails[0]?.productImage}`}
                    alt={item.productDetails[0]?.name || "Product"}
                    className="w-28 h-28 rounded-md object-cover"
                  />
                  <div className="product-info">
                    <p className="font-medium text-black dark:text-white m-0">
                      {item.productDetails[0]?.name}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-400 py-2 m-0">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-400 py-2 m-0">
                      Size: {item.productDetails[0]?.size || "size"}
                    </p>
                  </div>
                  {order.orderStatus === 4 ? (
                    <div className="ml-auto text-right">
                      {item.reviewId === 0 ? (
                        <button
                          className="text-decoration-none px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          onClick={() =>
                            handleReviewButtonClick(item.productItemId)
                          }
                        >
                          Add Review
                        </button>
                      ) : (
                        <button
                          className="text-decoration-none px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          onClick={() => navigate(`/product/${item.id}`)}
                        >
                          View Review
                        </button>
                      )}
                    </div>
                  ) : (
                    <p></p>
                  )}
                </div>
              ))}
            </div>
            {order.orderStatus === 2 && (
              <div className="text-right mt-4">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => handleCancelButtonClick(order.orderId)}
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isCancelModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Cancel Order</h2>
            <label className="block text-gray-700 font-medium mb-2">
              Reason for cancellation:
            </label>
            <textarea
              className="w-full p-2 border rounded-md mb-4 text-black "
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Provide your reason here..."
            />
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={() => {
                  setIsCancelModalOpen(false);
                  setCancelReason("");
                }}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={handleCancelOrder}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {isReviewModalOpen && (
        <div
          className="custom-modal fixed inset-0 flex items-center justify-center custom-bg-overlay"
          style={{ zIndex: 1000 }}
        >
          <div className="custom-modal-content custom-bg-white p-6 rounded-md custom-shadow-lg">
            <h2 className="custom-title text-lg font-semibold mb-4 text-center">
              Add Review
            </h2>

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
                    className={`custom-star text-3xl transition duration-300 ${
                      hoverRating >= star || reviewData.rating >= star
                        ? "text-yellow-400 scale-110"
                        : "text-gray-300"
                    } hover:text-yellow-400 hover:scale-125`} // Add hover effect
                    onMouseEnter={() => setHoverRating(star)} // Set hover effect
                    onClick={() =>
                      setReviewData({ ...reviewData, rating: star })
                    } // Set rating on click
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
                className="custom-textarea w-full custom-padding custom-border rounded-md"
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
