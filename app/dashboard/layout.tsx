"use client";

import ProtectedRoute from "@/app/components/protectedroutes";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>;
}
