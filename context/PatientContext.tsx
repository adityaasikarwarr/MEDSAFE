"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type RiskType = "Critical" | "Medium" | "Low";

export type Patient = {
  id: number;
  name: string;
  age: number;
  department: string;
  risk: RiskType;
  status: string;
};

type PatientContextType = {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
};

const PatientContext = createContext<PatientContextType | null>(null);

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("patients");
    if (stored) {
      setPatients(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  return (
    <PatientContext.Provider value={{ patients, setPatients }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatients must be used inside PatientProvider");
  }
  return context;
}