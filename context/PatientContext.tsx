"use client";

import { createContext, useContext, useState, useEffect } from "react";

type RiskType = "Critical" | "Medium" | "Low";

type Patient = {
  id: number;
  name: string;
  age: number;
  department: string;
  risk: "Critical" | "Medium" | "Low";
  status: string;
  medications?: string[];
};

type Alert = {
  id: number;
  patientId: number;
  message: string;
  severity: "High" | "Medium";
  timestamp: string;
  resolved: boolean;
};

type PatientContextType = {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
};

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: React.ReactNode }) {
  // 🔥 Load from localStorage on first render
  const [patients, setPatients] = useState<Patient[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("patients");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const [alerts, setAlerts] = useState<Alert[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("alerts");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // 🔥 Save patients whenever they change
  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  // 🔥 Save alerts whenever they change
  useEffect(() => {
    localStorage.setItem("alerts", JSON.stringify(alerts));
  }, [alerts]);

  return (
    <PatientContext.Provider
      value={{ patients, setPatients, alerts, setAlerts }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatients must be used within PatientProvider");
  }
  return context;
}
