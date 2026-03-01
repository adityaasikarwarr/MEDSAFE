"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { patientService } from "@/services/patientService";
import { Patient } from "@/types/patient";

export default function PatientDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    async function load() {
      const data = await patientService.getPatientById(id);
      if (data) setPatient(data);
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

  const getVitalColor = (type: "hr" | "o2") => {
    if (!patient) return "";

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
    <div className="p-6 space-y-6">
      <div className="p-6 bg-white shadow dark:bg-zinc-900 rounded-2xl">
        <h1 className="text-2xl font-bold">{patient.name}</h1>
        <p>ICU Bed: {patient.icuBed}</p>
        <p>Doctor: {patient.assignedDoctor}</p>
      </div>

      <div className="p-6 bg-white shadow dark:bg-zinc-900 rounded-2xl">
        <h2 className="mb-2 font-semibold">Diagnosis</h2>
        <p>{patient.diagnosis}</p>
      </div>

      <div className="p-6 bg-white shadow dark:bg-zinc-900 rounded-2xl">
        <h2 className="mb-4 font-semibold">Vitals</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm">HR</p>
            <p className={`text-xl font-semibold ${getVitalColor("hr")}`}>
              {patient.vitals.hr}
            </p>
          </div>
          <div>
            <p className="text-sm">O2</p>
            <p className={`text-xl font-semibold ${getVitalColor("o2")}`}>
              {patient.vitals.o2}
            </p>
          </div>
          <div>
            <p className="text-sm">BP</p>
            <p className="text-xl font-semibold">{patient.vitals.bp}</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white shadow dark:bg-zinc-900 rounded-2xl">
        <h2 className="mb-2 font-semibold">Risk</h2>
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${getRiskStyle(
            patient.riskLevel,
          )}`}
        >
          {patient.riskLevel}
        </span>
      </div>

      <div className="p-6 bg-white shadow dark:bg-zinc-900 rounded-2xl">
        <h2 className="mb-4 font-semibold">Medications</h2>
        {patient.medications.map((med) => (
          <div key={med.id} className="p-3 mb-2 border rounded-lg">
            <p className="font-medium">{med.name}</p>
            <p className="text-sm">
              {med.dosage} • {med.frequency}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
