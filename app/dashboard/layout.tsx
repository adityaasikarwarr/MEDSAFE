"use client";

import { useAuth } from "@/context/AuthContext";
import { usePatients } from "@/context/PatientContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Home,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const { alerts } = usePatients();
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const activeAlerts = alerts?.filter((a) => !a.resolved) || [];

  /* 🔐 Route Protection */
  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  /* Close Notification Dropdown */
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#F4F7FB] overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        className="bg-[#0F172A] text-white flex flex-col justify-between"
      >
        {/* Top Section */}
        <div>
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            {!collapsed && (
              <Link href="/" className="block">
                <h1 className="text-lg font-semibold">MedSafe AI</h1>
                <p className="text-xs text-gray-400">Clinical Platform</p>
              </Link>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-white/10"
            >
              <Menu size={18} />
            </button>
          </div>

          <nav className="p-3 space-y-2">
            {/* Home */}
            <SidebarItem
              href="/"
              icon={<Home size={18} />}
              label="Home"
              active={pathname === "/"}
              collapsed={collapsed}
            />

            {/* Dashboard */}
            <SidebarItem
              href="/dashboard"
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              active={pathname === "/dashboard"}
              collapsed={collapsed}
            />

            {/* Patients */}
            <SidebarItem
              href="/dashboard/patients"
              icon={<Users size={18} />}
              label="Patients"
              active={pathname.startsWith("/dashboard/patients")}
              collapsed={collapsed}
            />

            {/* Medication */}
            <SidebarItem
              href="/dashboard/medication"
              icon={<Pill size={18} />}
              label="Medication Safety"
              active={pathname.startsWith("/dashboard/medication")}
              collapsed={collapsed}
            />

            {/* Alerts */}
            <SidebarItem
              href="/dashboard/alerts"
              icon={<Bell size={18} />}
              label="Alerts"
              badge={
                activeAlerts.length > 0
                  ? String(activeAlerts.length)
                  : undefined
              }
              active={pathname.startsWith("/dashboard/alerts")}
              collapsed={collapsed}
            />

            {/* ICU */}
            <SidebarItem
              href="/dashboard/icu"
              icon={<Activity size={18} />}
              label="ICU Monitor"
              active={pathname.startsWith("/dashboard/icu")}
              collapsed={collapsed}
            />

            {/* Analytics */}
            <SidebarItem
              href="/dashboard/analytics"
              icon={<BarChart3 size={18} />}
              label="Analytics"
              active={pathname.startsWith("/dashboard/analytics")}
              collapsed={collapsed}
            />

            {/* Settings */}
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
              <p className="font-semibold text-gray-200">{user.name}</p>
              <p className="mb-4 text-sm text-gray-400">{user.role}</p>
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              logout();
              router.replace("/");
            }}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
          >
            <LogOut size={16} />
            {!collapsed && "Logout"}
          </motion.button>
        </div>
      </motion.aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="relative flex-1 p-8 overflow-y-auto">
        {/* Notifications */}
        <div className="fixed z-50 top-6 right-8" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 bg-white shadow rounded-2xl hover:shadow-md"
          >
            <Bell size={20} className="text-gray-700" />

            {activeAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white px-2 py-0.5 rounded-full animate-pulse">
                {activeAlerts.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 overflow-hidden bg-white border shadow-xl w-96 rounded-2xl"
              >
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="font-semibold text-gray-800">Active Alerts</h3>
                </div>

                <div className="overflow-y-auto max-h-72">
                  {activeAlerts.length > 0 ? (
                    activeAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="px-4 py-3 border-b hover:bg-gray-50"
                      >
                        <p className="text-sm font-medium text-gray-800">
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {alert.severity}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-sm text-center text-gray-500">
                      No active alerts
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {children}
      </main>
    </div>
  );
}

/* ================= SIDEBAR ITEM ================= */
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
    <Link href={href} className="block">
      <motion.div
        whileHover={{ scale: 1.03 }}
        className={`flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        } px-4 py-3 rounded-xl cursor-pointer ${
          active ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-white/10"
        }`}
      >
        <div className="flex items-center gap-3">
          {icon}
          {!collapsed && <span className="text-sm font-medium">{label}</span>}
        </div>

        {!collapsed && badge && (
          <span className="px-2 py-1 text-xs text-white bg-red-500 rounded-full">
            {badge}
          </span>
        )}
      </motion.div>
    </Link>
  );
}
