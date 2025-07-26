import React, { useState } from "react";

const initialOrders = [
  {
    id: "ORD123",
    product: "Tomato",
    vendor: "VendorA",
    date: "2025-07-25",
    status: "Pending",
  },
  {
    id: "ORD124",
    product: "Onion",
    vendor: "VendorB",
    date: "2025-07-24",
    status: "Shipped",
  },
];

const DeliveryUpdater = () => {
  const [orders, setOrders] = useState(initialOrders);

  const handleStatusChange = (id, newStatus) => {
    const updated = orders.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updated);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold text-orange-700 mb-4">Update Delivery Status</h2>

      {orders.map(order => (
        <div key={order.id} className="border rounded-md p-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="font-semibold">Order ID: {order.id}</p>
            <p>Product: {order.product}</p>
            <p>Ordered by: {order.vendor}</p>
            <p>Date: {order.date}</p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <select
              className="border p-2 rounded-md"
              value={order.status}
              onChange={(e) => handleStatusChange(order.id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
              onClick={() => alert(`Updated status for ${order.id} to "${order.status}"`)}
            >
              Save
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeliveryUpdater;
