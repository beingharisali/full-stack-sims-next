"use client";

import React from "react";
import ProtectedRoute from "@/app/components/protectedroutes";

export default function SalerPage() {
  return (
    <ProtectedRoute allowedRoles={["saler"]}>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-5 text-center">
          Welcome to Sales Page
        </h1>

        <table className="w-full border border-gray-300">
          <thead className="bg-gray-500 text-white">
            <tr>
              <th className="border px-4 py-2">Order ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Contact Number</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Order Items</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border px-4 py-2">001</td>
              <td className="border px-4 py-2">Salar Hasan</td>
              <td className="border px-4 py-2">0300-1234566</td>
              <td className="border px-4 py-2">Samsung</td>
              <td className="border px-4 py-2">Completed</td>
              <td className="border px-4 py-2">23</td>
            </tr>

            <tr>
              <td className="border px-4 py-2">002</td>
              <td className="border px-4 py-2">Taimoor Shah</td>
              <td className="border px-4 py-2">0301-1232566</td>
              <td className="border px-4 py-2">Sonic Headphones</td>
              <td className="border px-4 py-2">Completed</td>
              <td className="border px-4 py-2">40</td>
            </tr>

            <tr>
              <td className="border px-4 py-2">003</td>
              <td className="border px-4 py-2">Hasan Ali</td>
              <td className="border px-4 py-2">0311-1232566</td>
              <td className="border px-4 py-2">Audionic Speakers</td>
              <td className="border px-4 py-2">Completed</td>
              <td className="border px-4 py-2">30</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ProtectedRoute>
  );
}
