"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Hook to redirect authenticated users away from public pages like login/signup
 */
export function useRedirectIfAuth() {
	const router = useRouter();
	const { isAuthenticated, isLoading } = useAuth();

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			router.push("/dashboard");
		}
	}, [isAuthenticated, isLoading, router]);
}
