"use client";

import { useEffect, useState } from "react";
import { activityService } from "@/services/activityService";

interface Props {
  patientId: string;
}

export default function ActivityFeed({ patientId }: Props) {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await activityService.getByPatient(patientId);
      setLogs(data);
    }

    load();
  }, [patientId]);

  return (
    <div className="p-6 bg-white shadow dark:bg-zinc-900 rounded-2xl">
      <h2 className="mb-4 font-semibold">Activity Timeline</h2>

      {logs.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No activity recorded
        </p>
      )}

      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-3">
            <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium">{log.message}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(log.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}