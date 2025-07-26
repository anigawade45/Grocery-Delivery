import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import RoleSelect from "../pages/auth/RoleSelect";
import VendorDashboard from "../pages/vendor/Dashboard";
import SupplierDashboard from "../pages/supplier/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";
import ProtectedRoute from "../components/common/ProtectedRoute";
import BrowseProducts from "../pages/vendor/BrowseProducts";
import Cart from "../pages/vendor/Cart";
import OrderHistory from "../pages/vendor/OrderHistory";
import ProfileSettings from "../pages/vendor/ProfileSettings";
import OrderDetails from "../pages/vendor/OrderDetails";
import ProductDetails from "../pages/vendor/ProductDetails";
import SupplierVerification from "../pages/admin/SupplierVerificationPage";
import ReportedReviews from "../pages/admin/ReportedReviews";
import UserManagement from "../pages/admin/UserManagement";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/select-role" element={<RoleSelect />} />

      {/* Vendor Dashboard with nested routes */}
      <Route
        path="/vendor"
        element={
          <ProtectedRoute>
            <VendorDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="browse" element={<BrowseProducts />} />
        <Route path="cart" element={<Cart />} />
        <Route path="orders" element={<OrderHistory />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="orders/:orderId" element={<OrderDetails />} />
        <Route path="product/:productId" element={<ProductDetails />} />
      </Route>

      {/* Supplier and Admin Dashboards */}
      <Route
        path="/supplier"
        element={
          <ProtectedRoute>
            <SupplierDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="suppliers" element={<SupplierVerification />} />
        <Route path="reviews" element={<ReportedReviews />} />
        <Route path="users" element={<UserManagement />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
