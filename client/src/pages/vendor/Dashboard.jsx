import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";


const VendorDashboard = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default VendorDashboard;
