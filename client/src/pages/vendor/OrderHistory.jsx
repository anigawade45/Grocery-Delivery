import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/vendor/orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleReorder = async (orderId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/vendor/orders/${orderId}/reorder`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Reordered successfully!");
    } catch (err) {
      console.error("Error during reorder:", err);
      toast.error("Failed to reorder");
    }
  };

  const filteredOrders = orders.filter((order) =>
    filterStatus ? order.status === filterStatus : true
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-orange-700 mb-6">Order History</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Status</option>
            <option value="Delivered">Delivered</option>
            <option value="Pending">Pending</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse bg-white p-4 rounded-md shadow"
            >
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-base">
            <thead className="bg-orange-100 text-orange-700 text-left">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Items</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.length > 0 ? (
                sortedOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-orange-50 border-t transition"
                  >
                    <td className="p-4 font-semibold text-orange-600 whitespace-nowrap">
                      <Link
                        to={`/vendor/orders/${order._id}`}
                        className="hover:underline"
                      >
                        {order._id.slice(-6).toUpperCase()}
                      </Link>
                    </td>
                    <td className="p-4 text-gray-700">
                      {format(new Date(order.createdAt), "yyyy-MM-dd")}
                    </td>
                    <td className="p-4 text-gray-600 max-w-xs truncate">
                      {order.items.map((i) => i.productId?.name).join(", ")}
                    </td>
                    <td className="p-4 text-gray-800">
                      ₹{order.totalAmount}
                    </td>
                    <td
                      className={`p-4 font-semibold ${
                        order.status === "Delivered"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {order.status}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleReorder(order._id)}
                        className="text-orange-600 hover:underline text-sm"
                      >
                        Reorder
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-gray-500 p-4"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
