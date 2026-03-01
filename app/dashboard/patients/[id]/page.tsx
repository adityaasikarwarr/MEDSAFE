"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { patientService } from "@/services/patientService";
import { Patient } from "@/types/patient";

export default function PatientDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);

  const [activity] = useState([
    { id: 1, message: "Vitals updated", time: "2 min ago" },
    { id: 2, message: "Medication added", time: "10 min ago" },
    { id: 3, message: "Risk recalculated", time: "15 min ago" },
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function load() {
      const data = await patientService.getPatientById(id);
      if (data) setPatient(data);
    }

    if (id) {
      load();
      interval = setInterval(load, 5000);
    }

    return () => clearInterval(interval);
  }, [id]);

  if (!patient) {
    return <div className="p-6">Loading patient...</div>;
  }

  const getRiskStyle = (risk: string) => {
    switch (risk) {
      case "LOW":
        return "bg-green-100 text-green-700";
      case "MODERATE":
        return "bg-yellow-100 text-yellow-700";
      case "HIGH":
        return "bg-orange-100 text-orange-700";
      case "CRITICAL":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getVitalColor = (type: "hr" | "o2") => {
    if (type === "hr") {
      if (patient.vitals.hr > 120 || patient.vitals.hr < 50)
        return "text-red-600";
      return "text-green-600";
    }

    if (type === "o2") {
      if (patient.vitals.o2 < 92) return "text-red-600";
      return "text-green-600";
    }

    return "";
  };

  return (
    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">

      {/* LEFT SIDE (2 Columns) */}
      <div className="space-y-6 lg:col-span-2">

        {/* Profile */}
        <div className="p-6 bg-white shadow dark:bg-zinc-900 rounded-2xl">
          <h1 className="text-2xl font-bold">{patient.name}</h1>
          <p className="text-sm text-muted-foreground">
            ICU Bed: {patient.icuBed}
          </p>
          <p className="text-sm text-muted-foreground">
            Doctor: {patient.assignedDoctor}
          </p>
        </div>

        {/* Diagnosis */}
        <div className="p-6 bg-white shadow dark:bg-zinc-900 rounded-2xl">
          <h2 className="mb-2 font-semibold">Diagnosis</h2>
          <p>{patient.diagnosis}</p>
        </div>

        {/* Vitals */}
        <div className="p-6 bg-white shadow dark:bg-zinc-900 rounded-2xl">
          <h2 className="mb-4 font-semibold">Vitals</h2>

          <div className="grid grid-cols-3 gap-6">

            <div>
              <p className="text-sm text-muted-foreground">HR</p>
              <p className={`text-xl font-semibold ${getVitalColor("hr")}`}>
                {patient.vitals.hr}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">O2</p>
              <p className={`text-xl font-semibold ${getVitalColor("o2")}`}>
                {patient.vitals.o2}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">BP</p>
              <p className="text-xl font-semibold">
                {patient.vitals.bp}
              </p>
            </div>

          </div>
        </div>

        {/* Risk */}
        <div className="p-6 bg-white shadow dark:bg-zinc-900 rounded-2xl">
          <h2 className="mb-4 font-semibold">Risk Status</h2>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${getRiskStyle(
              patient.riskLevel
            )}`}
          >
            {patient.riskLevel}
          </span>
        </div>

      </div>

      {/* RIGHT SIDE (1 Column) */}
      <div className="space-y-6">

        {/* Medications */}
        <div className="p-6 bg-white shadow dark:bg-zinc-900 rounded-2xl">
          <h2 className="mb-4 font-semibold">Medications</h2>

          {patient.medications.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No medications assigned
            </p>
          )}

          {patient.medications.map((med) => (
            <div key={med.id} className="p-3 mb-3 border rounded-lg">
              <p className="font-medium">{med.name}</p>
              <p className="text-sm text-muted-foreground">
                {med.dosage} • {med.frequency}
              </p>
            </div>
          ))}
        </div>

        {/* Activity Timeline */}
        <div className="p-6 bg-white shadow dark:bg-zinc-900 rounded-2xl">
          <h2 className="mb-4 font-semibold">Activity Timeline</h2>

          <div className="space-y-4">
            {activity.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">{item.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}