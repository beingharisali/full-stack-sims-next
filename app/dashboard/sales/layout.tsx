"use client";
import ProtectedRoute from "../../components/protectedroutes";

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["admin", "sales"]}>
      {children}
    </ProtectedRoute>
  );
}
