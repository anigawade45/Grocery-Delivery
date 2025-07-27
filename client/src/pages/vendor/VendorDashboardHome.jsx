import React, { useEffect, useState } from "react";
import axios from "axios";

const VendorDashboardHome = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/api/vendor/orders",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const orders = res.data.orders || [];
        setTotalOrders(orders.length);
        const revenue = orders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );
        setTotalRevenue(revenue);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-semibold text-orange-700 mb-6">
          Dashboard
        </h2>
        <p>Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-semibold text-orange-700 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Total Orders</p>
          <p className="text-4xl font-bold text-orange-600">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Total Revenue (₹)</p>
          <p className="text-4xl font-bold text-orange-600">₹{totalRevenue}</p>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboardHome;
