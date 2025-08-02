import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/vendor/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrder(res.data.order);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order:", err);
        toast.error("Failed to load order.");
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleReorder = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/vendor/orders/${orderId}/reorder`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Reordered successfully!");
    } catch (err) {
      console.error("Error during reorder:", err);
      toast.error("Failed to reorder");
    }
  };

  const exportPDF = async () => {
    const input = document.getElementById("invoice-content");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Order_${orderId}.pdf`);
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading order...</p>;
  }

  if (!order) {
    return <p className="text-center text-red-500 mt-10">Order not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-orange-600 hover:underline text-sm font-medium"
      >
        ← Back to Orders
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-orange-700">
          Order #{order._id.slice(-6).toUpperCase()}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={handleReorder}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition"
          >
            Reorder
          </button>
          <button
            onClick={exportPDF}
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 border transition"
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="mb-6 text-gray-600 space-y-1">
        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
        <p>Status: {order.status}</p>
        <p>Supplier: {order.supplierId?.name || "N/A"}</p>
        <p className="font-semibold text-gray-800">
          Total Amount: ₹{order.totalAmount}
        </p>
      </div>

      <div id="invoice-content" className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Items</h3>
        <ul className="space-y-4">
          {order.items.map((item, idx) => {
            const product = item.productId;
            return (
              <li
                key={idx}
                className="flex justify-between items-center border-b pb-3"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image?.url}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <Link
                    to={`/vendor/product/${product._id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {product.name}
                  </Link>
                </div>
                <div className="text-gray-700 text-sm">
                  {item.quantity} × ₹{product.price} = ₹
                  {item.quantity * product.price}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetails;
