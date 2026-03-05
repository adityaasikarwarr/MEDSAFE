"use client";

import { vitalsHistoryService } from "@/services/vitalsHistoryService";
import { usePatients } from "@/context/PatientContext";
import { useSettings } from "@/context/SettingsContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HeartPulse, Activity, User } from "lucide-react";
import StatusCard from "@/components/ui/StatusCard";

export default function ICUPage() {
  const { patients, updatePatient } = usePatients();
  const { settings } = useSettings();

  const [vitals, setVitals] = useState<Record<number, any>>({});

  useEffect(() => {
    if (!settings.icuAutoMonitoring) return;

    const interval = setInterval(() => {
      const updated: Record<number, any> = {};

      patients.forEach(async (p) => {
        const heartRate = Math.floor(Math.random() * 40) + 70;
        const oxygen = Math.floor(Math.random() * 10) + 90;

        let newRisk = "Low";

        if (heartRate > 110 || oxygen < 92) newRisk = "Critical";
        else if (heartRate > 95) newRisk = "High";
        else if (heartRate > 85) newRisk = "Medium";

        updatePatient({ ...p, risk: newRisk as any });

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
      });

      setVitals(updated);
    }, 3000);

    return () => clearInterval(interval);
  }, [patients, settings.icuAutoMonitoring]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">ICU Monitor</h1>
        <p className="text-slate-500">Real-time patient monitoring dashboard</p>
      </div>

      {patients.length === 0 && (
        <StatusCard
          title="No ICU Patients"
          description="There are currently no patients under intensive monitoring."
        />
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {patients.map((patient) => {
          const data = vitals[patient.id];

          return (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className={`p-6 space-y-5 bg-white border shadow-lg rounded-2xl transition ${
                patient.risk === "Critical"
                  ? "border-red-400"
                  : patient.risk === "High"
                    ? "border-orange-400"
                    : patient.risk === "Medium"
                      ? "border-yellow-400"
                      : "border-green-400"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <User size={16} /> {patient.name}
                  </h2>
                  <p className="text-sm text-slate-500">{patient.department}</p>
                </div>

                <RiskBadge risk={patient.risk} />
              </div>

              {/* Patient Info */}
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

              {/* Vitals */}
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

                  <VitalBar
                    icon={<Activity size={16} />}
                    label="Oxygen"
                    value={data.oxygen}
                    unit="%"
                    max={100}
                    risk={patient.risk}
                  />

                  <p className="text-xs text-slate-400">
                    Updated at {data.updatedAt}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ========================== */

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
    <span className={`px-3 py-1 text-xs rounded-full font-semibold ${styles}`}>
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
  const percentage = (value / max) * 100;

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
          {value > max * 0.8 && (
            <span className="text-xs font-bold text-red-500">↑</span>
          )}
        </span>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full">
        <motion.div
          className={`h-2 rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </div>
  );
}
