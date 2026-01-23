"use client";
import { ReactNode } from "react";
import ProtectedRoute from "../utils/protectedroutes";

interface ManagerLayoutProps {
  children: ReactNode;
}

export default function ManagerLayout({ children }: ManagerLayoutProps) {
  return <ProtectedRoute allowedRoles={["manager"]}>{children}</ProtectedRoute>;
}
