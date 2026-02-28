import { Patient } from "@/types/patient";

const STORAGE_KEY = "patients";

export const patientService = {
  async getAll(): Promise<Patient[]> {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  async create(patient: Patient): Promise<void> {
    const patients = await this.getAll();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...patients, patient])
    );
  },

  async update(updated: Patient): Promise<void> {
    const patients = await this.getAll();
    const updatedList = patients.map((p) =>
      p.id === updated.id ? updated : p
    );
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedList)
    );
  },

  async delete(id: number): Promise<void> {
    const patients = await this.getAll();
    const filtered = patients.filter((p) => p.id !== id);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(filtered)
    );
  },
};