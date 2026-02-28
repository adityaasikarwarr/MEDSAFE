"use client";

import { usePatients } from "@/context/PatientContext";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function AlertsPage() {
  const { alerts, resolveAlert } = usePatients();
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");

  const filteredAlerts = useMemo(() => {
    if (filter === "active") return alerts.filter((a) => !a.resolved);
    if (filter === "resolved") return alerts.filter((a) => a.resolved);
    return alerts;
  }, [alerts, filter]);

  const activeCount = alerts.filter((a) => !a.resolved).length;
  const criticalCount = alerts.filter(
    (a) => a.severity === "Critical" && !a.resolved,
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Clinical Alerts</h1>
        <p className="text-gray-500">Real-time patient safety monitoring</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<AlertTriangle size={18} />}
          title="Active Alerts"
          value={activeCount}
          color="bg-red-50 text-red-600"
        />
        <StatCard
          icon={<Clock size={18} />}
          title="Total Alerts"
          value={alerts.length}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={<AlertTriangle size={18} />}
          title="Critical Alerts"
          value={criticalCount}
          color="bg-orange-50 text-orange-600"
        />
      </div>

      {/* Filters */}
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

      {/* Alert List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 && (
          <div className="bg-white p-12 rounded-2xl shadow text-center text-gray-500">
            No alerts available.
          </div>
        )}

        {filteredAlerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-2xl shadow-md border p-6 flex justify-between items-start ${
              alert.severity === "Critical"
                ? "border-red-400"
                : alert.severity === "High"
                  ? "border-orange-400"
                  : "border-gray-200"
            }`}
          >
            <div className="space-y-2">
              <p className="font-semibold text-gray-800">{alert.message}</p>

              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="px-2 py-1 rounded-full bg-gray-100">
                  {alert.severity}
                </span>
                <span>{new Date(alert.timestamp).toLocaleString()}</span>
              </div>
            </div>

            {!alert.resolved ? (
              <button
                onClick={() => resolveAlert(alert.id)}
                className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Resolve
              </button>
            ) : (
              <span className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle size={16} /> Resolved
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ========================== */

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
      className={`p-6 rounded-2xl shadow-md flex items-center gap-4 ${color}`}
    >
      {icon}
      <div>
        <p className="text-sm opacity-70">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
}

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
      className={`px-5 py-2 rounded-full text-sm transition ${
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}
