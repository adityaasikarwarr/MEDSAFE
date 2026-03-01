export type Severity = "Low" | "Medium" | "High" | "Critical";

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;

  department: string;
  diagnosis: string;

  status: string;
  risk: Severity;

  medications: string[];

  vitals: {
    hr: number;
    o2: number;
    bp: string;
  };
}