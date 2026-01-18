"use client";
import ProtectedRoute from "@/app/components/protectedroutes";

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["admin", "sales"]}>{children}</ProtectedRoute>;
}
