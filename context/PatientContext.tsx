"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Patient, Severity } from "@/types/patient";
import { Alert } from "@/types/alert";
import { patientService } from "@/services/patientService";
import { alertService } from "@/services/alertService";

export type PatientContextType = {
  patients: Patient[];
  alerts: Alert[];
  addPatient: (patient: Patient) => Promise<void>;
  updatePatient: (patient: Patient) => Promise<void>;
  deletePatient: (id: number) => Promise<void>;
  resolveAlert: (id: number) => Promise<void>;
};

const PatientContext = createContext<PatientContextType | null>(null);

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  /* ===============================
     LOAD INITIAL DATA
  =============================== */
  useEffect(() => {
    const loadData = async () => {
      const storedPatients = await patientService.getAll();
      const storedAlerts = await alertService.getAll();
      setPatients(storedPatients);
      setAlerts(storedAlerts);
    };

    loadData();
  }, []);

  /* ===============================
     ADD PATIENT
  =============================== */
  const addPatient = async (patient: Patient) => {
    await patientService.create(patient);

    const updatedPatients = await patientService.getAll();
    setPatients(updatedPatients);
  };

  /* ===============================
     UPDATE PATIENT
  =============================== */
  const updatePatient = async (updatedPatient: Patient) => {
    await patientService.update(updatedPatient);

    const updatedPatients = await patientService.getAll();
    setPatients(updatedPatients);
  };

  /* ===============================
     DELETE PATIENT
  =============================== */
  const deletePatient = async (id: number) => {
    await patientService.delete(id);
    await alertService.deleteByPatient(id);

    const updatedPatients = await patientService.getAll();
    const updatedAlerts = await alertService.getAll();

    setPatients(updatedPatients);
    setAlerts(updatedAlerts);
  };

  /* ===============================
     RESOLVE ALERT
  =============================== */
  const resolveAlert = async (id: number) => {
    const existingAlerts = await alertService.getAll();

    const updatedAlerts = existingAlerts.map((alert) =>
      alert.id === id ? { ...alert, resolved: true } : alert,
    );

    localStorage.setItem("alerts", JSON.stringify(updatedAlerts));
    setAlerts(updatedAlerts);
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

/* ===============================
   HOOK
================================ */
export function usePatients() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatients must be used within PatientProvider");
  }
  return context;
}
