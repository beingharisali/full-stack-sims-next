"use client";
import ProtectedRoute from "@/app/components/protectedroutes";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["admin", "manager"]}>{children}</ProtectedRoute>;
}
