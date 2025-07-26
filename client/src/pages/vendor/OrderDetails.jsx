import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { orderHistory, products } from "../../data/data";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const order = orderHistory.find((order) => order.orderId === orderId);

  const handleReorder = () => {
    // Simulate reorder action
    alert(`Reordered ${order.items.length} item(s)!`);
    // You can replace this with context/localStorage/cart state logic
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

  const getProductImage = (name) => {
    const match = products.find((p) => p.name === name);
    return match?.image || "https://via.placeholder.com/80";
  };

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

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-orange-700">
          Order #{order.orderId}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleReorder}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            Reorder
          </button>
          <button
            onClick={exportPDF}
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
          >
            Export PDF
          </button>
        </div>
      </div>

      <p className="mb-2 text-gray-600">Date: {order.date}</p>
      <p className="mb-2 text-gray-600">Status: {order.status}</p>
      <p className="mb-6 text-gray-700 font-semibold">
        Total Amount: ₹{order.totalAmount}
      </p>

      {/* Printable Content */}
      <div id="invoice-content" className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-medium mb-2">Items:</h3>
        <ul className="space-y-4">
          {order.items.map((item, idx) => {
            const product = products.find((p) => p.name === item.name);
            return (
              <li
                key={idx}
                className="flex justify-between items-center border-b pb-3"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={getProductImage(item.name)}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <Link
                    to="/vendor/browse"
                    className="text-blue-600 hover:underline"
                  >
                    {item.name}
                  </Link>
                </div>
                <div className="text-gray-700">
                  {item.quantity} × ₹{item.unitPrice} = ₹
                  {item.quantity * item.unitPrice}
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
