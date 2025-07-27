import React, { useState, useContext } from "react";
import { Menu } from "lucide-react";
import { AuthContext } from "../../context/AppContext";

import ProductManager from "./ProductManager";
import ProductList from "./ProductList";
import OrderManager from "./OrderManager";
import DeliveryUpdater from "./DeliveryUpdater";
import ReviewManager from "./ReviewManager";

const SupplierDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  const tabButton = (key, label) => (
    <button
      onClick={() => setActiveTab(key)}
      className={`px-4 py-2 rounded-t-lg font-medium ${
        activeTab === key
          ? "bg-orange-500 text-white"
          : "bg-orange-100 text-orange-800 hover:bg-orange-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-orange-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden absolute top-4 left-4 z-20 text-orange-600"
      >
        <Menu size={28} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-10 inset-y-0 left-0 w-64 bg-white border-r shadow-sm p-6 space-y-6 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h2 className="text-2xl font-bold text-orange-600 mb-8">RasoiSathi</h2>

        <nav className="flex flex-col space-y-4 text-md font-medium">
          <button
            onClick={() => setActiveTab("products")}
            className={
              activeTab === "products"
                ? "text-orange-600 font-semibold"
                : "text-gray-700 hover:text-orange-500 transition"
            }
          >
            📦 Manage Products
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={
              activeTab === "orders"
                ? "text-orange-600 font-semibold"
                : "text-gray-700 hover:text-orange-500 transition"
            }
          >
            🧾 Incoming Orders
          </button>
          <button
            onClick={() => setActiveTab("delivery")}
            className={
              activeTab === "delivery"
                ? "text-orange-600 font-semibold"
                : "text-gray-700 hover:text-orange-500 transition"
            }
          >
            🚚 Delivery Status
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={
              activeTab === "reviews"
                ? "text-orange-600 font-semibold"
                : "text-gray-700 hover:text-orange-500 transition"
            }
          >
            💬 Customer Reviews
          </button>
          <button
            onClick={logout}
            className="text-red-500 hover:text-red-600 text-left mt-4"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">
            Welcome, {user?.name || user?.email || "Supplier"}!
          </h1>
        </header>

        <main className="flex-1 px-6 py-8">
          <div className="flex space-x-2 border-b mb-6">
            {tabButton("products", "Manage Products")}
            {tabButton("orders", "Incoming Orders")}
            {tabButton("delivery", "Update Delivery")}
            {tabButton("reviews", "Customer Reviews")}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            {activeTab === "products" && (
              <>
                <ProductList />
                <ProductManager />
              </>
            )}
            {activeTab === "orders" && <OrderManager />}
            {activeTab === "delivery" && <DeliveryUpdater />}
            {activeTab === "reviews" && <ReviewManager />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupplierDashboard;
