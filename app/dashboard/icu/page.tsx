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

export default function ICUPage() {
  const { patients, updatePatient } = usePatients();
  const { settings } = useSettings();

  const [vitals, setVitals] = useState<Record<number, VitalState>>({});
  const [charts, setCharts] = useState<Record<number, ChartState[]>>({});

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
      }

      setCharts(updatedCharts);
      setVitals(updated);
    }, 3000);

    return () => clearInterval(interval);
  }, [patients, settings.icuAutoMonitoring]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          ICU Live Monitoring
        </h1>

        <p className="text-slate-500">Real-time patient vitals tracking</p>
      </div>

      {patients.length === 0 && (
        <StatusCard
          title="No ICU Patients"
          description="There are currently no patients under intensive monitoring."
        />
      )}

      {patients.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {patients.map((patient) => {
            const data = vitals[patient.id];
            const chart = charts[patient.id] || [];

            const borderStyle =
              patient.risk === "Critical"
                ? "border-red-400 shadow-red-100"
                : patient.risk === "High"
                  ? "border-orange-400 shadow-orange-100"
                  : patient.risk === "Medium"
                    ? "border-yellow-400 shadow-yellow-100"
                    : "border-green-400 shadow-green-100";

            return (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                whileHover={{ scale: 1.02 }}
                className={`relative p-6 space-y-5 border rounded-2xl bg-white/80 backdrop-blur-md shadow-lg transition ${borderStyle}`}
              >
                {patient.risk === "Critical" && (
                  <motion.div
                    className="absolute inset-0 border-2 border-red-400 rounded-2xl"
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                      <User size={16} />
                      {patient.name}
                    </h2>

                    <p className="text-sm text-slate-500">
                      {patient.department}
                    </p>
                  </div>

                  <RiskBadge risk={patient.risk} />
                </div>

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

/* ============================= */

function MiniChart({
  data,
  dataKey,
  color,
}: {
  data: any[];
  dataKey: string;
  color: string;
}) {
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
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
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

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-medium text-slate-700">{value}</p>
    </div>
  );
}

function VitalBar({
  icon,
  label,
  value,
  unit,
  max,
  risk,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  max: number;
  risk: string;
}) {
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

        <span className="flex items-center gap-1 font-medium">
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
