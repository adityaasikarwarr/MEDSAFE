"use client";

import { usePatients } from "@/context/PatientContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  AreaChart,
  Area,
} from "recharts";

export default function AnalyticsPage() {
  const { patients, alerts } = usePatients();

  /* ==============================
     CORE SYSTEM METRICS
  ============================== */

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

  /* ==============================
     RISK DISTRIBUTION
  ============================== */

  const riskData = [
    { name: "Critical", value: criticalPatients },
    { name: "High", value: highPatients },
    { name: "Medium", value: mediumPatients },
    { name: "Low", value: lowPatients },
  ];

  const RISK_COLORS = ["#ef4444", "#f97316", "#facc15", "#10b981"];

  /* ==============================
     ALERT SEVERITY
  ============================== */

  const alertSeverityData = ["Critical", "High", "Medium", "Low"].map(
    (level) => ({
      name: level,
      value: activeAlerts.filter((a) => a.severity === level).length,
    }),
  );

  /* ==============================
     DEPARTMENT LOAD
  ============================== */

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

  /* ==============================
     ALERT TREND BY DAY
  ============================== */

  const trendData = Object.values(
    alerts.reduce((acc: any, alert) => {
      const day = new Date(alert.timestamp).toLocaleDateString();

      acc[day] = acc[day] || { day, alerts: 0 };
      acc[day].alerts += 1;
      return acc;
    }, {}),
  );

  /* ==============================
     MEDICATION CONNECTIVITY
  ============================== */

  const patientsWithMeds = patients.filter(
    (p) => p.medications && p.medications.length > 0,
  ).length;

  const medicationCoverage =
    totalPatients === 0
      ? 0
      : Math.round((patientsWithMeds / totalPatients) * 100);

  /* ==============================
     ALERT RESOLUTION RATE
  ============================== */

  const resolutionRate =
    alerts.length === 0
      ? 100
      : Math.round((resolvedAlerts.length / alerts.length) * 100);

  /* ==============================
     SYSTEM HEALTH SCORE (Weighted)
  ============================== */

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
                (totalPatients || 1),
            ),
        );

  /* ==============================
     CRITICAL CONVERSION RATE
  ============================== */

  const criticalRate =
    totalPatients === 0
      ? 0
      : Math.round((criticalPatients / totalPatients) * 100);

  /* ==============================
     ICU LOAD INDEX
  ============================== */

  const icuLoadIndex =
    admittedPatients === 0
      ? 0
      : Math.round((criticalPatients / admittedPatients) * 100);

  /* ==============================
     RENDER
  ============================== */

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Hospital Intelligence Analytics
        </h1>
        <p className="text-sm text-gray-500">
          Fully connected operational monitoring engine
        </p>
      </div>

      {/* KPI GRID */}
      <div className="grid md:grid-cols-4 gap-6">
        <MetricCard label="System Health" value={`${healthScore}%`} highlight />
        <MetricCard label="Critical Rate" value={`${criticalRate}%`} />
        <MetricCard label="Alert Resolution" value={`${resolutionRate}%`} />
        <MetricCard label="ICU Load Index" value={`${icuLoadIndex}%`} />
        <MetricCard
          label="Medication Coverage"
          value={`${medicationCoverage}%`}
        />
        <MetricCard label="Total Patients" value={totalPatients} />
        <MetricCard label="Active Alerts" value={activeAlerts.length} />
        <MetricCard label="Admitted Patients" value={admittedPatients} />
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-2 gap-8">
        <ChartCard title="Patient Risk Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={riskData}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
              >
                {riskData.map((_, index) => (
                  <Cell key={index} fill={RISK_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Active Alert Severity">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={alertSeverityData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Department Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={departmentData}>
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Alert Trend">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="alerts"
                stroke="#ef4444"
                fill="#fecaca"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

/* KPI CARD */
function MetricCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number | string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-white p-6 rounded-2xl shadow border ${
        highlight ? "border-blue-500" : "border-gray-100"
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <h2
        className={`text-3xl font-bold mt-2 ${
          highlight ? "text-blue-600" : "text-gray-900"
        }`}
      >
        {value}
      </h2>
    </div>
  );
}

/* CHART CARD */
function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      {children}
    </div>
  );
}
