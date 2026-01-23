"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
	children: React.ReactNode;
	allowedRoles?: string[];
}

export default function ProtectedRoute({
	children,
	allowedRoles,
}: ProtectedRouteProps) {
	const { user, isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading) {
			if (!isAuthenticated) {
				router.push("/");
			} else if (allowedRoles && !allowedRoles.includes(user?.role || "")) {
				router.push("/unauthorized");
			}
		}
	}, [isAuthenticated, isLoading, user, allowedRoles, router]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	const hasAccess =
		isAuthenticated &&
		(!allowedRoles || allowedRoles.includes(user?.role || ""));

	return hasAccess ? <>{children}</> : null;
}
