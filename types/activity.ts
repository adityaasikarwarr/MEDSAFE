export type ActivityType =
  | "PATIENT_CREATED"
  | "PATIENT_UPDATED"
  | "PATIENT_DELETED"
  | "ALERT_GENERATED"
  | "ALERT_RESOLVED"
  | "USER_LOGIN"
  | "USER_LOGOUT";

export interface ActivityLog {
  id: number;
  type: ActivityType;
  message: string;
  timestamp: string;
  performedBy: string;
}