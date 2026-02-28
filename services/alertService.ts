import { Alert } from "@/types/alert";

const STORAGE_KEY = "alerts";

export const alertService = {
  async getAll(): Promise<Alert[]> {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  async create(alert: Alert): Promise<void> {
    const alerts = await this.getAll();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...alerts, alert])
    );
  },

  async update(updated: Alert): Promise<void> {
    const alerts = await this.getAll();
    const updatedList = alerts.map((a) =>
      a.id === updated.id ? updated : a
    );
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedList)
    );
  },

  async deleteByPatient(patientId: number): Promise<void> {
    const alerts = await this.getAll();
    const filtered = alerts.filter(
      (a) => a.patientId !== patientId
    );
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(filtered)
    );
  },
};