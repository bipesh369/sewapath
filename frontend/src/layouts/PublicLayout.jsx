import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-var(--color-background)">
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;