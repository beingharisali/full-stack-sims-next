"use client";
import React from "react";
import ProtectedRoute from "@/app/components/ProtectedRoutes";

function Manager() {
	return (
		<ProtectedRoute allowedRoles={["manager", "admin"]}>
			<div>
				<h1>Welcome Manager Page</h1>
				<p>This page is only accessible to managers and admins.</p>
			</div>
		</ProtectedRoute>
	);
}

export default Manager;
