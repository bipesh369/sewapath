import {
  ClipboardList,
  BriefcaseBusiness,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import Logo from "../common/Logo";
import SidebarNavItem from "./SidebarNavItem";

function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] flex-col bg-[var(--color-sidebar)] lg:flex">
      <div className="px-6 py-7">
        <Logo showStaffLabel />
      </div>

      <nav className="flex-1 px-4">
        <div className="space-y-1">
          <SidebarNavItem
            to="/admin"
            icon={ClipboardList}
          >
            Applications
          </SidebarNavItem>

          <SidebarNavItem
            to="/admin/services"
            icon={BriefcaseBusiness}
          >
            Services
          </SidebarNavItem>

          <SidebarNavItem
            to="/admin/citizens"
            icon={Users}
          >
            Citizens
          </SidebarNavItem>

          <SidebarNavItem
            to="/admin/reports"
            icon={BarChart3}
          >
            Reports
          </SidebarNavItem>

          <SidebarNavItem
            to="/admin/settings"
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

export default AdminSidebar;