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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user?.role || !allowedRoles.includes(user.role)) {
      router.push("/"); 
    } else {
      setAuthorized(true);
    }
    setLoading(false);
  }, [router, allowedRoles]);

  if (loading) return null;
  if (!authorized) return null;

  return <>{children}</>;
}
