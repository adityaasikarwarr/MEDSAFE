"use client";

import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  allow: ("ADMIN" | "DOCTOR" | "NURSE")[];
  children: ReactNode;
}

export default function RoleGuard({ allow, children }: Props) {
  const { user } = useAuth();

  if (!user || !allow.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
