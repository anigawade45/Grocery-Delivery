import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/supplier/orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("❌ Failed to load orders.");
      }
    };

    fetchOrders();
  }, [token]);

  const handleStatusChange = async (orderId, newStatus) => {
    setLoading(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/supplier/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast.success(`✅ Order status updated to "${newStatus}"`);
    } catch (err) {
      console.error("Failed to update order status:", err);
      toast.error("❌ Failed to update order status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-orange-700 mb-4">
        Incoming Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders available.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-orange-200 rounded-lg p-4 flex justify-between items-center hover:shadow transition"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  #{order._id} — {order.productName || "Product"}
                </p>
                <p className="text-sm text-gray-600">
                  Customer: {order.customerName || "Anonymous"} | Qty:{" "}
                  {order.quantity} {order.unit}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-orange-600">{order.status}</span>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  disabled={loading}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManager;
