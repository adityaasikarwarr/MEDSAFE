"use client";

import { vitalsHistoryService } from "@/services/vitalsHistoryService";
import { usePatients } from "@/context/PatientContext";
import { useSettings } from "@/context/SettingsContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HeartPulse, Activity, User } from "lucide-react";
import StatusCard from "@/components/ui/StatusCard";
import { LineChart, Line, ResponsiveContainer } from "recharts";

type VitalState = {
  heartRate: number;
  oxygen: number;
  updatedAt: string;
};

type ChartState = {
  hr: number;
  oxygen: number;
};

type EventItem = {
  message: string;
  type: "alert" | "info";
  time: string;
};

export default function ICUPage() {
  const { patients, updatePatient } = usePatients();
  const { settings } = useSettings();

  const [vitals, setVitals] = useState<Record<number, VitalState>>({});
  const [charts, setCharts] = useState<Record<number, ChartState[]>>({});
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    if (!settings.icuAutoMonitoring) return;

    const interval = setInterval(async () => {
      const updated: Record<number, VitalState> = {};
      const updatedCharts = { ...charts };

      for (const p of patients) {
        const heartRate = Math.floor(Math.random() * 40) + 70;
        const oxygen = Math.floor(Math.random() * 10) + 90;

        let newRisk: "Low" | "Medium" | "High" | "Critical" = "Low";

        if (heartRate > 110 || oxygen < 92) newRisk = "Critical";
        else if (heartRate > 95) newRisk = "High";
        else if (heartRate > 85) newRisk = "Medium";

        updatePatient({ ...p, risk: newRisk });

        await vitalsHistoryService.add({
          patientId: p.id,
          hr: heartRate,
          o2: oxygen,
          bp: p.vitals?.bp || "",
          timestamp: Date.now(),
        });

        updated[p.id] = {
          heartRate,
          oxygen,
          updatedAt: new Date().toLocaleTimeString(),
        };

        if (!updatedCharts[p.id]) updatedCharts[p.id] = [];

        updatedCharts[p.id] = [
          ...updatedCharts[p.id].slice(-15),
          { hr: heartRate, oxygen },
        ];

        /* -------- ICU EVENT GENERATION -------- */

        if (heartRate > 110) {
          setEvents((prev) => [
            {
              message: `Heart Rate Spike — ${p.name}`,
              type: "alert",
              time: new Date().toLocaleTimeString(),
            },
            ...prev.slice(0, 8),
          ]);
        }

        if (oxygen < 92) {
          setEvents((prev) => [
            {
              message: `Low Oxygen Level — ${p.name}`,
              type: "alert",
              time: new Date().toLocaleTimeString(),
            },
            ...prev.slice(0, 8),
          ]);
        }
      }

      setCharts(updatedCharts);
      setVitals(updated);
    }, 3000);

    return () => clearInterval(interval);
  }, [patients, settings.icuAutoMonitoring]);

  const totalPatients = patients.length;
  const criticalPatients = patients.filter((p) => p.risk === "Critical").length;

  const avgHR =
    Object.values(vitals).reduce((sum, v) => sum + v.heartRate, 0) /
    (Object.values(vitals).length || 1);

  const avgOxygen =
    Object.values(vitals).reduce((sum, v) => sum + v.oxygen, 0) /
    (Object.values(vitals).length || 1);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          ICU Live Monitoring
        </h1>
        <p className="text-slate-500">Real-time patient vitals tracking</p>
      </div>

      {/* STATS PANEL */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <StatCard
          title="Patients"
          value={totalPatients}
          color="text-blue-600"
        />
        <StatCard
          title="Critical"
          value={criticalPatients}
          color="text-red-500"
        />
        <StatCard
          title="Avg HR"
          value={`${Math.round(avgHR)} bpm`}
          color="text-orange-500"
        />
        <StatCard
          title="Avg O₂"
          value={`${Math.round(avgOxygen)} %`}
          color="text-green-500"
        />
      </div>

      {/* ICU EVENT FEED */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200"
      >
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          ICU Event Feed
        </h3>

        <div className="space-y-3">
          {events.length === 0 && (
            <p className="text-sm text-slate-400">
              Monitoring system events will appear here
            </p>
          )}

          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-3 border rounded-lg border-slate-200 bg-slate-50"
            >
              <span
                className={`text-sm font-medium ${
                  event.type === "alert" ? "text-red-600" : "text-slate-700"
                }`}
              >
                {event.type === "alert" ? "⚠" : "✔"} {event.message}
              </span>

              <span className="text-xs text-slate-400">{event.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* EMPTY STATE */}

      {patients.length === 0 && (
        <StatusCard
          title="No ICU Patients"
          description="There are currently no patients under intensive monitoring."
        />
      )}

      {/* PATIENT GRID */}

      {patients.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {patients.map((patient) => {
            const data = vitals[patient.id];
            const chart = charts[patient.id] || [];

            const borderStyle =
              patient.risk === "Critical"
                ? "border-red-400"
                : patient.risk === "High"
                  ? "border-orange-400"
                  : patient.risk === "Medium"
                    ? "border-yellow-400"
                    : "border-green-400";

            return (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className={`relative p-6 space-y-6 rounded-2xl border bg-white shadow-lg ${borderStyle}`}
              >
                {patient.risk === "Critical" && (
                  <motion.div
                    className="absolute inset-0 border-2 border-red-400 rounded-2xl"
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}

                {/* HEADER */}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100">
                      <User size={16} />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {patient.name}
                      </h2>

                      <p className="text-xs text-slate-500">
                        {patient.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="relative flex w-3 h-3">
                      <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
                      <span className="relative inline-flex w-3 h-3 bg-green-500 rounded-full"></span>
                    </span>

                    <RiskBadge risk={patient.risk} />
                  </div>
                </div>

                {/* PATIENT INFO */}

                <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                  <Info label="Age" value={patient.age} />
                  <Info label="Status" value={patient.status} />

                  <Info
                    label="Medications"
                    value={
                      patient.medications?.length
                        ? patient.medications.join(", ")
                        : "None"
                    }
                  />
                </div>

                {/* VITALS */}

                {data && (
                  <div className="space-y-4">
                    <VitalBar
                      icon={<HeartPulse size={16} />}
                      label="Heart Rate"
                      value={data.heartRate}
                      unit="bpm"
                      max={150}
                      risk={patient.risk}
                    />

                    <MiniChart data={chart} dataKey="hr" color="#ef4444" />

                    <VitalBar
                      icon={<Activity size={16} />}
                      label="Oxygen"
                      value={data.oxygen}
                      unit="%"
                      max={100}
                      risk={patient.risk}
                    />

                    <MiniChart data={chart} dataKey="oxygen" color="#3b82f6" />

                    <p className="text-xs text-slate-400">
                      Updated at {data.updatedAt}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function StatCard({ title, value, color }: any) {
  const showTrend = typeof value === "string";
  const trendUp = Math.random() > 0.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -2 }}
      className="relative p-5 bg-white border shadow-sm rounded-xl border-slate-200"
    >
      <p className="text-xs text-slate-500">{title}</p>

      <div className="flex items-center gap-2">
        <motion.p
          key={value}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className={`text-2xl font-bold ${color}`}
        >
          {value}
        </motion.p>

        {showTrend && (
          <span
            className={`text-sm font-bold ${
              trendUp ? "text-green-500" : "text-red-500"
            }`}
          >
            {trendUp ? "↑" : "↓"}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function Info({ label, value }: any) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-medium text-slate-700">{value}</p>
    </div>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const styles =
    risk === "Critical"
      ? "bg-red-100 text-red-700 border border-red-200"
      : risk === "High"
        ? "bg-orange-100 text-orange-700 border border-orange-200"
        : risk === "Medium"
          ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
          : "bg-green-100 text-green-700 border border-green-200";

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles}`}>
      {risk}
    </span>
  );
}

function MiniChart({ data, dataKey, color }: any) {
  return (
    <div className="h-16">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function VitalBar({ icon, label, value, unit, max, risk }: any) {
  const percentage = Math.min((value / max) * 100, 100);

  const barColor =
    risk === "Critical"
      ? "bg-red-500"
      : risk === "High"
        ? "bg-orange-500"
        : risk === "Medium"
          ? "bg-yellow-500"
          : "bg-green-500";

  return (
    <div>
      <div className="flex items-center justify-between mb-1 text-sm text-slate-600">
        <span className="flex items-center gap-2">
          {icon} {label}
        </span>

        <span className="font-medium">
          {value} {unit}
        </span>
      </div>

      <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
        <motion.div
          className={`h-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
