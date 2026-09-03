import { Outlet } from "react-router-dom";

import UserSidebar from "../components/layout/UserSidebar";

function UserLayout() {
  return (
    <div className="min-h-screen bg-var(--color-background)">
      <UserSidebar />

      <main className="min-h-screen lg:pl-250px">
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;