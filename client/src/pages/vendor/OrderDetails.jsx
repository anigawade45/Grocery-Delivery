import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderHistory } from "../../data/data";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const order = orderHistory.find((order) => order.orderId === orderId);

  if (!order) {
    return <p className="text-center text-red-500">Order not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-orange-600 hover:underline"
      >
        ← Back to Orders
      </button>

      <h2 className="text-2xl font-semibold text-orange-700 mb-4">
        Order #{order.orderId}
      </h2>

      <p className="mb-2 text-gray-600">Date: {order.date}</p>
      <p className="mb-2 text-gray-600">Status: {order.status}</p>
      <p className="mb-6 text-gray-600 font-semibold">
        Total Amount: ₹{order.totalAmount}
      </p>

      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-medium mb-2">Items:</h3>
        <ul className="space-y-2">
          {order.items.map((item, idx) => (
            <li
              key={idx}
              className="flex justify-between text-gray-800 border-b pb-2"
            >
              <span>{item.name}</span>
              <span>
                {item.quantity} × ₹{item.unitPrice} = ₹
                {item.quantity * item.unitPrice}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetails;
