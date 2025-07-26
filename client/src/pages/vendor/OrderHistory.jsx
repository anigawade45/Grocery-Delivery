import React, { useState } from "react";
import { orderHistory } from "../../data/data";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleReorder = (items) => {
    alert(`Reordered ${items.length} item(s)!`);
    // Extend this to push items to cart context/localStorage if needed
  };

  const filteredOrders = orderHistory.filter((order) =>
    filterStatus ? order.status === filterStatus : true
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-semibold text-orange-700 mb-6">
        Order History
      </h2>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="Delivered">Delivered</option>
            <option value="Pending">Pending</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-orange-100 text-orange-700">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Date</th>
              <th className="p-4">Items</th>
              <th className="p-4">Amount (₹)</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order) => (
              <tr
                key={order._id}
                className="border-t hover:bg-orange-50 transition"
              >
                <td className="p-4 font-medium text-orange-600">
                  <Link
                    to={`/vendor/orders/${order.orderId}`}
                    className="hover:underline"
                  >
                    {order.orderId}
                  </Link>
                </td>
                <td className="p-4">
                  {format(new Date(order.date), "yyyy-MM-dd")}
                </td>
                <td className="p-4 truncate max-w-xs">
                  {order.items.map((i) => i.name).join(", ")}
                </td>
                <td className="p-4">₹{order.totalAmount}</td>
                <td
                  className={`p-4 font-semibold ${
                    order.status === "Delivered"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleReorder(order.items)}
                    className="text-orange-600 hover:underline"
                  >
                    Reorder
                  </button>
                </td>
              </tr>
            ))}
            {sortedOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;
