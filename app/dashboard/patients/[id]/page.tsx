"use client";

import { useParams, useRouter } from "next/navigation";
import { usePatients } from "@/context/PatientContext";
import { useEffect, useState } from "react";
import { Patient } from "@/types/patient";
import { motion } from "framer-motion";

export default function PatientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { patients, updatePatient, alerts } = usePatients();

  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const found = patients.find((p) => String(p.id) === String(id));
    if (found) setPatient(found);
  }, [patients, id]);

  if (!patient) {
    return <div className="p-8 text-gray-500">Patient not found.</div>;
  }

  const relatedAlerts = alerts.filter((a) => a.message.includes(patient.name));

  async function dischargePatient() {
    await updatePatient({
      ...patient,
      status: "Discharged",
    });
    router.push("/dashboard/patients");
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
          <p className="text-gray-500">{patient.department}</p>
        </div>

        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
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

      {/* Profile Info */}
      <div className="grid grid-cols-3 gap-6 p-6 bg-white border shadow rounded-2xl">
        <Info label="Age" value={patient.age} />
        <Info label="Gender" value={patient.gender} />
        <Info label="Status" value={patient.status} />
        <Info label="Diagnosis" value={patient.diagnosis} />
      </div>

      {/* Current Vitals */}
      <div className="p-6 space-y-4 bg-white border shadow rounded-2xl">
        <h2 className="text-lg font-semibold text-gray-800">Current Vitals</h2>

        <div className="grid grid-cols-3 gap-6">
          <Vital label="Heart Rate" value={`${patient.vitals.hr} bpm`} />
          <Vital label="Oxygen" value={`${patient.vitals.o2}%`} />
          <Vital label="Blood Pressure" value={patient.vitals.bp} />
        </div>
      </div>

      {/* Alerts */}
      <div className="p-6 space-y-4 bg-white border shadow rounded-2xl">
        <h2 className="text-lg font-semibold text-gray-800">Related Alerts</h2>

        {relatedAlerts.length === 0 && (
          <p className="text-sm text-gray-500">No alerts for this patient.</p>
        )}

        {relatedAlerts.map((alert) => (
          <div key={alert.id} className="py-2 pl-4 border-l-4 border-red-500">
            <p className="text-sm font-medium text-gray-800">{alert.message}</p>
            <p className="text-xs text-gray-500">
              {new Date(alert.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Discharge */}
      {patient.status !== "Discharged" && (
        <button
          onClick={dischargePatient}
          className="px-6 py-2 text-white transition bg-red-600 rounded-lg hover:bg-red-700"
        >
          Discharge Patient
        </button>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}

function Vital({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="p-4 border bg-gray-50 rounded-xl"
    >
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </motion.div>
  );
}
