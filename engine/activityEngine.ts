import { ActivityLog, ActivityType } from "@/types/activity";

export function createActivityLog(
  type: ActivityType,
  message: string,
  performedBy: string
): ActivityLog {
  return {
    id: Date.now(),
    type,
    message,
    timestamp: new Date().toISOString(),
    performedBy,
  };
}