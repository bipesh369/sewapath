import { NavLink } from "react-router-dom";

function SidebarNavItem({ to, icon: Icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition",
          isActive
            ? "bg-white/15 text-white"
            : "text-white/65 hover:bg-white/10 hover:text-white",
        ].join(" ")
      }
    >
      <Icon size={17} strokeWidth={2} />

      <span>{children}</span>
    </NavLink>
  );
}

export default SidebarNavItem;