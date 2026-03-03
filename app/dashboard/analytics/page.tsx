"use client";

import { usePatients } from "@/context/PatientContext";
import {
  Card,
  Title,
  BarChart,
  DonutChart,
  AreaChart,
  Metric,
  Text,
} from "@tremor/react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const { patients, alerts } = usePatients();

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

  const riskData = [
    { name: "Critical", value: criticalPatients },
    { name: "High", value: highPatients },
    { name: "Medium", value: mediumPatients },
    { name: "Low", value: lowPatients },
  ];

  const alertData = ["Critical", "High", "Medium", "Low"].map((level) => ({
    name: level,
    Alerts: activeAlerts.filter((a) => a.severity === level).length,
  }));

  const departmentData = Object.values(
    patients.reduce((acc: any, patient) => {
      acc[patient.department] = acc[patient.department] || {
        department: patient.department,
        Patients: 0,
      };
      acc[patient.department].Patients += 1;
      return acc;
    }, {}),
  );

  const trendData = Object.values(
    alerts.reduce((acc: any, alert) => {
      const day = new Date(alert.timestamp).toLocaleDateString();
      acc[day] = acc[day] || { date: day, Alerts: 0 };
      acc[day].Alerts += 1;
      return acc;
    }, {}),
  );

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

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Hospital Intelligence Analytics
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Real-time operational performance dashboard
        </p>
      </div>

      {/* KPI SECTION */}
      <div className="grid gap-6 md:grid-cols-4">
        <KPI label="System Health" value={`${healthScore}%`} />
        <KPI label="Resolution Rate" value={`${resolutionRate}%`} />
        <KPI label="Total Patients" value={totalPatients} />
        <KPI label="Admitted Patients" value={admittedPatients} />
      </div>

      {/* CHARTS */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border shadow-md rounded-3xl border-slate-100">
          <Title>Patient Risk Distribution</Title>
          <DonutChart
            data={riskData}
            category="value"
            index="name"
            colors={["red", "orange", "yellow", "emerald"]}
            className="mt-6"
          />
        </Card>

        <Card className="border shadow-md rounded-3xl border-slate-100">
          <Title>Active Alert Severity</Title>
          <BarChart
            data={alertData}
            index="name"
            categories={["Alerts"]}
            colors={["blue"]}
            className="mt-6"
          />
        </Card>

        <Card className="border shadow-md rounded-3xl border-slate-100">
          <Title>Department Distribution</Title>
          <BarChart
            data={departmentData}
            index="department"
            categories={["Patients"]}
            colors={["indigo"]}
            className="mt-6"
          />
        </Card>

        <Card className="border shadow-md rounded-3xl border-slate-100">
          <Title>Alert Trend</Title>
          <AreaChart
            data={trendData}
            index="date"
            categories={["Alerts"]}
            colors={["rose"]}
            className="mt-6"
          />
        </Card>
      </div>
    </div>
  );
}

/* KPI CARD */
function KPI({ label, value }: { label: string; value: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 bg-white border shadow-md rounded-3xl border-slate-100"
    >
      <Text>{label}</Text>
      <Metric className="mt-2">{value}</Metric>
    </motion.div>
  );
}
