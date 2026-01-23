"use client";

import { ReactNode } from "react";
import ProtectedRoute from "../../app/utiis/protectedroutes";

interface SalesLayoutProps {
  children: ReactNode;
}

export default function SalesLayout({ children }: SalesLayoutProps) {
  return <ProtectedRoute allowedRoles={["saler"]}>{children}</ProtectedRoute>;
}
