"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSettings } from "@/context/SettingsContext";

/* =========================
   TYPES
========================= */

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
  resolveAlert: (id: number) => void;
};

/* =========================
   CONTEXT
========================= */

const PatientContext = createContext<PatientContextType | null>(null);

/* =========================
   PROVIDER
========================= */

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  /* =========================
     LOAD FROM STORAGE
  ========================= */
  useEffect(() => {
    const storedPatients = localStorage.getItem("medsafe-patients");
    const storedAlerts = localStorage.getItem("medsafe-alerts");

    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    }

    if (storedAlerts) {
      setAlerts(JSON.parse(storedAlerts));
    }
  }, []);

  /* =========================
     SAVE TO STORAGE
  ========================= */
  useEffect(() => {
    localStorage.setItem("medsafe-patients", JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem("medsafe-alerts", JSON.stringify(alerts));
  }, [alerts]);

  /* =========================
     CLEAN ORPHAN ALERTS
  ========================= */
  useEffect(() => {
    setAlerts((prev) =>
      prev.filter((alert) => patients.some((p) => p.id === alert.patientId)),
    );
  }, [patients]);

  /* =========================
     CREATE ALERT
  ========================= */
  const createAlert = ({
    patientId,
    message,
    severity,
  }: {
    patientId: number;
    message: string;
    severity: Severity;
  }) => {
    if (!settings.notificationsEnabled) return;

    setAlerts((prev) => {
      const alreadyExists = prev.some(
        (a) =>
          a.patientId === patientId && !a.resolved && a.severity === severity,
      );

      if (alreadyExists) return prev;

      const newAlert: Alert = {
        id: Date.now(),
        patientId,
        message,
        severity,
        timestamp: new Date().toISOString(),
        resolved: false,
      };

      return [...prev, newAlert];
    });
  };

  /* =========================
     ADD PATIENT
  ========================= */
  const addPatient = (patient: Patient) => {
    setPatients((prev) => [...prev, patient]);

    if (patient.risk === "Critical") {
      createAlert({
        patientId: patient.id,
        message: `${patient.name} entered critical condition`,
        severity: "Critical",
      });
    }
  };

  /* =========================
     UPDATE PATIENT
  ========================= */
  const updatePatient = (updatedPatient: Patient) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== updatedPatient.id) return p;

        /* New critical event */
        if (p.risk !== "Critical" && updatedPatient.risk === "Critical") {
          createAlert({
            patientId: updatedPatient.id,
            message: `${updatedPatient.name} entered critical condition`,
            severity: "Critical",
          });
        }

        /* Auto resolve if enabled */
        if (
          settings.autoResolveAlerts &&
          p.risk === "Critical" &&
          updatedPatient.risk !== "Critical"
        ) {
          setAlerts((prevAlerts) =>
            prevAlerts.map((a) =>
              a.patientId === updatedPatient.id ? { ...a, resolved: true } : a,
            ),
          );
        }

        return updatedPatient;
      }),
    );
  };

  /* =========================
     DELETE PATIENT
  ========================= */
  const deletePatient = (id: number) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
    setAlerts((prev) => prev.filter((alert) => alert.patientId !== id));
  };

  /* =========================
     RESOLVE ALERT
  ========================= */
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
        resolveAlert,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function usePatients() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatients must be used within PatientProvider");
  }
  return context;
}
