"use client";

import { ReactNode } from "react";

/*
  TEMP VERSION:
  We assume current user role is stored in localStorage.
  Later you will connect this to authService or context.
*/

interface Props {
  allow: string[];
  children: ReactNode;
}

export default function RoleGuard({ allow, children }: Props) {
  // Temporary role fetch
  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;

  if (!role || !allow.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
