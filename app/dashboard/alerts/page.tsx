"use client";

import { usePatients } from "@/context/PatientContext";

export default function AlertsPage() {
  const { alerts, setAlerts } = usePatients();

  const activeAlerts = alerts.filter((a) => !a.resolved);
  const historyAlerts = alerts.filter((a) => a.resolved);

  const resolveAlert = (id: number) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)),
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Alert Center</h1>
        <p className="text-gray-500">Active and historical safety alerts</p>
      </div>

      {/* Active Alerts */}
      <div>
        <h2 className="font-semibold mb-4 text-black">Active Alerts</h2>
        {activeAlerts.length > 0 ? (
          activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-xl p-6 shadow border-l-4 border-red-500 mb-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">{alert.message}</p>
                  <p className="text-sm text-gray-500">{alert.timestamp}</p>
                </div>

                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                >
                  Resolve
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No active alerts.</p>
        )}
      </div>

      {/* History */}
      <div>
        <h2 className="font-semibold mb-4 text-black">Resolved Alerts</h2>
        {historyAlerts.length > 0 ? (
          historyAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-gray-50 rounded-xl p-6 shadow border-l-4 border-gray-300 mb-4"
            >
              <p className="font-semibold text-gray-700">{alert.message}</p>
              <p className="text-sm text-gray-400">{alert.timestamp}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No resolved alerts yet.</p>
        )}
      </div>
    </div>
  );
}
