import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DeliveryUpdater = () => {
  const [orders, setOrders] = useState([]);
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
        // Add localStatus for inline editing
        const ordersWithLocalStatus = res.data.orders.map((o) => ({
          ...o,
          localStatus: o.status,
        }));
        setOrders(ordersWithLocalStatus || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load supplier orders.");
      }
    };

    fetchOrders();
  }, [token]);

  const handleStatusChange = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === id ? { ...order, localStatus: newStatus } : order
      )
    );
  };

  const handleSave = async (id, newStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/supplier/orders/${id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(
        `✅ Order ${id.slice(-6).toUpperCase()} updated to "${newStatus}"`
      );
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("❌ Failed to update order status.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-orange-700 mb-4">
        Update Delivery Status
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-md p-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <p className="font-semibold text-orange-600">
                Order #{order._id.slice(-6).toUpperCase()}
              </p>
              <p>Product: {order.productName || "N/A"}</p>
              <p>Vendor: {order.vendorName || "N/A"}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <select
                className="border p-2 rounded-md"
                value={order.localStatus}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
                onClick={() => handleSave(order._id, order.localStatus)}
              >
                Save
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DeliveryUpdater;
