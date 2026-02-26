"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type Severity = "Low" | "Medium" | "High" | "Critical";

export type Patient = {
  id: number;
  name: string;
  age: number;
  department: string;
  risk: Severity;
  status: string;
  medications?: string[];
};

export type Alert = {
  id: number;
  patientId: number;
  message: string;
  severity: Severity;
  timestamp: string;
  resolved: boolean;
};

type PatientContextType = {
  patients: Patient[];
  alerts: Alert[];
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: number) => void;
  createAlert: (data: {
    patientId: number;
    message: string;
    severity: Severity;
  }) => void;
  resolveAlert: (id: number) => void;
};

const PatientContext = createContext<PatientContextType | null>(null);

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Load from localStorage
  useEffect(() => {
    const storedPatients = localStorage.getItem("patients");
    const storedAlerts = localStorage.getItem("alerts");

    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    }

    if (storedAlerts) {
      setAlerts(JSON.parse(storedAlerts));
    }
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem("alerts", JSON.stringify(alerts));
  }, [alerts]);

  const addPatient = (patient: Patient) => {
    setPatients((prev) => [...prev, patient]);

    if (patient.risk === "Critical") {
      createAlert({
        patientId: patient.id,
        message: `${patient.name} is in critical condition`,
        severity: "Critical",
      });
    }
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)),
    );
  };

  const deletePatient = (id: number) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  const createAlert = ({
    patientId,
    message,
    severity,
  }: {
    patientId: number;
    message: string;
    severity: Severity;
  }) => {
    const newAlert: Alert = {
      id: Date.now(),
      patientId,
      message,
      severity,
      timestamp: new Date().toISOString(),
      resolved: false,
    };

    setAlerts((prev) => [...prev, newAlert]);
  };

  const resolveAlert = (id: number) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)),
    );
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        alerts,
        addPatient,
        updatePatient,
        deletePatient,
        createAlert,
        resolveAlert,
      }}
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
