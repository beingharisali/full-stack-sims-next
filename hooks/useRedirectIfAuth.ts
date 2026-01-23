"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function useRedirectIfAuth() {
	const router = useRouter();
	const { isAuthenticated, isLoading } = useAuth();
	const role = localStorage.getItem("role");

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			if (role === "manager") {
				router.push("/manager");
			} else if (role === "admin") {
				router.push("/dashboard");
			} else {
				router.push("/Sale");
			}
		}
	}, [isAuthenticated, isLoading, router]);
}
