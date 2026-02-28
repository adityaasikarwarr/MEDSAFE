export interface RiskDistribution {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface DepartmentStat {
  department: string;
  patientCount: number;
}