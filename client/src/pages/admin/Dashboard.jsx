// pages/vendor/VendorDashboard.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminDashboardLayout from "./DashboardLayout";

const AdminDashboard = () => {
  return (
    <AdminDashboardLayout>
      <Outlet />
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
