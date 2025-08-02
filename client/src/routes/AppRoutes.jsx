import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import VendorDashboard from "../pages/vendor/Dashboard";
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
import SupplierDashboard from "../pages/supplier/SupplierDashboard";
import ReviewManager from "../pages/supplier/ReviewManager";
import OrderManager from "../pages/supplier/OrderManager";
import ProductManager from "../pages/supplier/ProductManager";
import ProductList from "../pages/supplier/ProductList";
import Pending from "../pages/auth/Pending";
import Rejected from "../pages/auth/Rejected";
import VendorDashboardHome from "../pages/vendor/VendorDashboardHome";
import SupplierDashboardLayout from "../pages/supplier/SupplierLayout";
import OrderDetail from "../pages/supplier/OrderDetail";
import SupplierProfile from "../pages/supplier/SupplierProfile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* Remove or update the following if not needed */}
      {/* <Route path="/select-role" element={<RoleSelect />} /> */}
      <Route path="/pending" element={<Pending />} />
      <Route path="/rejected" element={<Rejected />} />
      {/* Vendor Dashboard with nested routes */}
      {/* Vendor Dashboard with nested routes */}
      <Route
        path="/vendor"
        element={
          <ProtectedRoute allowedRoles={["vendor"]}>
            <VendorDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<VendorDashboardHome />} />
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
          <ProtectedRoute allowedRoles={["supplier"]}>
            <SupplierDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<SupplierDashboard />} />
        <Route path="products" element={<ProductManager />} />
        <Route path="products-display" element={<ProductList />} />
        <Route path="orders" element={<OrderManager />} />
        <Route path="profile" element={<SupplierProfile />} />
        <Route path="orders/:orderId" element={<OrderDetail />} />
        <Route path="reviews" element={<ReviewManager />} />
      </Route>
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
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
