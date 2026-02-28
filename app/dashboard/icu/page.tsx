"use client";

import { usePatients } from "@/context/PatientContext";
import { useSettings } from "@/context/SettingsContext";
import { useEffect, useState } from "react";

export default function ICUPage() {
  const { patients, updatePatient } = usePatients();
  const { settings } = useSettings();

  const [vitals, setVitals] = useState<Record<number, any>>({});

  useEffect(() => {
    if (!settings.icuAutoMonitoring) return;

    const interval = setInterval(() => {
      const updatedVitals: Record<number, any> = {};

      patients.forEach((p) => {
        const heartRate = Math.floor(Math.random() * 80) + 60;
        const oxygen = Math.floor(Math.random() * 15) + 85;

        let newRisk: any;

        if (heartRate > 115 || oxygen < 92) {
          newRisk = "Critical";
        } else if (heartRate > 95) {
          newRisk = "Medium";
        } else {
          newRisk = "Low";
        }

        updatePatient({ ...p, risk: newRisk });

        updatedVitals[p.id] = {
          heartRate,
          oxygen,
          updatedAt: new Date().toLocaleTimeString(),
        };
      });

      setVitals(updatedVitals);
    }, 2000);

    return () => clearInterval(interval);
  }, [patients, settings.icuAutoMonitoring]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ICU Monitor</h1>

      {patients.length === 0 && (
        <p className="text-gray-500">No patients available</p>
      )}

      {patients.map((patient) => {
        const data = vitals[patient.id];
        if (!data) return null;

        return (
          <div
            key={patient.id}
            className="bg-white p-6 rounded-xl shadow border"
          >
            <h2 className="font-semibold">{patient.name}</h2>
            <p>Heart Rate: {data.heartRate} bpm</p>
            <p>Oxygen: {data.oxygen}%</p>
          </div>
        );
      })}
    </div>
  );
}
