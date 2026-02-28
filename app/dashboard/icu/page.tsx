"use client";

import { usePatients } from "@/context/PatientContext";
import { useSettings } from "@/context/SettingsContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HeartPulse, Activity, User, Stethoscope } from "lucide-react";

export default function ICUPage() {
  const { patients, updatePatient } = usePatients();
  const { settings } = useSettings();

  const [vitals, setVitals] = useState<Record<number, any>>({});

  useEffect(() => {
    if (!settings.icuAutoMonitoring) return;

    const interval = setInterval(() => {
      const updated: Record<number, any> = {};

      patients.forEach((p) => {
        const heartRate = Math.floor(Math.random() * 40) + 70;
        const oxygen = Math.floor(Math.random() * 10) + 90;

        let newRisk = "Low";

        if (heartRate > 110 || oxygen < 92) newRisk = "Critical";
        else if (heartRate > 95) newRisk = "High";
        else if (heartRate > 85) newRisk = "Medium";

        updatePatient({ ...p, risk: newRisk as any });

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
        <h1 className="text-3xl font-bold text-gray-800">ICU Monitor</h1>
        <p className="text-gray-500">Real-time patient monitoring dashboard</p>
      </div>

      {patients.length === 0 && (
        <div className="bg-white p-12 rounded-2xl shadow text-center text-gray-500">
          No patients currently under ICU monitoring.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {patients.map((patient) => {
          const data = vitals[patient.id];

          return (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-5"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <User size={16} /> {patient.name}
                  </h2>
                  <p className="text-sm text-gray-500">{patient.department}</p>
                </div>

                <RiskBadge risk={patient.risk} />
              </div>

              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
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
                    color="bg-red-500"
                  />

                  <VitalBar
                    icon={<Activity size={16} />}
                    label="Oxygen"
                    value={data.oxygen}
                    unit="%"
                    max={100}
                    color="bg-blue-500"
                  />

                  <p className="text-xs text-gray-400">
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
      ? "bg-red-100 text-red-600"
      : risk === "High"
        ? "bg-orange-100 text-orange-600"
        : risk === "Medium"
          ? "bg-yellow-100 text-yellow-600"
          : "bg-green-100 text-green-600";

  return (
    <span className={`px-3 py-1 text-xs rounded-full font-medium ${styles}`}>
      {risk}
    </span>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="font-medium text-gray-700">{value}</p>
    </div>
  );
}

function VitalBar({
  icon,
  label,
  value,
  unit,
  max,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  max: number;
  color: string;
}) {
  const percentage = (value / max) * 100;

  return (
    <div>
      <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
        <span className="flex items-center gap-2">
          {icon} {label}
        </span>
        <span>
          {value} {unit}
        </span>
      </div>

      <div className="w-full bg-gray-200 h-2 rounded-full">
        <motion.div
          className={`h-2 rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </div>
  );
}
