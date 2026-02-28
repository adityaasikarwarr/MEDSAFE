import { ActivityLog } from "@/types/activity";

const STORAGE_KEY = "activity-logs";

export const activityService = {
  async getAll(): Promise<ActivityLog[]> {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  async create(log: ActivityLog): Promise<void> {
    const logs = await this.getAll();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([log, ...logs])
    );
  },

  async clear(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  },
};