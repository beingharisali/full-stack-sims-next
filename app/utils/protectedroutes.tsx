"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authcontext";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "admin" | "sales";
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== role) {
      router.push("/signup");
    }
  }, [user, role, router]);

  // jab tak user null hai kuch render na ho
  if (!user || user.role !== role) {
    return null;
  }

  return <>{children}</>;
}
