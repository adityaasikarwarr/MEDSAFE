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
    <div className="p-8 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Clinical Overview</h1>
        <p className="text-gray-500">Real-time operational analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Users size={20} />}
          title="Total Patients"
          value={totalPatients}
          color="bg-blue-50 text-blue-600"
        />

        <StatCard
          icon={<AlertTriangle size={20} />}
          title="Active Alerts"
          value={activeAlerts}
          color="bg-red-50 text-red-600"
        />

        <StatCard
          icon={<Activity size={20} />}
          title="Critical Patients"
          value={criticalPatients}
          color="bg-orange-50 text-orange-600"
        />

        <StatCard
          icon={<TrendingUp size={20} />}
          title="ICU Occupancy"
          value={icuPatients}
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Risk Distribution */}
      <div className="p-6 space-y-6 bg-white border shadow rounded-2xl">
        <h2 className="text-lg font-semibold text-gray-800">
          Risk Distribution
        </h2>

        <div className="space-y-4">
          {Object.entries(riskCounts).map(([risk, count]) => (
            <div key={risk}>
              <div className="flex justify-between mb-1 text-sm">
                <span>{risk}</span>
                <span>{count}</span>
              </div>

              <div className="w-full h-3 bg-gray-200 rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      totalPatients === 0 ? 0 : (count / totalPatients) * 100
                    }%`,
                  }}
                  transition={{ duration: 0.6 }}
                  className={`h-3 rounded-full ${
                    risk === "Critical"
                      ? "bg-red-500"
                      : risk === "High"
                        ? "bg-orange-500"
                        : risk === "Medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts Snapshot */}
      <div className="p-6 space-y-4 bg-white border shadow rounded-2xl">
        <h2 className="text-lg font-semibold text-gray-800">Recent Alerts</h2>

        {alerts.slice(0, 5).map((alert) => (
          <div key={alert.id} className="pb-2 border-b">
            <p className="text-sm text-gray-800">{alert.message}</p>
            <p className="text-xs text-gray-500">
              {new Date(alert.timestamp).toLocaleString()}
            </p>
          </div>
        ))}

        {alerts.length === 0 && (
          <p className="text-sm text-gray-500">No alerts available.</p>
        )}
      </div>
    </div>
  );
}

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
      whileHover={{ scale: 1.04 }}
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
