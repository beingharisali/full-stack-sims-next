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
    if (user && role && user.role !== role) {
      router.replace("/unauthorized");
    }
  }, [user, role, router]);

  if (!user) {
    return (
      <div className="text-center mt-20 text-gray-600">
        Please login to continue
      </div>
    );
  }

  return <>{children}</>;
}
