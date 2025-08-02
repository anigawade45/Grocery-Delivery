import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/supplier/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrder(res.data.order);
        setStatus(res.data.order.status);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        toast.error("Order not found");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/supplier/orders/${orderId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Order status updated!");
      setOrder((prev) => ({ ...prev, status }));
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="p-6">Loading order details...</p>;
  if (!order) return <p className="p-6 text-red-500">Order not found.</p>;

  const vendor = order.vendorId;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <Link
        to="/supplier/orders"
        className="text-orange-600 text-sm underline mb-4 block"
      >
        ← Back to Orders
      </Link>

      <h2 className="text-2xl font-bold mb-4">Order #{order._id.slice(-6)}</h2>

      {/* Order Status */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Status:</label>
        <div className="flex gap-2 items-center">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={handleStatusUpdate}
            disabled={status === order.status || updating}
            className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update"}
          </button>
        </div>
      </div>

      {/* Order Details */}
      <p className="mb-2">
        <strong>Ordered On:</strong>{" "}
        {new Date(order.createdAt).toLocaleString()}
      </p>

      {/* Vendor Info */}
      <div className="mt-4 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Vendor Information</h3>
        {vendor ? (
          <div className="text-sm text-gray-800 space-y-1">
            <p>
              <strong>Name:</strong> {vendor.name}
            </p>
            <p>
              <strong>Email:</strong> {vendor.email}
            </p>
            <p>
              <strong>Mobile:</strong> {vendor.phone || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {vendor.formattedAddress || "N/A"}
            </p>
          </div>
        ) : (
          <p className="text-red-500">Vendor details unavailable</p>
        )}
      </div>

      {/* Items */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Items</h3>
        {order.items.map((item) => (
          <div
            key={item._id}
            className="border-b py-2 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{item.productId?.name || "Product"}</p>
              <p className="text-sm text-gray-600">
                ₹{item.price} × {item.quantity}
              </p>
            </div>
            <p className="font-semibold text-orange-600">
              ₹{item.price * item.quantity}
            </p>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-4 text-right font-bold text-lg">
        Total: ₹
        {order.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
