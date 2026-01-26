"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function useRedirectIfAuth() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      const role = user?.role;

      if (role === "manager") {
        router.push("/manager");
      } else if (role === "admin") {
        router.push("/dashboard");
      } else if (role === "saler") {
        router.push("/saler");
      } else {
        router.push("/");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);
}
