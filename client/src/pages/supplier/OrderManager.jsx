import React, { useState } from "react";

const sampleOrders = [
{
id: "ORD001",
customer: "Ramesh S.",
product: "Tomatoes",
quantity: "20 kg",
status: "Pending",
},
{
id: "ORD002",
customer: "Seema K.",
product: "Paneer",
quantity: "10 kg",
status: "Processing",
},
{
id: "ORD003",
customer: "Kailash B.",
product: "Yoghurt",
quantity: "5 kg",
status: "Delivered",
},
];

const OrderManager = () => {
const [orders, setOrders] = useState(sampleOrders);

const handleStatusChange = (orderId, newStatus) => {
const updatedOrders = orders.map((order) =>
order.id === orderId ? { ...order, status: newStatus } : order
);
setOrders(updatedOrders);
};

return (
<div className="p-6 bg-white rounded-xl shadow-lg">
<h2 className="text-2xl font-bold text-orange-700 mb-4">Incoming Orders</h2>
{orders.length === 0 ? (
<p className="text-gray-500">No orders available.</p>
) : (
<div className="space-y-4">
{orders.map((order) => (
<div key={order.id} className="border border-orange-200 rounded-lg p-4 flex justify-between items-center hover:shadow transition" >
<div>
<p className="font-semibold text-gray-800">
#{order.id} — {order.product}
</p>
<p className="text-sm text-gray-600">
Customer: {order.customer} | Qty: {order.quantity}
</p>
</div>
<div className="flex gap-2 items-center">
<span className="text-sm text-orange-600">{order.status}</span>
<select
className="border rounded px-2 py-1 text-sm"
value={order.status}
onChange={(e) => handleStatusChange(order.id, e.target.value)}
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