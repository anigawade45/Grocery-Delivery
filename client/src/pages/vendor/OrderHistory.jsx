import React, { useState } from "react";
import { orderHistory } from "../../data/data";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleReorder = (items) => {
    alert(`Reordered ${items.length} item(s)!`);
    // You can extend this to dispatch to a global cart context or localStorage
  };

  const handleSort = (orders) => {
    return [...orders].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  const filteredOrders = orderHistory.filter((order) =>
    filterStatus ? order.status === filterStatus : true
  );

  const sortedOrders = handleSort(filteredOrders);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-semibold text-orange-700 mb-6">
        Order History
      </h2>

      {/* Filters */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
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
                className="border-t hover:bg-orange-50 transition cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <td className="p-4 font-medium">
                  <Link
                    to={`/vendor/orders/${order.orderId}`}
                    className="text-orange-600 hover:underline"
                  >
                    {order.orderId}
                  </Link>
                </td>

                <td className="p-4">
                  {format(new Date(order.date), "yyyy-MM-dd")}
                </td>
                <td className="p-4">
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReorder(order.items);
                    }}
                    className="text-orange-600 hover:underline"
                  >
                    Reorder
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-orange-700 mb-4">
              Order Details - {selectedOrder.orderId}
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              Date: {format(new Date(selectedOrder.date), "yyyy-MM-dd")}
            </p>
            <ul className="space-y-2 text-gray-600 text-sm mb-4">
              {selectedOrder.items.map((item, i) => (
                <li key={i}>
                  • {item.name} — {item.quantity} × ₹{item.unitPrice} = ₹
                  {item.quantity * item.unitPrice}
                </li>
              ))}
            </ul>
            <p className="text-lg font-semibold">
              Total: ₹{selectedOrder.totalAmount}
            </p>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
