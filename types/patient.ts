export interface Vitals {
  hr: number;
  o2: number;
  bp: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

export type RiskLevel =
  | "LOW"
  | "MODERATE"
  | "HIGH"
  | "CRITICAL";

export interface Patient {
  id: string;
  name: string;
  icuBed: string;
  diagnosis: string;
  assignedDoctor: string;
  vitals: Vitals;
  riskLevel: RiskLevel;
  medications: Medication[];
}