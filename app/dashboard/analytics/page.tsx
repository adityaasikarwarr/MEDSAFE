"use client";

import { usePatients } from "@/context/PatientContext";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const { patients, alerts } = usePatients();

  /* ================= METRICS ================= */

  const totalPatients = patients.length;
  const admittedPatients = patients.filter(
    (p) => p.status === "Admitted",
  ).length;

  const activeAlerts = alerts.filter((a) => !a.resolved);
  const resolvedAlerts = alerts.filter((a) => a.resolved);

  const criticalPatients = patients.filter((p) => p.risk === "Critical").length;
  const highPatients = patients.filter((p) => p.risk === "High").length;
  const mediumPatients = patients.filter((p) => p.risk === "Medium").length;
  const lowPatients = patients.filter((p) => p.risk === "Low").length;

  const resolutionRate =
    alerts.length === 0
      ? 100
      : Math.round((resolvedAlerts.length / alerts.length) * 100);

  const healthScore =
    totalPatients === 0
      ? 100
      : Math.max(
          0,
          100 -
            Math.round(
              (criticalPatients * 12 +
                activeAlerts.length * 6 +
                highPatients * 4) /
                totalPatients,
            ),
        );

  /* ================= DATA ================= */

  const riskTrendData = [
    { level: "Critical", value: criticalPatients },
    { level: "High", value: highPatients },
    { level: "Medium", value: mediumPatients },
    { level: "Low", value: lowPatients },
  ];

  const departmentData = Object.values(
    patients.reduce((acc: any, patient) => {
      acc[patient.department] = acc[patient.department] || {
        department: patient.department,
        count: 0,
      };
      acc[patient.department].count += 1;
      return acc;
    }, {}),
  );

  const trendData = Object.values(
    alerts.reduce((acc: any, alert) => {
      const day = new Date(alert.timestamp).toLocaleDateString();
      acc[day] = acc[day] || { day, alerts: 0 };
      acc[day].alerts += 1;
      return acc;
    }, {}),
  );

  /* ================= RENDER ================= */

  return (
    <div className="space-y-14">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Hospital Intelligence Analytics
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Operational performance & clinical distribution insights
        </p>
      </div>

      {/* KPI GRID */}
      <div className="grid gap-6 md:grid-cols-4">
        <KPI label="System Health" value={`${healthScore}%`} />
        <KPI label="Resolution Rate" value={`${resolutionRate}%`} />
        <KPI label="Total Patients" value={totalPatients} />
        <KPI label="Admitted Patients" value={admittedPatients} />
      </div>

      {/* CHART GRID */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Risk Line */}
        <ChartCard title="Risk Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={riskTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="level" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Alert Trend */}
        <ChartCard title="Alert Trend">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="alerts"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ALERT SEVERITY MODERN LINE */}
        <ChartCard title="Alert Severity Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={alertSeverityData}>
              <defs>
                <linearGradient
                  id="severityGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.3} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />

              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                }}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="url(#severityGradient)"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
                animationDuration={900}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 🔥 UPGRADED DEPARTMENT LOAD */}
        <ChartCard title="Department Load">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={departmentData} barSize={40}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

              <XAxis dataKey="department" stroke="#94a3b8" fontSize={12} />

              <YAxis stroke="#94a3b8" fontSize={12} />

              <Tooltip
                cursor={{ fill: "rgba(99,102,241,0.08)" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                }}
              />

              <Bar
                dataKey="count"
                fill="url(#barGradient)"
                radius={[12, 12, 6, 6]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

/* ================= KPI ================= */
function KPI({ label, value }: { label: string; value: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 transition bg-white border shadow-sm rounded-2xl border-slate-100 hover:shadow-lg"
    >
      <p className="text-xs tracking-wide uppercase text-slate-500">{label}</p>
      <h2 className="mt-3 text-3xl font-semibold text-slate-900">{value}</h2>
    </motion.div>
  );
}

/* ================= CARD ================= */
function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 transition border shadow-md bg-white/90 backdrop-blur-sm rounded-2xl border-slate-100 hover:shadow-xl"
    >
      <h3 className="mb-4 text-sm font-semibold tracking-wide text-slate-700">
        {title}
      </h3>
      {children}
    </motion.div>
  );
}
