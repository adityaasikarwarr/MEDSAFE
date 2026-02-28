import { Patient } from "@/types/patient";
import { Alert } from "@/types/alert";

export function evaluatePatientRisk(
  patient: Patient,
  existingAlerts: Alert[]
): Alert | null {
  // Only trigger if critical
  if (patient.risk !== "Critical") return null;

  const alreadyExists = existingAlerts.some(
    (a) =>
      a.patientId === patient.id &&
      !a.resolved &&
      a.severity === "Critical"
  );

  if (alreadyExists) return null;

  return {
    id: Date.now(),
    patientId: patient.id,
    message: `${patient.name} entered critical condition`,
    severity: "Critical",
    timestamp: new Date().toISOString(),
    resolved: false,
  };
}