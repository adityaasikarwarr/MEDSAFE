"use client";

import { usePatients } from "@/context/PatientContext";

type Alert = {
  id: number;
  message: string;
  severity: "High" | "Medium";
};

export default function AlertsPage() {
  const { patients } = usePatients();

  // 🔥 Generate alerts directly from context
  const alerts: Alert[] = patients
    .filter((p) => p.risk === "Critical")
    .map((p) => ({
      id: p.id,
      message: `${p.name} is in critical condition (${p.department})`,
      severity: p.status === "Admitted" ? "High" : "Medium",
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
        <p className="text-gray-500">Auto-generated safety alerts</p>
      </div>

      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-xl p-6 shadow border-l-4 ${
                alert.severity === "High"
                  ? "border-red-500"
                  : "border-yellow-500"
              }`}
            >
              <p className="font-semibold text-gray-900">{alert.message}</p>
              <p
                className={`text-sm mt-1 ${
                  alert.severity === "High" ? "text-red-600" : "text-yellow-600"
                }`}
              >
                {alert.severity} Priority
              </p>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-6 shadow text-gray-500">
            No active alerts.
          </div>
        )}
      </div>
    </div>
  );
}
