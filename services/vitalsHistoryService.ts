const STORAGE_KEY = "vitalsHistory";

export type VitalsEntry = {
  patientId: number;
  hr: number;
  o2: number;
  bp: string;
  timestamp: number;
};

export const vitalsHistoryService = {
  async getAll(): Promise<VitalsEntry[]> {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  async getByPatient(patientId: number): Promise<VitalsEntry[]> {
    const all = await this.getAll();
    return all.filter((v) => v.patientId === patientId);
  },

  async add(entry: VitalsEntry): Promise<void> {
    const all = await this.getAll();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...all, entry])
    );
  },
};