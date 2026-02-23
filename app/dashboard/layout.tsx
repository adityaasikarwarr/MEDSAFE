"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#F4F7FB] overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#111827] text-white flex flex-col justify-between select-none">
        {/* Logo Section */}
        <div>
          <div className="p-6 border-b border-white/10">
            <h1 className="text-xl font-semibold tracking-wide">MedSafe AI</h1>
            <p className="text-sm text-gray-400">Clinical Safety</p>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            <SidebarItem
              href="/dashboard"
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              active={pathname === "/dashboard"}
            />

            <SidebarItem
              href="/dashboard/patients"
              icon={<Users size={18} />}
              label="Patients"
              active={pathname.startsWith("/dashboard/patients")}
            />

            <SidebarItem
              href="/dashboard/medication"
              icon={<Pill size={18} />}
              label="Medication Safety"
              active={pathname.startsWith("/dashboard/medication")}
            />

            <SidebarItem
              href="/dashboard/alerts"
              icon={<Bell size={18} />}
              label="Alerts"
              badge="8"
              active={pathname.startsWith("/dashboard/alerts")}
            />

            <SidebarItem
              href="/dashboard/icu"
              icon={<Activity size={18} />}
              label="ICU Monitor"
              active={pathname.startsWith("/dashboard/icu")}
            />

            <SidebarItem
              href="/dashboard/analytics"
              icon={<BarChart3 size={18} />}
              label="Analytics"
              active={pathname.startsWith("/dashboard/analytics")}
            />

            <SidebarItem
              href="/dashboard/settings"
              icon={<Settings size={18} />}
              label="Settings"
              active={pathname.startsWith("/dashboard/settings")}
            />
          </nav>
        </div>

        {/* Bottom Profile Section */}
        <div className="p-6 border-t border-white/10">
          <p className="font-semibold text-gray-200">Dr. Smith</p>
          <p className="text-sm text-gray-400 mb-4">Doctor</p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
          >
            <LogOut size={16} />
            Sign Out
          </motion.button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}

/* Sidebar Item Component */
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
    <Link href={href} className="relative block">
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`relative flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer ${
          active ? "text-white" : "text-gray-300 hover:text-white"
        }`}
      >
        {/* Sliding Active Background */}
        {active && (
          <motion.div
            layoutId="activeBackground"
            className="absolute inset-0 bg-blue-600 rounded-xl shadow-lg"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        {/* Content */}
        <div className="relative flex items-center gap-3 z-10">
          {icon}
          <span className="text-sm font-medium tracking-wide">{label}</span>
        </div>

        {badge && (
          <span className="relative z-10 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </motion.div>
    </Link>
  );
}
