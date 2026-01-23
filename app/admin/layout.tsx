// ("use client");

// import ProtectedRoute from "@/app/components/protectedroutes";

// interface DashboardLayoutProps {
//   children: React.ReactNode;
// }

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
//   return <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>;
// }
"use client";
import { ReactNode } from "react";
import ProtectedRoute from "../../app/utiis/protectedroutes";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>;
}
