"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/protectedroutes";
import api from "../..//utils/api";

interface Customer {
  _id: string;
  name: string;
  contactNumber: string;
  category: string;
  status: string;
  orderitems: number;
}

export default function SalerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/customers"); // backend route to fetch all customers
      if (res.data.success) {
        setCustomers(res.data.data); // assuming backend returns { success, data }
      } else {
        setError(res.data.message || "Failed to fetch customers");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["saler"]}>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-5 text-center">
          Customer Orders
        </h1>

        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-500 text-white">
                <tr>
                  <th className="border px-4 py-2">#</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Contact Number</th>
                  <th className="border px-4 py-2">Category</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Order Items</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, idx) => (
                  <tr
                    key={c._id}
                    className={`border-t ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="border px-4 py-2">{idx + 1}</td>
                    <td className="border px-4 py-2">{c.name}</td>
                    <td className="border px-4 py-2">{c.contactNumber}</td>
                    <td className="border px-4 py-2">{c.category}</td>
                    <td className="border px-4 py-2">{c.status}</td>
                    <td className="border px-4 py-2">{c.orderitems}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
