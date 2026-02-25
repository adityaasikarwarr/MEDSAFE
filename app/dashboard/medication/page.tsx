"use client";

import { usePatients } from "@/context/PatientContext";
import { checkMedicationInteractions } from "@/utils/medicationRules";
import { AlertTriangle, ShieldCheck } from "lucide-react";

type MedIssue = {
  patient: string;
  department: string;
  medications: string[];
  issue: string;
  severity: "Mild" | "Moderate" | "Severe";
};

export default function MedicationPage() {
  const { patients } = usePatients();

  const issues: MedIssue[] = [];

  patients.forEach((p) => {
    if (!p.medications || p.medications.length === 0) return;

    const interactions = checkMedicationInteractions(p.medications);

    interactions.forEach((interaction) => {
      issues.push({
        patient: p.name,
        department: p.department,
        medications: p.medications || [],
        issue: interaction,
        severity: "Severe", // can upgrade later
      });
    });
  });

  const totalPrescriptions = patients.filter(
    (p) => p.medications && p.medications.length > 0
  ).length;

  const safePatients = totalPrescriptions - issues.length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Medication Safety Intelligence
        </h1>
        <p className="text-sm text-gray-500">
          Monitor drug interactions and prescription risks
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          label="Patients on Medication"
          value={totalPrescriptions}
        />
        <StatCard
          label="Unsafe Interactions"
          value={issues.length}
          color="text-red-600"
        />
        <StatCard
          label="Safe Patients"
          value={safePatients}
          color="text-green-600"
        />
      </div>

      {/* Interaction Table */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="font-semibold text-gray-800">
            Interaction Analysis
          </h2>
        </div>

        {issues.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="p-4">Patient</th>
                <th className="p-4">Department</th>
                <th className="p-4">Medications</th>
                <th className="p-4">Interaction</th>
                <th className="p-4">Severity</th>
              </tr>
            </thead>

            <tbody>
              {issues.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">
                    {item.patient}
                  </td>
                  <td className="p-4">{item.department}</td>
                  <td className="p-4 text-sm">
                    {item.medications.join(", ")}
                  </td>
                  <td className="p-4 text-red-600 text-sm">
                    {item.issue}
                  </td>
                  <td className="p-4">
                    <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                      {item.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <ShieldCheck
              className="mx-auto mb-4 text-green-500"
              size={32}
            />
            No unsafe medication interactions detected.
          </div>
        )}
      </div>
    </div>
  );
}

/* Stat Card Component */
function StatCard({
  label,
  value,
  color = "text-gray-900",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
      <p className="text-xs text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <h2 className={`text-3xl font-bold mt-2 ${color}`}>
        {value}
      </h2>
    </div>
  );
}