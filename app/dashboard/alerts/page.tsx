"use client";

import { usePatients } from "@/context/PatientContext";
import { useState } from "react";

export default function AlertsPage() {
  const { alerts, resolveAlert } = usePatients();

  const [filter, setFilter] = useState<"All" | "Active" | "Resolved">("All");

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "Active") return !alert.resolved;
    if (filter === "Resolved") return alert.resolved;
    return true;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clinical Alerts</h1>
        <p className="text-sm text-gray-500">
          Monitor patient safety notifications
        </p>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex gap-3">
        {["All", "Active", "Resolved"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            className={`px-4 py-2 rounded-full text-sm transition ${
              filter === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ALERT LIST */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white border rounded-xl p-6 text-center text-gray-500">
            No matching alerts.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white border rounded-xl p-6 shadow-sm ${
                alert.severity === "Critical"
                  ? "border-red-400"
                  : alert.severity === "High"
                    ? "border-orange-400"
                    : alert.severity === "Medium"
                      ? "border-yellow-400"
                      : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>

                {!alert.resolved && (
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>

              <div className="mt-3">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold ${
                    alert.severity === "Critical"
                      ? "bg-red-100 text-red-600"
                      : alert.severity === "High"
                        ? "bg-orange-100 text-orange-600"
                        : alert.severity === "Medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {alert.severity}
                </span>

                {alert.resolved && (
                  <span className="ml-3 px-3 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                    Resolved
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
