import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Loader2,
  CheckCircle,
  Clock,
  ClipboardList,
  Ban,
  Package,
} from "lucide-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

// SummaryCard Component
const SummaryCard = ({ icon: Icon, label, value, color }) => {
  return (
    <div className={`bg-${color}-100 p-4 rounded-xl flex items-center gap-3`}>
      <div className={`text-${color}-700`}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className={`text-lg font-semibold text-${color}-800`}>{value}</p>
      </div>
    </div>
  );
};

// OrderItem Component
const OrderItem = ({ item }) => {
  const { name, price, image } = item.productId || {};
  return (
    <div className="flex items-center gap-3 border rounded-lg p-2">
      <img
        src={image?.url || "/placeholder.png"}
        alt={name}
        className="w-14 h-14 rounded object-cover"
      />
      <div className="flex-1">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500">₹{price}</p>
        <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
      </div>
    </div>
  );
};

// Main Component
const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/supplier/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const countByStatus = (status) =>
    orders.filter((order) => order.status === status).length;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <SummaryCard
          icon={ClipboardList}
          label="Total Orders"
          value={orders.length}
          color="orange"
        />
        <SummaryCard
          icon={Clock}
          label="Pending"
          value={countByStatus("pending")}
          color="yellow"
        />
        <SummaryCard
          icon={Package}
          label="Shipped"
          value={countByStatus("shipped")}
          color="red"
        />
        <SummaryCard
          icon={Loader2}
          label="Processing"
          value={countByStatus("processing")}
          color="blue"
        />
        <SummaryCard
          icon={CheckCircle}
          label="Delivered"
          value={countByStatus("delivered")}
          color="green"
        />
        <SummaryCard
          icon={Ban}
          label="Cancelled"
          value={countByStatus("cancelled")}
          color="red"
        />
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No orders found.</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-semibold">
                    Order ID:{" "}
                    <Link
                      to={`/supplier/orders/${order._id}`}
                      className="text-blue-700 hover:underline"
                    >
                      #{order._id.slice(-6)}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600">
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  {order.vendor && (
                    <p className="text-sm text-gray-500">
                      Vendor:{" "}
                      <span className="font-medium">{order.vendor.name}</span>
                    </p>
                  )}
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "processing"
                      ? "bg-blue-100 text-blue-700"
                      : order.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {order.items.map((item, idx) => (
                  <OrderItem key={idx} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManager;
