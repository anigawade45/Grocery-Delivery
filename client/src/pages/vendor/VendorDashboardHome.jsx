import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ShoppingCart, IndianRupee, BarChart3 } from "lucide-react";

const VendorDashboardHome = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
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

        const total = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        setTotalExpenses(total);

        // Monthly breakdown
        const monthly = Array(12)
          .fill(0)
          .map((_, idx) => ({
            month: new Date(0, idx).toLocaleString("default", {
              month: "short",
            }),
            expenses: 0,
            orders: 0,
          }));

        orders.forEach((order) => {
          const date = new Date(order.createdAt);
          const monthIndex = date.getMonth();
          monthly[monthIndex].expenses += order.totalAmount;
          monthly[monthIndex].orders += 1;
        });

        setMonthlyData(monthly);
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
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-semibold text-orange-700 mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <ShoppingCart className="w-10 h-10 text-orange-600 mb-2" />
          <p className="text-gray-500">Total Orders</p>
          <p className="text-4xl font-bold text-orange-600">{totalOrders}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <IndianRupee className="w-10 h-10 text-orange-600 mb-2" />
          <p className="text-gray-500">Total Expenses</p>
          <p className="text-4xl font-bold text-orange-600">₹{totalExpenses}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <BarChart3 className="w-10 h-10 text-orange-600 mb-2" />
          <p className="text-gray-500">Monthly Summary</p>
          <p className="text-lg font-semibold text-gray-700">This Year</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-orange-700 mb-4">
          Monthly Expenses & Orders
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={monthlyData}
            margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="expenses" fill="#f97316" name="Expenses (₹)" />
            <Bar dataKey="orders" fill="#6366f1" name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VendorDashboardHome;
