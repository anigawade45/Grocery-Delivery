import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  ShoppingCart,
  LayoutDashboard,
  ShoppingBasket,
  Package,
  User,
} from "lucide-react";
import { AuthContext } from "../../context/AppContext";

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);

  const navItems = [
    { to: "/vendor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/vendor/browse", icon: ShoppingBasket, label: "Browse Products" },
    { to: "/vendor/cart", icon: ShoppingCart, label: "My Cart" },
    { to: "/vendor/orders", icon: Package, label: "Order History" },
    { to: "/vendor/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="flex bg-orange-50 min-h-screen">
      {/* Sidebar */}
      <aside className="w-16 md:w-64 bg-white border-r shadow-md flex flex-col justify-between py-6 min-h-screen sticky top-0">
        <nav className="flex flex-col gap-2 px-2 mt-4">
          {navItems.map(({ to, icon: Icon, label }, index) => (
            <NavLink
              key={index}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-orange-500"
                }`
              }
            >
              <Icon className="h-5 w-5 md:h-6 md:w-6 transition-all duration-200" />
              <span className="hidden md:inline">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0">
        {/* Topbar */}
        <header className="bg-white shadow px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-800">
            Welcome, {user?.name || user?.email || "Vendor"}!
          </h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 md:px-6 py-8 bg-orange-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
