"use client";

import { PatientProvider, usePatients } from "@/context/PatientContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  return <LayoutContent>{children}</LayoutContent>;
}

/* =========================
   INNER LAYOUT CONTENT
========================= */
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, logout, isLoading } = useAuth();
  const { alerts } = usePatients();

  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const activeAlerts = alerts?.filter((a: any) => !a.resolved) || [];

  /* 🔐 ROUTE PROTECTION */
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  /* 🧠 CLOSE DROPDOWN ON OUTSIDE CLICK */
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ⛔ SHOW LOADING IF USER NULL */
  if (isLoading) {
    return null;
  }

  if (!user) {
    router.replace("/login");
    return null;
  }

  return (
    <div className="flex h-screen bg-[#F4F7FB] overflow-hidden">
      {/* =========================
          SIDEBAR
      ========================= */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 256 }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        className="relative bg-[#0F172A] text-white flex flex-col justify-between flex-shrink-0"
      >
        {/* ===== TOP SECTION ===== */}
        <div>
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            {!collapsed && (
              <div>
                <h1 className="text-lg font-semibold tracking-wide">
                  MedSafe AI
                </h1>
                <p className="text-xs text-gray-400">
                  Clinical Safety Platform
                </p>
              </div>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <Menu size={18} />
            </button>
          </div>

          {/* ===== NAVIGATION ===== */}
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

        {/* ===== BOTTOM SECTION ===== */}
        <div className="p-4 border-t border-white/10">
          {!collapsed && (
            <>
              <p className="font-semibold text-gray-200">
                {user.name || "Dr. Smith"}
              </p>
              <p className="text-sm text-gray-400 mb-4">
                {user.role || "Physician"}
              </p>
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
          >
            <LogOut size={16} />
            {!collapsed && "Sign Out"}
          </motion.button>
        </div>
      </motion.aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* 🔔 PROFESSIONAL NOTIFICATION SYSTEM */}
        <div className="fixed top-6 right-8 z-[100]" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Bell size={20} className="text-gray-700" />

            {activeAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white px-2 py-0.5 rounded-full shadow-md animate-pulse">
                {activeAlerts.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="mt-4 w-96 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden backdrop-blur-xl"
              >
                <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h3 className="font-semibold text-gray-800">
                    Active Notifications
                  </h3>
                  <p className="text-xs text-gray-500">
                    Real-time clinical alerts
                  </p>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {activeAlerts.length > 0 ? (
                    activeAlerts.slice(0, 6).map((alert: any) => (
                      <div
                        key={alert.id}
                        className="flex items-start gap-3 px-6 py-4 border-b hover:bg-gray-50 transition"
                      >
                        <span
                          className={`w-2 h-2 mt-2 rounded-full ${
                            alert.severity === "High"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        />

                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {alert.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {alert.severity} Priority
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-sm text-gray-500 text-center">
                      No active alerts
                    </div>
                  )}
                </div>

                <div className="p-4 bg-gray-50 text-center">
                  <Link
                    href="/dashboard/alerts"
                    onClick={() => setShowNotifications(false)}
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    View All Alerts →
                  </Link>
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

/* =========================
   SIDEBAR ITEM
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
            className="absolute inset-0 bg-blue-600 rounded-xl"
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
