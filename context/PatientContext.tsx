"use client";

import { activityService } from "@/services/activityService";
import { createActivityLog } from "@/engine/activityEngine";
import { useAuth } from "@/context/AuthContext";
import { evaluatePatientRisk } from "@/engine/alertEngine";
import { createContext, useContext, useEffect, useState } from "react";
import { Patient, Severity } from "@/types/patient";
import { Alert } from "@/types/alert";
import { patientService } from "@/services/patientService";
import { alertService } from "@/services/alertService";

export type PatientContextType = {
  patients: Patient[];
  alerts: Alert[];
  loading: boolean;
  addPatient: (patient: Patient) => Promise<void>;
  updatePatient: (patient: Patient) => Promise<void>;
  deletePatient: (id: number) => Promise<void>;
  resolveAlert: (id: number) => Promise<void>;
};

const PatientContext = createContext<PatientContextType | null>(null);

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  /* ===============================
     LOAD INITIAL DATA
  =============================== */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const storedPatients = await patientService.getAll();
      const storedAlerts = await alertService.getAll();

      setPatients(storedPatients);
      setAlerts(storedAlerts);

      setLoading(false);
    };

    loadData();
  }, []);

  /* ===============================
     ADD PATIENT
  =============================== */
  const addPatient = async (patient: Patient) => {
    await patientService.create(patient);

    const updatedPatients = await patientService.getAll();
    const existingAlerts = await alertService.getAll();

    const newAlert = evaluatePatientRisk(patient, existingAlerts);

    if (newAlert) {
      await alertService.create(newAlert);
    }

    const updatedAlerts = await alertService.getAll();

    setPatients(updatedPatients);
    setAlerts(updatedAlerts);

    if (user) {
      const log = createActivityLog(
        "PATIENT_CREATED",
        `Patient ${patient.name} created`,
        user.name,
      );

      await activityService.create(log);
    }
  };

  /* ===============================
     UPDATE PATIENT
  =============================== */
  const updatePatient = async (updatedPatient: Patient) => {
    await patientService.update(updatedPatient);

    const updatedPatients = await patientService.getAll();
    const existingAlerts = await alertService.getAll();

    const newAlert = evaluatePatientRisk(updatedPatient, existingAlerts);

    if (newAlert) {
      await alertService.create(newAlert);
    }

    const updatedAlerts = await alertService.getAll();

    setPatients(updatedPatients);
    setAlerts(updatedAlerts);

    if (user) {
      const log = createActivityLog(
        "PATIENT_UPDATED",
        `Patient ${updatedPatient.name} updated`,
        user.name,
      );

      await activityService.create(log);
    }
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

    if (user) {
      const log = createActivityLog(
        "PATIENT_DELETED",
        `Patient with ID ${id} deleted`,
        user.name,
      );

      await activityService.create(log);
    }
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

    if (user) {
      const log = createActivityLog(
        "ALERT_RESOLVED",
        `Alert with ID ${id} resolved`,
        user.name,
      );

      await activityService.create(log);
    }
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        alerts,
        loading,
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
