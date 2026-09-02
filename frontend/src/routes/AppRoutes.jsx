import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import UserDashboard from "../pages/user/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Citizen/User routes */}
      <Route element={<UserLayout />}>
        <Route path="/dashboard" element={<UserDashboard />} />
      </Route>

      {/* Admin/Staff routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;