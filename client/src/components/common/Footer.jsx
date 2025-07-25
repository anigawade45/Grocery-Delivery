import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-orange-50 border-t text-center text-sm text-gray-700 py-6">
      <div className="max-w-6xl mx-auto px-4 space-y-4">
        <p className="text-gray-700">
          RasoiSathi helps street food vendors connect with trusted suppliers
          across India.
        </p>

        <div className="flex justify-center flex-wrap gap-6 text-sm">
          <a href="/" className="hover:text-orange-600 transition-colors">
            Home
          </a>
          <a href="/login" className="hover:text-orange-600 transition-colors">
            Login
          </a>
          <a href="/signup" className="hover:text-orange-600 transition-colors">
            Signup
          </a>
          <a
            href="/select-role"
            className="hover:text-orange-600 transition-colors"
          >
            Select Role
          </a>
          <a
            href="/support"
            className="hover:text-orange-600 transition-colors"
          >
            Support
          </a>
        </div>

        <p className="text-sm text-gray-600">
          Email:{" "}
          <a
            href="mailto:support@rasoisathi.com"
            className="hover:text-orange-600"
          >
            support@rasoisathi.com
          </a>{" "}
          | Phone: +91-9876543210
        </p>
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} RasoiSathi. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
