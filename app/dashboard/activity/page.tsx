"use client";

import { useActivity } from "@/context/ActivityContext";

export default function ActivityPage() {
  const { logs } = useActivity();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Activity Logs</h1>

      <div className="overflow-hidden bg-white border shadow rounded-xl">
        {logs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No activity recorded.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="p-4 border-b hover:bg-gray-50">
              <div className="flex justify-between">
                <p className="font-medium text-gray-800">{log.message}</p>
                <span className="text-xs text-gray-400">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-500">By {log.performedBy}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
