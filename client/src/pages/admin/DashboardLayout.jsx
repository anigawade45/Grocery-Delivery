import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Menu, X } from "lucide-react";

const AdminDashboardLayout = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-orange-600 font-semibold"
      : "text-gray-700 hover:text-orange-500 transition";

  const navItems = [
    { to: "/admin/suppliers", icon: "🧾", label: "Supplier Verification" },
    { to: "/admin/reviews", icon: "🚩", label: "Reported Reviews" },
    { to: "/admin/users", icon: "👥", label: "User Management" },
  ];

  return (
    <div className="flex min-h-screen bg-orange-50 relative">
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden absolute top-4 left-4 z-30 text-orange-600"
      >
        <Menu size={28} />
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static z-30 inset-y-0 left-0 w-64 bg-white border-r shadow-sm p-6 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="md:hidden flex justify-end mb-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col space-y-6 text-md font-medium">
          {navItems.map((item) => (
            <NavLink to={item.to} key={item.to} className={navLinkClass}>
              <div className="flex items-center gap-2" title={item.label}>
                <span>{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
              </div>
            </NavLink>
          ))}
          <button
            onClick={() => signOut()}
            className="text-red-500 hover:text-red-600 text-left"
            title="Logout"
          >
            <div className="flex items-center gap-2">
              <span>🚪</span>
              <span className="hidden md:inline">Logout</span>
            </div>
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">
            Admin Panel – Welcome,{" "}
            {user?.firstName ||
              user?.emailAddresses[0]?.emailAddress ||
              "Admin"}
            !
          </h1>
        </header>
        <main className="flex-1 px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
