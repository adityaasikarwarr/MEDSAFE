export type Severity = "Low" | "Medium" | "High" | "Critical";

export type Patient = {
  id: number;
  name: string;
  age: number;
  department: string;

  diagnosis: string;
  bedNumber: string;

  heartRate: number;
  oxygenLevel: number;
  bloodPressure: string;

  risk: Severity;
  status: "Stable" | "Admitted" | "Critical";

  admittedAt: string;
  assignedDoctor: string;

  medications: string[];
};