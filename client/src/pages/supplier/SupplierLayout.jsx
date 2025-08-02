import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Star,
  Package,
  User,
} from "lucide-react";
import { AuthContext } from "../../context/AppContext";

const SupplierLayout = () => {
  const { user } = useContext(AuthContext);

  const navItems = [
    {
      path: "/supplier/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/supplier/products",
      label: "Manage Products",
      icon: Package,
    },
    {
      path: "/supplier/products-display",
      label: "Product List",
      icon: ClipboardList,
    },
    {
      path: "/supplier/orders",
      label: "Order Manager",
      icon: ClipboardList,
    },
    {
      path: "/supplier/reviews",
      label: "Review Manager",
      icon: Star,
    },
    {
      path: "/supplier/profile",
      label: "Profile settings",
      icon: User,
    },
  ];

  return (
    <div className="flex bg-orange-50 min-h-screen">
      {/* Sidebar */}
      <aside className="w-16 md:w-64 bg-white border-r shadow-sm flex flex-col py-6 sticky top-0 min-h-screen z-10">
        <div className="flex flex-col gap-2 px-2 mt-2">
          {navItems.map(({ path, label, icon: Icon }, index) => (
            <NavLink
              key={index}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-orange-500"
                }`
              }
            >
              <Icon className="h-5 w-5 md:h-6 md:w-6" />
              <span className="hidden md:inline">{label}</span>
            </NavLink>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow-sm px-6 py-4 border-b sticky top-0 z-10">
          <h1 className="text-lg md:text-xl font-semibold text-gray-800">
            Welcome, {user?.name || user?.email || "Supplier"}!
          </h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 md:px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SupplierLayout;
