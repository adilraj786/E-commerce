import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmationPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="text-center mt-10 text-gray-500">
        No order information found.
      </div>
    );
  }

  const {
    orderId,
    items,
    deliveryInfo,
    total,
    paymentMethod,
    paymentStatus, // ✅ added
    createdAt,
  } = state;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-center mb-6">Order Placed Successfully</h1>
      <div className="bg-white shadow-md rounded p-6 space-y-4 border border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium">Order ID:</p>
          <p className="text-sm text-gray-600">{orderId}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium">Order Date:</p>
          <p className="text-sm text-gray-600">{formattedDate}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium">Payment Method:</p>
          <p className="text-sm text-gray-600 uppercase">{paymentMethod}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium">Payment Status:</p>
          <p className="text-sm text-green-600 font-semibold capitalize">
            {paymentStatus || "unknown"}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium">Total Amount:</p>
          <p className="text-sm text-gray-800 font-bold">₹{total}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mt-4 mb-2">Delivery Info:</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {deliveryInfo.firstName} {deliveryInfo.lastName}<br />
            {deliveryInfo.street}, {deliveryInfo.city}, {deliveryInfo.state} - {deliveryInfo.zipcode}, {deliveryInfo.country}<br />
            Phone: {deliveryInfo.phone} | Email: {deliveryInfo.email}
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mt-4 mb-2">Items:</h2>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 border-b pb-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity || 1}
                    {item.category !== "Accessories" && item.size && (
                      <> | Size: {item.size}</>
                    )}
                  </p>
                  <p className="text-sm font-semibold">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center pt-6">
          <button
            onClick={() => navigate("/orders")}
            className="bg-black text-white px-6 py-3 rounded hover:opacity-90"
          >
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
