"use client";

import { useAuth } from "../context/authcontext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
  role?: "admin" | "sales";
};

export default function ProtectedRoute({ children, role }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else if (role && user.role !== role) {
      router.push("/unauthorized");
    }
  }, [user, role, router]);

  if (!user) return null;

  return <>{children}</>;
}
