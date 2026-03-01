export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
export type Status = "ACTIVE" | "RESOLVED";

export interface Patient {
  id: string;
  name: string;
  icuBed: string;
  diagnosis: string;
  assignedDoctor: string;
  riskLevel: RiskLevel;
  status: Status;

  vitals: {
    hr: number;
    o2: number;
    bp: string;
  };

  medications: {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
  }[];
}