import { Role } from "@/types/roles";

export const permissions = {
  Admin: {
    canEditPatient: true,
    canDeletePatient: true,
    canViewActivity: true,
    canAccessSettings: true,
  },
  Doctor: {
    canEditPatient: true,
    canDeletePatient: false,
    canViewActivity: false,
    canAccessSettings: false,
  },
  Nurse: {
    canEditPatient: false,
    canDeletePatient: false,
    canViewActivity: false,
    canAccessSettings: false,
  },
};

export function getPermissions(role: Role) {
  return permissions[role];
}