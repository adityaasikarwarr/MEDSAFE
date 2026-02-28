export type Severity = "Low" | "Medium" | "High" | "Critical";

export interface Patient {
  id: number;
  name: string;
  age: number;
  department: string;
  risk: Severity;
  status: string;
  medications?: string[];
  bedNumber?: string;
  admittedAt?: string;
}