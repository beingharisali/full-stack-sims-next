"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "../../utils/protectedroutes";
import api from "../../utils/api";

type SellerUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<SellerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<SellerUser | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const fetchSellers = async () => {
    try {
      setError("");
      const res = await api.get("/dashboard/users?role=saler");
      if (res.data?.success) {
        setSellers(res.data.data || []);
      } else {
        setSellers(res.data?.data || []);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch sellers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (seller: SellerUser) => {
    setEditing(seller);
    setForm({
      firstName: seller.firstName,
      lastName: seller.lastName,
      email: seller.email,
      password: "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        const payload: Record<string, string> = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
        };
        if (form.password) payload.password = form.password;
        await api.put(`/users/${editing._id}`, payload);
        setSellers((prev) =>
          prev.map((s) =>
            s._id === editing._id ? ({ ...s, ...payload } as SellerUser) : s,
          ),
        );
      } else {
        const res = await api.post("/users", {
          ...form,
          role: "saler",
        });
        if (res.data?.data) {
          setSellers((prev) => [
            ...prev,
            { ...res.data.data, _id: res.data.data.id || res.data.data._id },
          ]);
        }
      }
      resetForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Request failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this seller?")) return;
    try {
      await api.delete(`/users/${id}`);
      setSellers((prev) => prev.filter((s) => s._id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="p-6">
          <p className="text-gray-500">Loading sellers...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Sellers</h1>
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Back to Dashboard
            </Link>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
            >
              Add Seller
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {showForm && (
          <div className="bg-white rounded-xl shadow border p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">
              {editing ? "Edit Seller" : "New Seller"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, firstName: e.target.value }))
                  }
                  className="border p-2 w-full rounded"
                  required
                  minLength={3}
                  maxLength={50}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, lastName: e.target.value }))
                  }
                  className="border p-2 w-full rounded"
                  required
                  minLength={3}
                  maxLength={50}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="border p-2 w-full rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  className="border p-2 w-full rounded"
                  required={!editing}
                  minLength={6}
                />
                {editing && (
                  <p className="text-xs text-gray-500 mt-1">
                    Leave blank to keep the current password.
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                >
                  {editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Role
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((s) => (
                  <tr key={s._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">
                      {s.firstName} {s.lastName}
                    </td>
                    <td className="px-4 py-3">{s.email}</td>
                    <td className="px-4 py-3">{s.role}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(s)}
                        className="text-teal-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(s._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sellers.length === 0 && (
            <p className="p-6 text-center text-gray-500">No sellers yet.</p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
