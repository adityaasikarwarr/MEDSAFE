export type Role = "ADMIN" | "DOCTOR" | "NURSE";
export interface Permissions {
  canViewPatients: boolean;
  canEditPatients: boolean;
  canDeletePatients: boolean;

  canViewAlerts: boolean;
  canResolveAlerts: boolean;

  canAccessSettings: boolean;

  canViewActivity: boolean;
}