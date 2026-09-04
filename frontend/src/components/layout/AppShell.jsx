import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Brand from "../Brand";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = {
  user: [
    { to: "/dashboard", icon: "▦", label: "My dashboard" },
    { to: "/services", icon: "🔍", label: "Find a service" },
    { to: "/goals", icon: "🎯", label: "My goals" },
    { to: "/documents", icon: "📄", label: "Documents" },
    { to: "/messages", icon: "💬", label: "Messages" },
    { to: "/settings", icon: "⚙️", label: "Settings" },
  ],
  admin: [
    { to: "/admin", icon: "▦", label: "Applications" },
    { to: "/admin/services", icon: "📋", label: "Services" },
    { to: "/admin/offices", icon: "🏢", label: "Offices" },
  ],
};

/** role: "user" | "admin" — swaps the nav items and the STAFF badge. */
function AppShell({ role = "user" }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const items = NAV_ITEMS[role] ?? NAV_ITEMS.user;

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[224px_1fr]">
      <aside className="hidden flex-col bg-ink px-4 py-6 md:flex">
        <Link to="/">
          <Brand staff={role === "admin"} dark className="mb-8 px-2 text-[17px]" />
        </Link>

        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin" || item.to === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[14px] font-medium no-underline ${
                  isActive
                    ? "bg-white/10 text-paper"
                    : "text-paper/70 hover:bg-white/5 hover:text-paper"
                }`
              }
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {user && (
          <div className="mt-auto border-t border-white/10 pt-4">
            <div className="px-3 text-[13px] font-semibold text-paper">
              {user.name}
            </div>
            <div className="px-3 text-[12px] text-paper/50">{user.email}</div>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="mt-3 rounded-lg px-3 py-2.5 text-left text-[14px] text-paper/60 hover:text-paper"
            >
              ← Log out
            </button>
          </div>
        )}
      </aside>

      <div className="overflow-y-auto px-5 py-6 md:px-10 md:py-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AppShell;
