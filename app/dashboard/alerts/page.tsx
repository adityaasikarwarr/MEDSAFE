"use client";

import { usePatients } from "@/context/PatientContext";
import { checkMedicationInteractions } from "@/utils/medicationRules";
import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

type AlertType = "Risk" | "Medication";

type AlertItem = {
  id: number;
  patientId: number;
  message: string;
  severity: "High" | "Medium";
  type: AlertType;
  resolved: boolean;
  timestamp: string;
};

export default function AlertsPage() {
  const { patients } = usePatients();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [filter, setFilter] = useState<"All" | "High" | "Risk" | "Medication">(
    "All",
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    const generatedAlerts: AlertItem[] = [];

    patients.forEach((p) => {
      // Risk Alert
      if (p.risk === "Critical") {
        generatedAlerts.push({
          id: Date.now() + Math.random(),
          patientId: p.id,
          message: `${p.name} is in critical condition`,
          severity: "High",
          type: "Risk",
          resolved: false,
          timestamp: new Date().toLocaleString(),
        });
      }

      // Medication Alert
      if (p.medications && p.medications.length > 0) {
        const medWarnings = checkMedicationInteractions(p.medications);

        medWarnings.forEach((warning) => {
          generatedAlerts.push({
            id: Date.now() + Math.random(),
            patientId: p.id,
            message: `${p.name}: ${warning}`,
            severity: "High",
            type: "Medication",
            resolved: false,
            timestamp: new Date().toLocaleString(),
          });
        });
      }
    });

    setAlerts(generatedAlerts);
  }, [patients]);

  const resolveAlert = (id: number) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)),
    );
  };

  const filteredAlerts = alerts
    .filter((a) => !a.resolved)
    .filter((a) => {
      if (filter === "All") return true;
      if (filter === "High") return a.severity === "High";
      return a.type === filter;
    })
    .filter((a) => a.message.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clinical Alerts</h1>
        <p className="text-sm text-gray-500">
          Monitor safety and medication risks
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        {["All", "High", "Risk", "Medication"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-full text-sm ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {f}
          </button>
        ))}

        <input
          type="text"
          placeholder="Search alerts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-full text-sm"
        />
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between"
            >
              <div>
                <p className="font-semibold text-gray-900">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs bg-red-500 text-white px-3 py-1 rounded-full">
                  {alert.type}
                </span>

                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="text-green-600 hover:text-green-800"
                >
                  <CheckCircle size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-6 rounded-xl text-gray-500 shadow-sm border">
            No matching alerts.
          </div>
        )}
      </div>
    </div>
  );
}
