import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const VendorDashboard = () => {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 px-4 py-6 md:px-10 lg:px-16 transition-all duration-300 ease-in-out">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[50vh] text-gray-500 text-lg">
              Loading dashboard...
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
    </DashboardLayout>
  );
};

export default VendorDashboard;
