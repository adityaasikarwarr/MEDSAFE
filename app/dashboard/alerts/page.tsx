"use client";

import RoleGuard from "@/components/dashboard/RoleGuard";
import { usePatients } from "@/context/PatientContext";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function AlertsPage() {
  const { alerts, resolveAlert } = usePatients();
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");

  /* ================= FILTERED ALERTS ================= */

  const filteredAlerts = useMemo(() => {
    if (filter === "resolved") return alerts.filter((a) => a.resolved);

    // both "all" and "active" show only active alerts
    return alerts.filter((a) => !a.resolved);
  }, [alerts, filter]);

  /* ================= STATS ================= */

  const activeCount = alerts.filter((a) => !a.resolved).length;

  const criticalCount = alerts.filter(
    (a) => a.severity === "Critical" && !a.resolved,
  ).length;

  const totalActive = alerts.filter((a) => !a.resolved).length;

  /* ================= UI ================= */

  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Clinical Alerts
        </h1>
        <p className="text-slate-500">Real-time patient safety monitoring</p>
      </div>

      {/* STATISTICS */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          icon={<AlertTriangle size={18} />}
          title="Active Alerts"
          value={activeCount}
          color="bg-red-50 text-red-600"
        />

        <StatCard
          icon={<Clock size={18} />}
          title="Total Alerts"
          value={totalActive}
          color="bg-blue-50 text-blue-600"
        />

        <StatCard
          icon={<AlertTriangle size={18} />}
          title="Critical Alerts"
          value={criticalCount}
          color="bg-orange-50 text-orange-600"
        />
      </div>

      {/* FILTER BUTTONS */}

      <div className="flex gap-4">
        <FilterButton
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="All"
        />

        <FilterButton
          active={filter === "active"}
          onClick={() => setFilter("active")}
          label="Active"
        />

        <FilterButton
          active={filter === "resolved"}
          onClick={() => setFilter("resolved")}
          label="Resolved"
        />
      </div>

      {/* ALERT LIST */}

      <div className="space-y-4">
        {filteredAlerts.length === 0 && (
          <div className="p-12 text-center text-gray-500 bg-white shadow rounded-2xl">
            No alerts available.
          </div>
        )}

        <AnimatePresence>
          {filteredAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`bg-white rounded-2xl shadow-sm border p-6 flex justify-between items-start

              ${
                alert.severity === "Critical"
                  ? "border-red-400"
                  : alert.severity === "High"
                    ? "border-orange-400"
                    : alert.severity === "Medium"
                      ? "border-yellow-300"
                      : "border-gray-200"
              }

              ${alert.resolved ? "opacity-70" : ""}
            `}
            >
              {/* LEFT CONTENT */}

              <div className="space-y-2">
                <p className="font-medium text-slate-800">{alert.message}</p>

                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span
                    className={`px-2 py-1 rounded-full text-xs

                    ${
                      alert.severity === "Critical"
                        ? "bg-red-100 text-red-600"
                        : alert.severity === "High"
                          ? "bg-orange-100 text-orange-600"
                          : alert.severity === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                    }
                  `}
                  >
                    {alert.severity}
                  </span>

                  <span>{new Date(alert.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* ACTION */}

              {!alert.resolved ? (
                <RoleGuard allow={["ADMIN", "DOCTOR"]}>
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Resolve
                  </button>
                </RoleGuard>
              ) : (
                <span className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle size={16} /> Resolved
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`p-6 rounded-2xl shadow-sm flex items-center gap-4 ${color}`}
    >
      {icon}
      <div>
        <p className="text-sm opacity-70">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
}

/* ================= FILTER BUTTON ================= */

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm transition

      ${
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }
    `}
    >
      {label}
    </button>
  );
}
