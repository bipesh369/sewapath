import {
  LayoutDashboard,
  Search,
  Target,
  FileText,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";

import Logo from "../common/Logo";
import SidebarNavItem from "./SidebarNavItem";

function UserSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] flex-col bg-[var(--color-sidebar)] lg:flex">
      <div className="px-6 py-7">
        <Logo />
      </div>

      <nav className="flex-1 px-4">
        <div className="space-y-1">
          <SidebarNavItem
            to="/dashboard"
            icon={LayoutDashboard}
          >
            My dashboard
          </SidebarNavItem>

          <SidebarNavItem
            to="/services"
            icon={Search}
          >
            Find a service
          </SidebarNavItem>

          <SidebarNavItem
            to="/goals"
            icon={Target}
          >
            My goals
          </SidebarNavItem>

          <SidebarNavItem
            to="/documents"
            icon={FileText}
          >
            Documents
          </SidebarNavItem>

          <SidebarNavItem
            to="/notifications"
            icon={MessageCircle}
          >
            Messages
          </SidebarNavItem>

          <SidebarNavItem
            to="/settings"
            icon={Settings}
          >
            Settings
          </SidebarNavItem>
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-white/65 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut size={17} />

          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}

export default UserSidebar;