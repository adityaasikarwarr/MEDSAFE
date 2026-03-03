"use client";

import { usePatients } from "@/context/PatientContext";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
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
    { id: "Critical", label: "Critical", value: criticalPatients },
    { id: "High", label: "High", value: highPatients },
    { id: "Medium", label: "Medium", value: mediumPatients },
    { id: "Low", label: "Low", value: lowPatients },
  ];

  const alertSeverityData = ["Critical", "High", "Medium", "Low"].map(
    (level) => ({
      severity: level,
      Alerts: activeAlerts.filter((a) => a.severity === level).length,
    }),
  );

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

  const trendData = [
    {
      id: "Alerts",
      data: Object.values(
        alerts.reduce((acc: any, alert) => {
          const day = new Date(alert.timestamp).toLocaleDateString();
          acc[day] = acc[day] || { x: day, y: 0 };
          acc[day].y += 1;
          return acc;
        }, {}),
      ),
    },
  ];

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
          Real-time clinical system monitoring
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
      <div className="grid gap-10 lg:grid-cols-2">
        <ChartCard title="Patient Risk Distribution">
          <ResponsivePie
            data={riskData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            innerRadius={0.65}
            padAngle={2}
            cornerRadius={6}
            colors={{ scheme: "set2" }}
            enableArcLinkLabels={false}
            animate={true}
          />
        </ChartCard>

        <ChartCard title="Active Alert Severity">
          <ResponsiveBar
            data={alertSeverityData}
            keys={["Alerts"]}
            indexBy="severity"
            margin={{ top: 20, right: 20, bottom: 50, left: 40 }}
            padding={0.4}
            borderRadius={8}
            colors={{ scheme: "nivo" }}
            animate={true}
          />
        </ChartCard>

        <ChartCard title="Department Distribution">
          <ResponsiveBar
            data={departmentData}
            keys={["Patients"]}
            indexBy="department"
            margin={{ top: 20, right: 20, bottom: 50, left: 40 }}
            padding={0.4}
            borderRadius={8}
            colors={{ scheme: "category10" }}
            animate={true}
          />
        </ChartCard>

        <ChartCard title="Alert Trend">
          <ResponsiveLine
            data={trendData}
            margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
            curve="monotoneX"
            colors={["#2563eb"]}
            pointSize={8}
            pointBorderWidth={2}
            enableArea={true}
            areaOpacity={0.1}
            useMesh={true}
            animate={true}
          />
        </ChartCard>
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
      className="p-6 bg-white border shadow-lg rounded-3xl border-slate-100"
    >
      <p className="text-xs tracking-wide uppercase text-slate-500">{label}</p>
      <h2 className="mt-3 text-3xl font-semibold text-slate-900">{value}</h2>
    </motion.div>
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
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 h-[350px]"
    >
      <h3 className="mb-4 text-sm font-semibold text-slate-700">{title}</h3>
      <div className="h-[260px]">{children}</div>
    </motion.div>
  );
}
