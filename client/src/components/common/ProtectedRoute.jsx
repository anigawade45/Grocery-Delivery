import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AppContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // // Not logged in
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace state={{ from: location }} />;
  // }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Special case for supplier status
  if (user.role === "supplier") {
    if (user.status === "pending") {
      return <Navigate to="/pending" replace />;
    }
    if (user.status === "rejected") {
      return <Navigate to="/rejected" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
