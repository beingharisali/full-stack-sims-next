"use client";

import ProtectedRoute from "../../components/protectedroutes";

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      {children}
    </ProtectedRoute>
  );
}
