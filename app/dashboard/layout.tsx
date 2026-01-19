"use client";

import ProtectedRoute from "@/app/components/protectedroutes";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <ProtectedRoute allowedRoles={["admin", "saler"]}>{children}</ProtectedRoute>;
}
