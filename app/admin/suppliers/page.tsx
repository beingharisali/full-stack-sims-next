"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../../utils/protectedroutes";
import api from "../../utils/api";
import Link from "next/link";

type Supplier = {
  _id: string;
  supplierGroup: string;
  name: string;
  contactNumber: string;
  category: string;
  status: string;
};

// const CATEGORIES = [
//   "mobile",
//   "laptop",
//   "headphones",
//   "tablet",
//   "televison",
//   "camera",
//   "smartwatch",
//   "accessories",
//   "home-appliances",
// ];

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    supplierGroup: "",
    name: "",
    contactNumber: "",
    category: "",
    status: "",
  });

  const fetchSuppliers = async () => {
    try {
      setError("");
      const res = await api.get("/supplier/get");
      if (res.data.success) setSuppliers(res.data.data || []);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch suppliers",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const resetForm = () => {
    setForm({
      supplierGroup: "",
      name: "",
      contactNumber: "",
      category: "",
      status: "",
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (s: Supplier) => {
    setEditing(s);
    setForm({
      supplierGroup: s.supplierGroup,
      name: s.name,
      contactNumber: s.contactNumber,
      category: s.category,
      status: s.status,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await api.put(`/supplier/update/${editing._id}`, form);
        setSuppliers((prev) =>
          prev.map((s) => (s._id === editing._id ? { ...s, ...form } : s)),
        );
      } else {
        const res = await api.post("/supplier/create", form);
        if (res.data.success && res.data.data)
          setSuppliers((prev) => [...prev, res.data.data]);
      }
      resetForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Request failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this supplier?")) return;
    try {
      await api.delete(`/supplier/delete/${id}`);
      setSuppliers((prev) => prev.filter((s) => s._id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="p-6">
          <p className="text-gray-500">Loading suppliers...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Suppliers</h1>
          <div className="flex gap-3">
            <Link
              href="/admin"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Back to Admin
            </Link>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
            >
              Add Supplier
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {showForm && (
          <div className="bg-white rounded-xl shadow border p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">
              {editing ? "Edit Supplier" : "New Supplier"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Group
                </label>
                <input
                  type="text"
                  value={form.supplierGroup}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, supplierGroup: e.target.value }))
                  }
                  className="border p-2 w-full rounded"
                  required
                  maxLength={50}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="border p-2 w-full rounded"
                  required
                  minLength={3}
                  maxLength={50}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={form.contactNumber}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, contactNumber: e.target.value }))
                  }
                  className="border p-2 w-full rounded"
                  required
                  minLength={11}
                  maxLength={15}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className="border p-2 w-full rounded"
                  placeholder="Enter category"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value }))
                  }
                  className="border p-2 w-full rounded"
                  required
                >
                  <option value="">Select status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="blacklisted">Blacklisted</option>
                </select>
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
                    Group
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s) => (
                  <tr key={s._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{s.supplierGroup}</td>
                    <td className="px-4 py-3 font-medium">{s.name}</td>
                    <td className="px-4 py-3">{s.contactNumber}</td>
                    <td className="px-4 py-3">{s.category}</td>
                    <td className="px-4 py-3">{s.status}</td>
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
          {suppliers.length === 0 && (
            <p className="p-6 text-center text-gray-500">No suppliers yet.</p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
