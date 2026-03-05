"use client";

import { getPermissions } from "@/engine/permissionEngine";
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
  const permissions = user ? getPermissions(user.role) : null;

  /* CLOSE NOTIFICATION DROPDOWN */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* AUTH PROTECTION */

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">

      {/* ================= SIDEBAR ================= */}

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 90 : 270 }}
        transition={{ type: "spring", stiffness: 220, damping: 30 }}
        className="flex flex-col justify-between text-white border-r shadow-xl bg-slate-900 border-white/10"
      >
        {/* HEADER */}

        <div>
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            {!collapsed && (
              <div>
                <h1 className="text-xl font-semibold">MedSafe AI</h1>
                <p className="text-xs text-slate-400">
                  Clinical Platform
                </p>
              </div>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 transition rounded-lg hover:bg-white/10"
            >
              <Menu size={18} />
            </button>
          </div>

          {/* NAVIGATION */}

          <nav className="p-4 space-y-2">
            <SidebarItem
              href="/"
              icon={<Home size={18} />}
              label="Home"
              active={pathname === "/"}
              collapsed={collapsed}
            />

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
              label="Medication"
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

            {permissions?.canAccessSettings && (
              <SidebarItem
                href="/dashboard/settings"
                icon={<Settings size={18} />}
                label="Settings"
                active={pathname.startsWith("/dashboard/settings")}
                collapsed={collapsed}
              />
            )}
          </nav>
        </div>

        {/* USER PANEL */}

        <div className="p-5 border-t border-white/10">
          {!collapsed && (
            <>
              <p className="font-medium text-slate-200">{user.name}</p>
              <p className="mb-4 text-sm text-slate-400">{user.role}</p>
            </>
          )}

          <button
            onClick={() => {
              logout();
              router.replace("/");
            }}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
          >
            <LogOut size={16} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </motion.aside>

      {/* ================= MAIN ================= */}

      <main className="relative flex-1 overflow-y-auto">

        {/* NOTIFICATIONS */}

        <div className="fixed z-50 top-6 right-10" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 bg-white shadow rounded-2xl"
          >
            <Bell size={20} className="text-slate-700" />

            {activeAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 px-2 py-0.5 text-xs text-white bg-red-500 rounded-full">
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
                className="mt-4 overflow-hidden bg-white border shadow-xl border-slate-100 w-96 rounded-2xl"
              >
                <div className="p-4 border-b bg-slate-50">
                  <h3 className="font-semibold text-slate-800">
                    Active Alerts
                  </h3>
                </div>

                <div className="overflow-y-auto max-h-72">
                  {activeAlerts.length > 0 ? (
                    activeAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="px-4 py-3 border-b hover:bg-slate-50"
                      >
                        <p className="text-sm font-medium text-slate-800">
                          {alert.message}
                        </p>
                        <p className="text-xs text-slate-400">
                          {alert.severity}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-sm text-center text-slate-500">
                      No active alerts
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PAGE TRANSITION */}

        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-full p-10"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

/* SIDEBAR ITEM */

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
    <Link href={href}>
      <div
        className={`flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        } px-4 py-3 rounded-xl transition ${
          active
            ? "bg-white/10 text-white"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        <div className="flex items-center gap-3">
          {icon}
          {!collapsed && <span className="text-sm">{label}</span>}
        </div>

        {!collapsed && badge && (
          <span className="px-2 py-1 text-xs text-white bg-red-500 rounded-full">
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
}