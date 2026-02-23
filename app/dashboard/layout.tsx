import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Pill,
  Bell,
  Activity,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F3F5F9]">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1E2A38] text-white flex flex-col justify-between">

        {/* Top Section */}
        <div>
          <div className="p-6 border-b border-white/10">
            <h1 className="text-xl font-semibold">MedSafe AI</h1>
            <p className="text-sm text-gray-400">Clinical Safety</p>
          </div>

          <nav className="p-4 space-y-2">
            <SidebarItem href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" active />
            <SidebarItem href="/dashboard/patients" icon={<Users size={18} />} label="Patients" />
            <SidebarItem href="/dashboard/medication" icon={<Pill size={18} />} label="Medication Safety" />
            <SidebarItem href="/dashboard/alerts" icon={<Bell size={18} />} label="Alerts" badge="448" />
            <SidebarItem href="/dashboard/icu" icon={<Activity size={18} />} label="ICU Monitor" />
            <SidebarItem href="/dashboard/analytics" icon={<BarChart3 size={18} />} label="Analytics" />
            <SidebarItem href="/dashboard/settings" icon={<Settings size={18} />} label="Settings" />
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-6 border-t border-white/10">
          <p className="font-semibold">Dr. Smith</p>
          <p className="text-sm text-gray-400 mb-4">Doctor</p>
          <button className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function SidebarItem({
  href,
  icon,
  label,
  active,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-4 py-3 rounded-lg transition ${
        active
          ? "bg-blue-600 text-white"
          : "text-gray-300 hover:bg-white/10"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {badge && (
        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}