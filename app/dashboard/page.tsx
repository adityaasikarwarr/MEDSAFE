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
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

export default function DashboardPage() {
  const { patients, alerts } = usePatients();

  const total = patients.length;
  const critical = patients.filter((p) => p.risk === "Critical").length;
  const medium = patients.filter((p) => p.risk === "Medium").length;
  const low = patients.filter((p) => p.risk === "Low").length;

  const activeAlerts = alerts.filter((a) => !a.resolved).length;

  const riskData = [
    { name: "Critical", value: critical },
    { name: "Medium", value: medium },
    { name: "Low", value: low },
  ];

  const COLORS = ["#ef4444", "#f59e0b", "#10b981"];

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

  const alertTrend = [{ name: "Now", alerts: activeAlerts }];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Clinical Analytics Overview
        </h1>
        <p className="text-sm text-gray-500">
          Intelligent real-time monitoring & risk distribution
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <MetricCard label="Total Patients" value={total} />
        <MetricCard
          label="Critical Cases"
          value={critical}
          color="text-red-600"
        />
        <MetricCard
          label="Active Alerts"
          value={activeAlerts}
          color="text-yellow-600"
        />
        <MetricCard label="Departments" value={departmentData.length} />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Donut Chart */}
        <ChartCard title="Risk Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={riskData}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                animationDuration={800}
              >
                {riskData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#111827",
                  border: "none",
                  borderRadius: "12px",
                  color: "white",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Department Bar */}
        <ChartCard title="Department Load">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={departmentData}>
              <XAxis
                dataKey="department"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "#111827",
                  border: "none",
                  borderRadius: "12px",
                  color: "white",
                }}
              />
              <Bar
                dataKey="count"
                fill="#3b82f6"
                radius={[10, 10, 0, 0]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Professional Area Chart */}
        <ChartCard title="Active Alerts Trend">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={alertTrend}>
              <defs>
                <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "#111827",
                  border: "none",
                  borderRadius: "12px",
                  color: "white",
                }}
              />

              <Area
                type="monotone"
                dataKey="alerts"
                stroke="#ef4444"
                fill="url(#colorAlerts)"
                strokeWidth={3}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* AI Insight */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 p-6 rounded-2xl">
        <h3 className="font-semibold text-blue-700 text-sm mb-2">AI Insight</h3>
        <p className="text-sm text-blue-900">
          {critical > 0
            ? "High-risk patients detected. Immediate clinical intervention recommended."
            : "System stable. No abnormal safety patterns detected."}
        </p>
      </div>
    </div>
  );
}

/* Metric Card */
function MetricCard({
  label,
  value,
  color = "text-gray-900",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-md border border-gray-100">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <h2 className={`text-3xl font-bold mt-2 ${color}`}>{value}</h2>
    </div>
  );
}

/* Chart Card */
function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-md border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      {children}
    </div>
  );
}
