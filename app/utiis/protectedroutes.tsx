"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children: ReactNode;
}

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");

    if (!userStr) {
      router.replace("/login");
      return;
    }

    const user = JSON.parse(userStr);
    const userRole = user.role;

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      router.replace("/unauthorized");
      return;
    }

    setLoading(false);
  }, [allowedRoles, router]);

  if (loading) return null;

  return <>{children}</>;
}
