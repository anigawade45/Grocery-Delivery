import React from "react";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu } from "lucide-react"; // install via `npm install lucide-react`
import Logo from "../../assets/logo.jpg"; // Your custom logo
import { useState } from "react";

const Navbar = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <button
            onClick={() => navigate("/suppliers")}
            className="hover:text-orange-700"
          >
            Browse Suppliers
          </button>
          <button
            onClick={() => navigate("/categories")}
            className="hover:text-orange-700"
          >
            Categories
          </button>
          <button
            onClick={() => navigate("/how-it-works")}
            className="hover:text-orange-700"
          >
            How It Works
          </button>
          <button
            onClick={() => navigate("/support")}
            className="hover:text-orange-700"
          >
            Support
          </button>
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="relative">
            <Bell className="h-5 w-5 text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              3
            </span>
          </button>

          <SignedOut>
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
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-2 px-4 pb-4">
          <button
            onClick={() => navigate("/suppliers")}
            className="block w-full text-left py-1 text-gray-700 hover:text-orange-700"
          >
            Browse Suppliers
          </button>
          <button
            onClick={() => navigate("/categories")}
            className="block w-full text-left py-1 text-gray-700 hover:text-orange-700"
          >
            Categories
          </button>
          <button
            onClick={() => navigate("/how-it-works")}
            className="block w-full text-left py-1 text-gray-700 hover:text-orange-700"
          >
            How It Works
          </button>
          <button
            onClick={() => navigate("/support")}
            className="block w-full text-left py-1 text-gray-700 hover:text-orange-700"
          >
            Support
          </button>

          <div className="mt-4 flex flex-col space-y-2">
            <SignedOut>
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
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
