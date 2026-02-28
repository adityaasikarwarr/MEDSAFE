"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ActivityLog } from "@/types/activity";
import { activityService } from "@/services/activityService";

type ActivityContextType = {
  logs: ActivityLog[];
};

const ActivityContext = createContext<ActivityContextType | null>(null);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const load = async () => {
      const stored = await activityService.getAll();
      setLogs(stored);
    };

    load();
  }, []);

  return (
    <ActivityContext.Provider value={{ logs }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (!context)
    throw new Error("useActivity must be used inside ActivityProvider");
  return context;
}
