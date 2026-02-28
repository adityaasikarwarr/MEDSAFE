import { Severity } from "./patient";

export interface Alert {
  id: number;
  patientId: number;
  message: string;
  severity: Severity;
  timestamp: string;
  resolved: boolean;
}