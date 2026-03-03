"use client";

import { usePatients } from "@/context/PatientContext";
import { motion } from "framer-motion";
import { AlertTriangle, Users, Activity, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { patients, alerts } = usePatients();

  const totalPatients = patients.length;
  const activeAlerts = alerts.filter((a) => !a.resolved).length;
  const criticalPatients = patients.filter((p) => p.risk === "Critical").length;

  const icuPatients = patients.filter(
    (p) => p.department === "ICU" && p.status !== "Discharged",
  ).length;

  const riskCounts = {
    Low: patients.filter((p) => p.risk === "Low").length,
    Medium: patients.filter((p) => p.risk === "Medium").length,
    High: patients.filter((p) => p.risk === "High").length,
    Critical: patients.filter((p) => p.risk === "Critical").length,
  };

  return (
    <div className="min-h-screen p-10 space-y-12 bg-slate-50">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Clinical Command Center
        </h1>
        <p className="mt-2 text-slate-500">
          Real-time operational intelligence
        </p>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Users size={20} />}
          title="Total Patients"
          value={totalPatients}
          accent="blue"
        />

        <StatCard
          icon={<AlertTriangle size={20} />}
          title="Active Alerts"
          value={activeAlerts}
          accent="red"
        />

        <StatCard
          icon={<Activity size={20} />}
          title="Critical Patients"
          value={criticalPatients}
          accent="orange"
        />

        <StatCard
          icon={<TrendingUp size={20} />}
          title="ICU Occupancy"
          value={icuPatients}
          accent="violet"
        />
      </div>

      {/* Risk Distribution */}
      <div className="p-8 bg-white border shadow-md rounded-3xl border-slate-100">
        <h2 className="mb-6 text-xl font-semibold text-slate-900">
          Risk Distribution
        </h2>

        <div className="space-y-6">
          {Object.entries(riskCounts).map(([risk, count]) => {
            const percentage =
              totalPatients === 0 ? 0 : (count / totalPatients) * 100;

            return (
              <div key={risk}>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium text-slate-700">{risk}</span>
                  <span className="text-slate-500">{count}</span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6 }}
                    className={`h-3 rounded-full ${
                      risk === "Critical"
                        ? "bg-red-500"
                        : risk === "High"
                          ? "bg-orange-500"
                          : risk === "Medium"
                            ? "bg-yellow-500"
                            : "bg-emerald-500"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alerts Snapshot */}
      <div className="p-8 bg-white border shadow-md rounded-3xl border-slate-100">
        <h2 className="mb-6 text-xl font-semibold text-slate-900">
          Recent Alerts
        </h2>

        {alerts.slice(0, 5).map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-4 border-b last:border-0"
          >
            <p className="text-sm font-medium text-slate-800">
              {alert.message}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {new Date(alert.timestamp).toLocaleString()}
            </p>
          </motion.div>
        ))}

        {alerts.length === 0 && (
          <p className="text-sm text-slate-500">No alerts available.</p>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  accent: "blue" | "red" | "orange" | "violet";
}) {
  const accentStyles = {
    blue: "border-blue-500 bg-blue-50 text-blue-600",
    red: "border-red-500 bg-red-50 text-red-600",
    orange: "border-orange-500 bg-orange-50 text-orange-600",
    violet: "border-violet-500 bg-violet-50 text-violet-600",
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="relative p-6 overflow-hidden bg-white border shadow-md rounded-3xl border-slate-100"
    >
      <div
        className={`absolute left-0 top-0 h-full w-1 ${accentStyles[accent].split(" ")[0]}`}
      />

      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${accentStyles[accent]}`}>{icon}</div>
      </div>

      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </motion.div>
  );
}
