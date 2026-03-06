"use client";

import { usePatients } from "@/context/PatientContext";
import { checkMedicationInteractions } from "@/utils/medicationRules";
import { ShieldCheck } from "lucide-react";
import { useMemo } from "react";

type MedIssue = {
  patient: string;
  department: string;
  medications: string[];
  issue: string;
  severity: "Mild" | "Moderate" | "Severe";
};

export default function MedicationPage() {
  const { patients } = usePatients();

  /* ================= DETECT ISSUES ================= */

  const issues: MedIssue[] = useMemo(() => {
    const detected: MedIssue[] = [];

    patients.forEach((p) => {
      if (!p.medications || p.medications.length === 0) return;

      const interactions = checkMedicationInteractions(p.medications);

      interactions.forEach((interaction) => {
        detected.push({
          patient: p.name,
          department: p.department,
          medications: p.medications || [],
          issue: interaction,
          severity: "Severe",
        });
      });
    });

    return detected;
  }, [patients]);

  /* ================= STATS ================= */

  const totalPrescriptions = patients.filter(
    (p) => p.medications && p.medications.length > 0
  ).length;

  const safePatients = Math.max(totalPrescriptions - issues.length, 0);

  /* ================= UI ================= */

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Medication Safety Intelligence
        </h1>
        <p className="text-slate-500">
          Monitor drug interactions and prescription risks
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
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
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-slate-800">
            Interaction Analysis
          </h2>
        </div>

        {issues.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
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
                  <tr
                    key={index}
                    className="transition border-b hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium text-slate-900">
                      {item.patient}
                    </td>

                    <td className="p-4 text-slate-600">
                      {item.department}
                    </td>

                    <td className="p-4 text-slate-600">
                      {item.medications.join(", ")}
                    </td>

                    <td className="p-4 text-red-600">
                      {item.issue}
                    </td>

                    <td className="p-4">
                      <span className="px-3 py-1 text-xs text-white bg-red-500 rounded-full">
                        {item.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
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

/* ================= STAT CARD ================= */

function StatCard({
  label,
  value,
  color = "text-slate-900",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
      <p className="text-xs tracking-wide uppercase text-slate-500">
        {label}
      </p>

      <h2 className={`text-3xl font-bold mt-2 ${color}`}>
        {value}
      </h2>
    </div>
  );
}