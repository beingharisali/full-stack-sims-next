"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "../components/protectedroutes";
import api from "../utils/api";

type Saler = {
  _id: string;
  name: string;
  contactNumber: string;
  category: string;
  status: string;
  orderitems: number;
};

export default function SalerPage() {
  const [salers, setSalers] = useState<Saler[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchSalers = async () => {
      try {
        const res = await api.get("/saler");
        if (res.data.success) {
          setSalers(res.data.data);
        } else {
          setErrorMsg(res.data.message || "Failed to fetch salers");
        }
      } catch (err: any) {
        setErrorMsg(
          err.response?.data?.message || err.message || "Server Error",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSalers();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["saler"]}>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-5 text-center">
          Welcome to Sales Page
        </h1>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : errorMsg ? (
          <p className="text-center text-red-500">{errorMsg}</p>
        ) : (
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-500 text-white">
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Contact Number</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Order Items</th>
              </tr>
            </thead>
            <tbody>
              {salers.map((saler) => (
                <tr key={saler._id} className="hover:bg-blue-50 transition">
                  <td className="border px-4 py-2">{saler.name}</td>
                  <td className="border px-4 py-2">{saler.contactNumber}</td>
                  <td className="border px-4 py-2">{saler.category}</td>
                  <td className="border px-4 py-2">{saler.status}</td>
                  <td className="border px-4 py-2">{saler.orderitems}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </ProtectedRoute>
  );
}
