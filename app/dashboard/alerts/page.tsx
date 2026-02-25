"use client";

import { usePatients } from "@/context/PatientContext";
import { checkMedicationInteractions } from "@/utils/medicationRules";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

type AlertItem = {
  id: number;
  message: string;
  severity: "High" | "Medium";
  timestamp: string;
};

export default function AlertsPage() {
  const { patients } = usePatients();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    const generatedAlerts: AlertItem[] = [];

    patients.forEach((p) => {
      // 🔴 Critical Risk Alert
      if (p.risk === "Critical") {
        generatedAlerts.push({
          id: Date.now() + Math.random(),
          message: `${p.name} is in critical condition (${p.department})`,
          severity: "High",
          timestamp: new Date().toLocaleString(),
        });
      }

      // 💊 Medication Interaction Alerts
      if (p.medications && p.medications.length > 0) {
        const medWarnings = checkMedicationInteractions(p.medications);

        medWarnings.forEach((warning) => {
          generatedAlerts.push({
            id: Date.now() + Math.random(),
            message: `${p.name}: ${warning}`,
            severity: "High",
            timestamp: new Date().toLocaleString(),
          });
        });
      }
    });

    setAlerts(generatedAlerts);
  }, [patients]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clinical Alerts</h1>
        <p className="text-sm text-gray-500">
          Real-time risk & medication safety notifications
        </p>
      </div>

      {/* Alert List */}
      <div className="space-y-5">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start"
            >
              <div className="flex gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    alert.severity === "High"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  <AlertTriangle size={20} />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {alert.timestamp}
                  </p>
                </div>
              </div>

              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  alert.severity === "High"
                    ? "bg-red-500 text-white"
                    : "bg-yellow-400 text-white"
                }`}
              >
                {alert.severity} Priority
              </span>
            </div>
          ))
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-gray-500">
            No active alerts.
          </div>
        )}
      </div>
    </div>
  );
}
