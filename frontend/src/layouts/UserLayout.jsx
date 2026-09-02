import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <div className="min-h-screen bg-var(--color-background)">
      <aside className="fixed inset-y-0 left-0 w-60 bg-var(--color-sidebar)">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white">
            SewaPath
          </h1>
        </div>
      </aside>

      <main className="min-h-screen pl-60">
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;