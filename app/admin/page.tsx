"use client";

import ProtectedRoute from "../utils/protectedroutes";

export default function AdminPage() {
  return (
    <ProtectedRoute role="admin">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-gray-500">Total Users</h2>
            <p className="text-2xl font-bold">25</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-gray-500">Total Sales</h2>
            <p className="text-2xl font-bold">120</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-gray-500">Suppliers</h2>
            <p className="text-2xl font-bold">8</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
