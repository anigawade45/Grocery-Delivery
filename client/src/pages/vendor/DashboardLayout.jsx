import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Menu } from "lucide-react";

const DashboardLayout = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-orange-600 font-semibold"
      : "text-gray-700 hover:text-orange-500 transition";

  return (
    <div className="flex min-h-screen bg-orange-50">
      {/* Mobile Sidebar Toggle */}
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
          <NavLink to="/vendor/browse" className={navLinkClass}>
            🍲 Browse Products
          </NavLink>
          <NavLink to="/vendor/cart" className={navLinkClass}>
            🛒 My Cart
          </NavLink>
          <NavLink to="/vendor/orders" className={navLinkClass}>
            📦 Order History
          </NavLink>
          <NavLink to="/vendor/profile" className={navLinkClass}>
            ⚙️ Profile
          </NavLink>
          <button
            onClick={() => signOut()}
            className="text-red-500 hover:text-red-600 text-left"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">
            Welcome,{" "}
            {user?.firstName ||
              user?.emailAddresses[0]?.emailAddress ||
              "Vendor"}
            !
          </h1>
          {/* Optional: logout or profile picture */}
        </header>

        {/* Page Content */}
        <main className="flex-1 px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
