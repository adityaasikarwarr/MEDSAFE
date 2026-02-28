"use client";

import { PatientProvider, usePatients } from "@/context/PatientContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";

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
   OUTER WRAPPER (PROVIDERS)
========================= */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SettingsProvider>
        <PatientProvider>
          <LayoutContent>{children}</LayoutContent>
        </PatientProvider>
      </SettingsProvider>
    </AuthProvider>
  );
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

  const activeAlerts = alerts?.filter((a) => !a.resolved) || [];

  /* 🔐 ROUTE PROTECTION */
  useEffect(() => {
    if (!user && !isLoading) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

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

  if (isLoading) return null;
  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#F4F7FB] overflow-hidden">
      {/* =========================
          SIDEBAR
      ========================= */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 256 }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        className="bg-[#0F172A] text-white flex flex-col justify-between"
      >
        {/* TOP */}
        <div>
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            {!collapsed && (
              <div>
                <h1 className="text-lg font-semibold">MedSafe AI</h1>
                <p className="text-xs text-gray-400">
                  Clinical Safety Platform
                </p>
              </div>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <Menu size={18} />
            </button>
          </div>

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

        {/* BOTTOM */}
        <div className="p-4 border-t border-white/10">
          {!collapsed && (
            <>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-400 mb-4">{user.role}</p>
            </>
          )}

          <button
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
          >
            <LogOut size={16} />
            {!collapsed && "Sign Out"}
          </button>
        </div>
      </motion.aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* NOTIFICATION BELL */}
        <div className="fixed top-6 right-8 z-50" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 bg-white rounded-2xl shadow-lg"
          >
            <Bell size={20} className="text-gray-700" />

            {activeAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white px-2 py-0.5 rounded-full">
                {activeAlerts.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 w-96 bg-white rounded-3xl shadow-xl border overflow-hidden"
              >
                <div className="px-6 py-4 border-b bg-gray-50">
                  <h3 className="font-semibold">Active Notifications</h3>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {activeAlerts.length > 0 ? (
                    activeAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="px-6 py-4 border-b hover:bg-gray-50"
                      >
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-gray-500">
                          {alert.severity} Priority
                        </p>
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
    <Link href={href} className="block">
      <div
        className={`flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        } px-4 py-3 rounded-xl cursor-pointer ${
          active ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-white/10"
        }`}
      >
        <div className="flex items-center gap-3">
          {icon}
          {!collapsed && <span>{label}</span>}
        </div>

        {!collapsed && badge && (
          <span className="bg-red-500 text-xs px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
}
