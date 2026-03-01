"use client";

import { Patient } from "@/types/patient";

const STORAGE_KEY = "patients";

function getStorage(): Patient[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function setStorage(data: Patient[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const patientService = {
  async getAll(): Promise<Patient[]> {
    return getStorage();
  },

 async getPatientById(id: string) {
  const patients = await this.getAll();
  return patients.find((p) => String(p.id) === String(id));
},

  async create(patient: Patient): Promise<void> {
    const patients = getStorage();
    setStorage([...patients, patient]);
  },

  async update(updated: Patient): Promise<void> {
    const patients = getStorage();
    const updatedList = patients.map((p) =>
      p.id === updated.id ? updated : p
    );
    setStorage(updatedList);
  },

  async delete(id: string): Promise<void> {
    const patients = getStorage();
    const filtered = patients.filter((p) => p.id !== id);
    setStorage(filtered);
  },
};