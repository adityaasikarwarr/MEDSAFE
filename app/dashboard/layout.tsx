"use client";

import { PatientProvider, usePatients } from "@/context/PatientContext";
import { useState } from "react";
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
  Menu,
} from "lucide-react";

/* 🔥 OUTER PROVIDER WRAPPER */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PatientProvider>
      <LayoutContent>{children}</LayoutContent>
    </PatientProvider>
  );
}

/* 🔥 INNER COMPONENT (Now can use context safely) */
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { patients } = usePatients();

  const alertCount = patients.filter((p) => p.risk === "Critical").length;

  return (
    <div className="flex h-screen bg-[#F4F7FB] overflow-hidden">
      {/* SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 256 }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        className="relative bg-[#111827] text-white flex flex-col justify-between select-none flex-shrink-0"
      >
        {/* Top Section */}
        <div>
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            {!collapsed && (
              <div>
                <h1 className="text-lg font-semibold tracking-wide">
                  MedSafe AI
                </h1>
                <p className="text-xs text-gray-400">Clinical Safety</p>
              </div>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <Menu size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-2">
            <SidebarItem
              href="/dashboard"
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              active={pathname === "/dashboard"}
              collapsed={collapsed}
            />

            <SidebarItem
              href="/dashboard/patients"
              icon={<Users size={18} />}
              label="Patients"
              active={pathname.startsWith("/dashboard/patients")}
              collapsed={collapsed}
            />

            <SidebarItem
              href="/dashboard/medication"
              icon={<Pill size={18} />}
              label="Medication Safety"
              active={pathname.startsWith("/dashboard/medication")}
              collapsed={collapsed}
            />

            <SidebarItem
              href="/dashboard/alerts"
              icon={<Bell size={18} />}
              label="Alerts"
              badge={alertCount > 0 ? String(alertCount) : undefined}
              active={pathname.startsWith("/dashboard/alerts")}
              collapsed={collapsed}
            />

            <SidebarItem
              href="/dashboard/icu"
              icon={<Activity size={18} />}
              label="ICU Monitor"
              active={pathname.startsWith("/dashboard/icu")}
              collapsed={collapsed}
            />

            <SidebarItem
              href="/dashboard/analytics"
              icon={<BarChart3 size={18} />}
              label="Analytics"
              active={pathname.startsWith("/dashboard/analytics")}
              collapsed={collapsed}
            />

            <SidebarItem
              href="/dashboard/settings"
              icon={<Settings size={18} />}
              label="Settings"
              active={pathname.startsWith("/dashboard/settings")}
              collapsed={collapsed}
            />
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/10">
          {!collapsed && (
            <>
              <p className="font-semibold text-gray-200">Dr. Smith</p>
              <p className="text-sm text-gray-400 mb-4">Doctor</p>
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
          >
            <LogOut size={16} />
            {!collapsed && "Sign Out"}
          </motion.button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 overflow-y-auto p-8">{children}</main>
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
  collapsed,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
  collapsed?: boolean;
}) {
  return (
    <Link href={href} className="relative block">
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`relative flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        } px-4 py-3 rounded-xl cursor-pointer ${
          active ? "text-white" : "text-gray-300 hover:text-white"
        }`}
      >
        {active && (
          <motion.div
            layoutId="activeBackground"
            className="absolute inset-0 bg-blue-600 rounded-xl shadow-lg"
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          />
        )}

        <div className="relative flex items-center gap-3 z-10">
          {icon}
          {!collapsed && (
            <span className="text-sm font-medium tracking-wide">{label}</span>
          )}
        </div>

        {!collapsed && badge && (
          <span className="relative z-10 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </motion.div>
    </Link>
  );
}
