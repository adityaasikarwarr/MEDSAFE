"use client";

import { useEffect, useState } from "react";

type RiskType = "Critical" | "Medium" | "Low";

type Patient = {
  id: number;
  name: string;
  age: number;
  department: string;
  risk: RiskType;
  status: string;
};

type Alert = {
  id: number;
  message: string;
  severity: "High" | "Medium";
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const storedPatients = localStorage.getItem("patients");
    if (storedPatients) {
      const patients: Patient[] = JSON.parse(storedPatients);

      const generatedAlerts: Alert[] = patients
        .filter((p) => p.risk === "Critical")
        .map((p) => ({
          id: p.id,
          message: `${p.name} is in critical condition (${p.department})`,
          severity: p.status === "Admitted" ? "High" : "Medium",
        }));

      setAlerts(generatedAlerts);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
        <p className="text-gray-500">
          Auto-generated safety alerts
        </p>
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
              <p className="font-semibold text-gray-900">
                {alert.message}
              </p>
              <p
                className={`text-sm mt-1 ${
                  alert.severity === "High"
                    ? "text-red-600"
                    : "text-yellow-600"
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