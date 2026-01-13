"use client";

import ProtectedRoute from "../components/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute role="admin">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
    </ProtectedRoute>
  );
}
