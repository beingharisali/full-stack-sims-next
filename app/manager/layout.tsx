"use client";
import { ReactNode } from "react";
import ProtectedRoute from "../utiis/protectedroutes";

interface Props {
  children: ReactNode;
}

export default function ManagerLayout({ children }: Props) {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div>{children}</div>
    </ProtectedRoute>
  );
}
