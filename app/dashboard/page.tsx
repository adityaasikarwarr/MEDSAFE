"use client";

import { Bell } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { time: "11:33", blue: 25, red: 1 },
  { time: "12:33", blue: 40, red: 2 },
  { time: "13:33", blue: 32, red: 1 },
  { time: "14:33", blue: 45, red: 0 },
  { time: "15:33", blue: 28, red: 0 },
  { time: "16:33", blue: 42, red: 1 },
  { time: "17:33", blue: 44, red: 3 },
  { time: "18:33", blue: 38, red: 4 },
  { time: "19:33", blue: 43, red: 2 },
  { time: "20:33", blue: 41, red: 1 },
  { time: "21:33", blue: 29, red: 3 },
  { time: "22:33", blue: 46, red: 1 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Dashboard</h1>
          <p className="text-black">Real-time clinical safety overview</p>
        </div>
        <Bell className="text-gray-900" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Patients" value="16" color="text-blue-600" />
        <StatCard title="Critical" value="6" color="text-red-600" />
        <StatCard title="Medium Risk" value="1" color="text-yellow-600" />
        <StatCard title="Low Risk" value="9" color="text-green-600" />
      </div>

      <div className="bg-white rounded-xl p-6 shadow flex justify-between items-center">
        <div>
          <p className="text-gray-500">Average Risk Score</p>
          <h2 className="text-3xl font-bold text-blue-600">34%</h2>
        </div>
        <span className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full text-sm font-semibold">
          Medium
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow">
          <h2 className="font-semibold mb-4 text-blue-600">Risk Trend (12h)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="blue"
                stroke="#3B82F6"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="red"
                stroke="#EF4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="font-semibold mb-4 flex justify-between text-blue-600">
            Live Alerts
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              8
            </span>
          </h2>

          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            <AlertCard
              name="Daniel Anderson"
              text="Heart rate 139 bpm exceeds 110 (+25)"
            />
            <AlertCard
              name="Sophia Lee"
              text="Heart rate 122 bpm exceeds 110 (+25)"
            />
            <AlertCard
              name="Michael Chen"
              text="Heart rate 131 bpm exceeds 110 (+25)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>
      <h2 className={`text-3xl font-bold ${color}`}>{value}</h2>
    </div>
  );
}

function AlertCard({ name, text }: { name: string; text: string }) {
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-gray-600">{text}</p>
      <p className="text-xs text-gray-400 mt-1">22:33:20</p>
    </div>
  );
}
