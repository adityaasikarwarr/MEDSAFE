import { Role } from "@/types/roles";

/* =========================================================
   Permission Map
   ========================================================= */

type PermissionSet = {
  canEditPatient: boolean;
  canDeletePatient: boolean;
  canViewActivity: boolean;
  canAccessSettings: boolean;
};

/* =========================================================
   Permissions Database
   ========================================================= */

export const permissions: Record<Role, PermissionSet> = {
  ADMIN: {
    canEditPatient: true,
    canDeletePatient: true,
    canViewActivity: true,
    canAccessSettings: true,
  },

  DOCTOR: {
    canEditPatient: true,
    canDeletePatient: false,
    canViewActivity: false,
    canAccessSettings: false,
  },

  NURSE: {
    canEditPatient: false,
    canDeletePatient: false,
    canViewActivity: false,
    canAccessSettings: false,
  },

  
};

/* =========================================================
   Permission Getter
   ========================================================= */

export function getPermissions(role: Role) {
  return permissions[role] ?? permissions.NURSE;
}