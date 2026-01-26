"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user?.role;

    if (!role || !allowedRoles.includes(role)) {
      router.push("/");
    } else {
      setAuthorized(true);
    }
  }, [allowedRoles, router]);

  if (!authorized) return null;

  return <>{children}</>;
}
