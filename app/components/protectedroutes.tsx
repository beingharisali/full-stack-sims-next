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
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setLoading(false);
      router.replace("/unauthorized");
      return;
    }

    const user = JSON.parse(storedUser);
    const role = user?.role?.toLowerCase();

    if (!role || !allowedRoles.map((r) => r.toLowerCase()).includes(role)) {
      setLoading(false);
      router.replace("/unauthorized");
      return;
    }

    // if (!allowedRoles.includes(user.role)) {
    //   router.replace("/unauthorized");
    //   return;
    // }

    setAuthorized(true);
    setLoading(false);
  }, [allowedRoles, router]);

  if (loading) return null;
  if (!authorized) return null;

  return <>{children}</>;
}
