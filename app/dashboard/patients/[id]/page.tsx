"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { patientService } from "@/services/patientService";
import { Patient } from "@/types/patient";

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);

  const role =
    typeof window !== "undefined"
      ? localStorage.getItem("role")
      : null;

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    const data = await patientService.getPatientById(id);
    if (data) setPatient(data);
  }

  async function markResolved() {
    if (!patient) return;

    const updated = { ...patient, status: "RESOLVED" };
    await patientService.update(updated);
    load();
  }

  if (!patient) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">{patient.name}</h1>

      <p>Status: {patient.status}</p>
      <p>Diagnosis: {patient.diagnosis}</p>
      <p>Doctor: {patient.assignedDoctor}</p>

      <div className="p-4 border rounded-lg">
        <p>HR: {patient.vitals.hr}</p>
        <p>O2: {patient.vitals.o2}</p>
        <p>BP: {patient.vitals.bp}</p>
      </div>

      {role === "DOCTOR" && patient.status !== "RESOLVED" && (
        <button
          onClick={markResolved}
          className="px-4 py-2 text-white bg-green-600 rounded-lg"
        >
          Mark as Resolved
        </button>
      )}

      <button
        onClick={() => router.back()}
        className="px-4 py-2 text-white bg-gray-600 rounded-lg"
      >
        Back
      </button>
    </div>
  );
}