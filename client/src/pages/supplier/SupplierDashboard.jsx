import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Package, ShoppingCart, IndianRupee } from "lucide-react";

const SupplierDashboard = () => {
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyData: [],
  });

  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/supplier/dashboard`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSummary(res.data);
      } catch (err) {
        console.error("Error fetching supplier summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [token]);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        Loading supplier dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-orange-700">
        Supplier Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <Card
          icon={<Package size={32} className="text-orange-500" />}
          title="Total Products"
          value={summary.totalProducts}
        />
        <Card
          icon={<ShoppingCart size={32} className="text-orange-500" />}
          title="Total Orders"
          value={summary.totalOrders}
        />
        <Card
          icon={<IndianRupee size={32} className="text-orange-500" />}
          title="Total Revenue"
          value={`₹${summary.totalRevenue}`}
        />
      </div>

      {/* Monthly Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-orange-700">
          Monthly Orders & Revenue
        </h2>
        {summary.monthlyData?.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summary.monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" name="Revenue (₹)" fill="#f97316" />
              <Bar dataKey="orders" name="Orders" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No monthly data available.</p>
        )}
      </div>
    </div>
  );
};

// Reusable Card component
const Card = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
    <div className="mb-3">{icon}</div>
    <h2 className="text-gray-600 text-sm">{title}</h2>
    <p className="text-2xl font-bold text-orange-700">{value}</p>
  </div>
);

export default SupplierDashboard;
