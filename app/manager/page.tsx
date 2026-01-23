"use client";

import React from "react";
import ProtectedRoute from "@/app/components/protectedroutes";

export default function ManagerPage() {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manager Panel</h1>
          <p className="text-gray-600 mt-1">
            Access and manage your products, inventory, sales, and invoices
          </p>
        </div>
        <div className="space-y-4 max-w-md">
          <div className="bg-blue-200 p-5 rounded-lg shadow hover:shadow-lg transition flex items-center">
            <div className="flex-1">
              <h2 className="text-lg font-medium text-gray-800">Products</h2>
              <p className="text-sm text-gray-600">
                Add, update, and view all products
              </p>
            </div>
          </div>

          <div className="bg-blue-200 p-5 rounded-lg shadow hover:shadow-lg transition flex items-center">
            <div className="flex-1">
              <h2 className="text-lg font-medium text-gray-800">Inventory</h2>
              <p className="text-sm text-gray-600">
                Check stock levels and alerts
              </p>
            </div>
          </div>

          <div className="bg-blue-200 p-5 rounded-lg shadow hover:shadow-lg transition flex items-center">
            <div className="flex-1">
              <h2 className="text-lg font-medium text-gray-800">Sales</h2>
              <p className="text-sm text-gray-600">
                Monitor daily and monthly sales
              </p>
            </div>
          </div>

          <div className="bg-blue-200 p-5 rounded-lg shadow hover:shadow-lg transition flex items-center">
            <div className="flex-1">
              <h2 className="text-lg font-medium text-gray-800">Invoices</h2>
              <p className="text-sm text-gray-600">View and manage invoices</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
