"use client";

import { usePatients } from "@/context/PatientContext";
import { useSettings } from "@/context/SettingsContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

        let newRisk = p.risk;

        if (heartRate > 110 || oxygen < 92) {
          newRisk = "Critical";
        } else if (heartRate > 95) {
          newRisk = "High";
        } else if (heartRate > 85) {
          newRisk = "Medium";
        } else {
          newRisk = "Low";
        }

        updatePatient({ ...p, risk: newRisk });

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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          ICU Monitor
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Real-time patient vital monitoring
        </p>
      </div>

      {patients.length === 0 && (
        <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl shadow border dark:border-slate-700 text-center text-gray-500 dark:text-gray-400">
          No ICU patients available
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patients.map((patient) => {
          const data = vitals[patient.id];

          return (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border dark:border-slate-700 p-6 space-y-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-lg text-gray-800 dark:text-white">
                    {patient.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {patient.department}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    patient.risk === "Critical"
                      ? "bg-red-100 text-red-600"
                      : patient.risk === "High"
                        ? "bg-orange-100 text-orange-600"
                        : patient.risk === "Medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                  }`}
                >
                  {patient.risk}
                </span>
              </div>

              {data ? (
                <div className="space-y-2">
                  <VitalBar
                    label="Heart Rate"
                    value={data.heartRate}
                    unit="bpm"
                    max={150}
                  />

                  <VitalBar
                    label="Oxygen"
                    value={data.oxygen}
                    unit="%"
                    max={100}
                  />

                  <p className="text-xs text-gray-400">
                    Updated at {data.updatedAt}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  Waiting for monitoring data...
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ========================= */

function VitalBar({
  label,
  value,
  unit,
  max,
}: {
  label: string;
  value: number;
  unit: string;
  max: number;
}) {
  const percentage = (value / max) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
        <span>{label}</span>
        <span>
          {value} {unit}
        </span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-slate-700 h-2 rounded-full mt-1">
        <div
          className="h-2 rounded-full bg-blue-500 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
