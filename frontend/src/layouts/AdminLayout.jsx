import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/layout/AdminSidebar";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-var(--color-background)">
      <AdminSidebar />

      <main className="min-h-screen lg:pl-250px">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;