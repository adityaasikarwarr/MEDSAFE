"use client";

import { PatientProvider, usePatients } from "@/context/PatientContext";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

/* =========================
   OUTER PROVIDER WRAPPER
========================= */
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

/* =========================
   INNER LAYOUT
========================= */
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { patients } = usePatients();

  /* 🔥 Dynamic Alert Generation */
  const activeAlerts = patients
    .filter((p: any) => p.risk === "Critical")
    .map((p: any) => ({
      id: p.id,
      message: `${p.name} is in critical condition (${p.department})`,
      severity: p.status === "Admitted" ? "High" : "Medium",
    }));

  /* Close dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-[#F4F7FB] overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 256 }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        className="bg-[#0F172A] text-white flex flex-col justify-between flex-shrink-0"
      >
        {/* Top Section */}
        <div>
          <div
            className={`p-4 border-b border-white/10 flex ${
              collapsed
                ? "flex-col items-center gap-3"
                : "items-center justify-between"
            }`}
          >
            {!collapsed && (
              <div>
                <h1 className="text-lg font-semibold">MedSafe AI</h1>
                <p className="text-xs text-gray-400">
                  Clinical Safety Platform
                </p>
              </div>
            )}

            {/* Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-xl hover:bg-white/10 transition"
            >
              <Menu size={18} className="text-gray-300" />
            </motion.button>
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
              badge={
                activeAlerts.length > 0
                  ? String(activeAlerts.length)
                  : undefined
              }
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
              <p className="text-sm text-gray-400 mb-4">Senior Physician</p>
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

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b flex items-center justify-end px-6 relative">
          {/* Notification */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition"
            >
              <Bell size={20} className="text-gray-600" />

              {activeAlerts.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-xs text-white px-1.5 py-0.5 rounded-full shadow-lg"
                >
                  {activeAlerts.length}
                </motion.span>
              )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
                >
                  <div className="px-5 py-4 border-b bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {activeAlerts.length > 0 ? (
                      activeAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="px-5 py-4 border-b hover:bg-gray-50 transition"
                        >
                          <p className="text-sm font-medium text-gray-800">
                            {alert.message}
                          </p>
                          <span
                            className={`text-xs font-semibold ${
                              alert.severity === "High"
                                ? "text-red-600"
                                : "text-yellow-500"
                            }`}
                          >
                            {alert.severity} Priority
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-500 text-sm">
                        No active alerts
                      </div>
                    )}
                  </div>

                  <div className="p-4 text-center bg-gray-50">
                    <Link
                      href="/dashboard/alerts"
                      onClick={() => setShowNotifications(false)}
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      View All Alerts
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}

/* =========================
   SIDEBAR ITEM COMPONENT
========================= */
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
          />
        )}

        <div className="relative flex items-center gap-3 z-10">
          {icon}
          {!collapsed && <span className="text-sm font-medium">{label}</span>}
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
