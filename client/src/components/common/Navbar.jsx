import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import Logo from "../../assets/logo.jpg";
import { AuthContext } from "../../context/AppContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  const isSupplier = user?.role === "supplier";
  const isVendor = user?.role === "vendor";

  const commonLinks = [
    
    { path: "/how-it-works", label: "How It Works" },
    { path: "/support", label: "Support" },
  ];

  const roleLinks = isAdmin
    ? [{ path: "/admin", label: "Admin Dashboard" }]
    : isSupplier
    ? [{ path: "/supplier", label: "Supplier Panel" }]
    : isVendor
    ? [{ path: "/vendor", label: "Vendor Panel" }]
    : [];

  const notifications = isAdmin ? 5 : isSupplier ? 3 : isVendor ? 1 : 0;

  const renderLinks = (links, isMobile = false) =>
    links.map((link) => (
      <button
        key={link.path}
        onClick={() => {
          navigate(link.path);
          setIsMenuOpen(false);
        }}
        className={`${
          isMobile ? "block w-full text-left py-1" : "hover:text-orange-700"
        } text-gray-700`}
      >
        {link.label}
      </button>
    ));

  return (
    <header className="w-full border-b bg-white px-6 py-3 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo + Title */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={Logo} alt="Logo" className="h-12 w-12" />
          <div>
            <p className="text-lg font-bold text-orange-600">VendorVerse</p>
            <p className="text-sm text-gray-500 -mt-1">Fresh Supply Network</p>
          </div>
        </div>

        {/* Hamburger for mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6 text-orange-600" />
          </button>
        </div>

        {/* Center Nav Items */}
        <nav className="hidden md:flex items-center space-x-6 text-sm text-gray-700">
          {renderLinks([...roleLinks, ...commonLinks])}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {user && (
            <button className="relative">
              <Bell className="h-5 w-5 text-gray-700" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {notifications}
                </span>
              )}
            </button>
          )}

          {!user ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-3 py-1 border border-orange-500 rounded text-orange-600 hover:bg-orange-50 text-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-700">
                {user.name || user.email || "Welcome"}
              </p>
              <button
                onClick={logout}
                className="px-3 py-1 border border-red-500 rounded text-red-600 hover:bg-red-50 text-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-2 px-4 pb-4">
          {renderLinks([...roleLinks, ...commonLinks], true)}

          {user && (
            <div className="flex items-center gap-2 mt-3">
              <Bell className="h-5 w-5 text-gray-700" />
              {notifications > 0 && (
                <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {notifications} new
                </span>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-col space-y-2">
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full px-3 py-2 border border-orange-500 rounded text-orange-600 hover:bg-orange-50 text-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="w-full px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
                >
                  Get Started
                </button>
              </>
            ) : (
              <button
                onClick={logout}
                className="w-full px-3 py-2 border border-red-500 rounded text-red-600 hover:bg-red-50 text-sm"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
