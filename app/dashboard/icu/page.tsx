"use client";

import { useState, useEffect } from "react";
import { usePatients } from "@/context/PatientContext";

export default function ICUPage() {
  const { patients, setPatients, alerts, setAlerts } = usePatients();
  const [vitals, setVitals] = useState<Record<number, any>>({});
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedVitals: Record<number, any> = {};
      const newAlerts: any[] = [];

      const updatedPatients = patients.map((p) => {
        const heartRate = Math.floor(Math.random() * 80) + 60;
        const oxygen = Math.floor(Math.random() * 15) + 85;
        const systolic = Math.floor(Math.random() * 30) + 100;
        const diastolic = Math.floor(Math.random() * 20) + 65;

        updatedVitals[p.id] = {
          heartRate,
          oxygen,
          systolic,
          diastolic,
          updatedAt: new Date().toLocaleTimeString(),
          bed: "ICU-" + (Math.floor(Math.random() * 20) + 1),
        };

        let newRisk: "Critical" | "Medium" | "Low";

        if (heartRate > 115 || oxygen < 92) {
          newRisk = "Critical";
        } else if (heartRate > 95) {
          newRisk = "Medium";
        } else {
          newRisk = "Low";
        }

        // 🔥 Create alert only if newly critical
        if (newRisk === "Critical" && p.risk !== "Critical") {
          newAlerts.push({
            id: Date.now() + Math.random(),
            patientId: p.id,
            message: `${p.name} entered critical condition`,
            severity: "High",
            timestamp: new Date().toLocaleString(),
            resolved: false,
          });
        }

        return { ...p, risk: newRisk };
      });

      setVitals(updatedVitals);
      setPatients(updatedPatients);

      // 🔥 Add alerts separately
      if (newAlerts.length > 0) {
        setAlerts((prev) => [...prev, ...newAlerts]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [patients]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ICU Monitor Wall</h1>
        <p className="text-gray-500">
          Intelligent real-time patient monitoring
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {patients.map((patient) => {
          const data = vitals[patient.id];
          if (!data) return null;

          const isCritical = data.heartRate > 115 || data.oxygen < 92;
          const isWarning = data.heartRate > 95 || data.oxygen < 95;

          const severityLevel = isCritical ? 90 : isWarning ? 60 : 30;

          return (
            <div
              key={patient.id}
              className={`rounded-2xl p-6 shadow-xl border transition-all duration-300 ${
                isCritical
                  ? "bg-red-50 border-red-400"
                  : isWarning
                    ? "bg-yellow-50 border-yellow-400"
                    : "bg-white border-gray-200"
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {patient.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    ID: {patient.id} • Age: {patient.age}
                  </p>
                  <p className="text-xs text-gray-400">
                    {patient.department} • Bed {data.bed}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      isCritical
                        ? "bg-red-600 text-white animate-pulse"
                        : isWarning
                          ? "bg-yellow-400 text-black"
                          : "bg-green-500 text-white"
                    }`}
                  >
                    {isCritical ? "CRITICAL" : isWarning ? "WARNING" : "STABLE"}
                  </span>

                  <span className="text-xs text-gray-400">
                    Updated {data.updatedAt}
                  </span>
                </div>
              </div>

              {/* Vitals */}
              <div className="grid grid-cols-2 gap-4">
                <Vital
                  label="Heart Rate"
                  value={`${data.heartRate} bpm`}
                  alert={data.heartRate > 115}
                />
                <Vital
                  label="Oxygen"
                  value={`${data.oxygen}%`}
                  alert={data.oxygen < 92}
                />
                <Vital
                  label="Blood Pressure"
                  value={`${data.systolic}/${data.diastolic}`}
                  alert={data.systolic > 130}
                />
                <Vital
                  label="Status"
                  value={patient.status}
                  alert={patient.status === "Admitted"}
                />
              </div>

              {/* Severity Bar */}
              <div className="mt-5">
                <p className="text-xs text-gray-500 mb-1">Risk Severity</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isCritical
                        ? "bg-red-500"
                        : isWarning
                          ? "bg-yellow-400"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${severityLevel}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Vital({
  label,
  value,
  alert,
}: {
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 transition-all ${
        alert ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-900"
      }`}
    >
      <p className="text-xs opacity-70">{label}</p>
      <p className="font-semibold text-lg">{value}</p>
    </div>
  );
}
