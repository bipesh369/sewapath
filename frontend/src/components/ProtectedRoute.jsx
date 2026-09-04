import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // TODO: Replace this with your real user/admin role logic
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Used as <ProtectedRoute>...</ProtectedRoute>
  if (children) {
    return children;
  }

  // Used as a route wrapper with nested <Route>
  return <Outlet />;
}

export default ProtectedRoute;