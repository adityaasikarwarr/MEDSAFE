"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { patientService } from "@/services/patientService";
import { analyticsService } from "@/services/analyticsService";
import { Patient } from "@/types/patient";

import StateCard from "@/components/dashboard/StateCard";
import RoleGuard from "@/components/dashboard/RoleGuard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";

import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

export default function PatientDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await patientService.getPatientById(id);
      const vitalsHistory =
        await analyticsService.getPatientVitalsHistory(id);

      if (data) setPatient(data);
      setHistory(vitalsHistory);
    }

    if (id) load();
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

  return (
    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">

      {/* LEFT SIDE */}
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

          <RoleGuard allow={["ADMIN", "DOCTOR"]}>
            <button className="px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-lg">
              Edit Patient
            </button>
          </RoleGuard>
        </div>

        {/* Vitals using StateCard */}
        <div className="p-6 bg-white shadow dark:bg-zinc-900 rounded-2xl">
          <h2 className="mb-4 font-semibold">Vitals</h2>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <StateCard
              title="Heart Rate"
              value={patient.vitals.hr}
              unit="bpm"
            />

            <StateCard
              title="Oxygen"
              value={patient.vitals.o2}
              unit="%"
            />

            <StateCard
              title="Blood Pressure"
              value={patient.vitals.bp}
            />
          </div>

          {/* Mini Chart */}
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <Line
                  type="monotone"
                  dataKey="value"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
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

      {/* RIGHT SIDE */}
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

        {/* Activity Feed */}
        <ActivityFeed patientId={patient.id} />

      </div>

    </div>
  );
}