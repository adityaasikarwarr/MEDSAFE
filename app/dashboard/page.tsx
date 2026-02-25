"use client";

import { usePatients } from "@/context/PatientContext";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type RiskType = "Critical" | "Medium" | "Low";

type Patient = {
  id: number;
  name: string;
  age: number;
  department: string;
  risk: RiskType;
  status: string;
};

export default function DashboardPage() {
  const { patients } = usePatients();
  /* 🔥 Calculate stats dynamically */
  const total = patients.length;
  const critical = patients.filter((p) => p.risk === "Critical").length;
  const medium = patients.filter((p) => p.risk === "Medium").length;
  const low = patients.filter((p) => p.risk === "Low").length;

  /* Dummy chart data (can upgrade later) */
  const data = [
    { time: "11:00", value: total },
    { time: "12:00", value: critical },
    { time: "13:00", value: medium },
    { time: "14:00", value: low },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Real-time clinical safety overview</p>
        </div>
        <Bell className="text-gray-500" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Patients" value={total} color="text-blue-600" />
        <StatCard title="Critical" value={critical} color="text-red-600" />
        <StatCard title="Medium Risk" value={medium} color="text-yellow-600" />
        <StatCard title="Low Risk" value={low} color="text-green-600" />
      </div>

      {/* Risk Banner */}
      <div className="bg-white rounded-xl p-6 shadow flex justify-between items-center">
        <div>
          <p className="text-gray-500">Average Risk Score</p>
          <h2 className="text-3xl font-bold text-gray-900">
            {total > 0 ? Math.round((critical * 100) / total) : 0}%
          </h2>
        </div>
        <span className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full text-sm font-semibold">
          Dynamic
        </span>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="font-semibold mb-4">Risk Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* Stat Card Component */
function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>
      <h2 className={`text-3xl font-bold ${color}`}>{value}</h2>
    </div>
  );
}
