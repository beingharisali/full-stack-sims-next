"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/protectedroutes";
import api from "../utils/api";

type Invoice = {
  _id: string;
  invoice_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
};

export default function InvoicePage() {
  const router = useRouter();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState<Invoice | null>(null);
  const [status, setStatus] = useState("");

  // 🔹 Fetch invoices from backend
  const fetchInvoices = async () => {
    try {
      const res = await api.get("/invoice");
      setInvoices(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // 🔹 Delete invoice
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    try {
      await api.delete(`/invoice/${id}`);
      setInvoices((prev) => prev.filter((i) => i._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // 🔹 Edit invoice
  const handleEdit = (inv: Invoice) => {
    setEditing(inv);
    setStatus(inv.status);
  };

  // 🔹 Update invoice
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.put(`/invoice/${editing?._id}`, { status });
      setEditing(null);
      fetchInvoices();
    } catch (err: any) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const totalAmount = invoices.reduce((sum, i) => sum + i.total_amount, 0);

  return (
    <ProtectedRoute allowedRoles={["admin", "sales"]}>
      <div className="p-6">
        <div className="mb-6 flex flex-col md:flex-row md:justify-between gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 shadow rounded">
              <h2 className="text-gray-500">Total Invoices</h2>
              <p className="text-2xl font-bold">{invoices.length}</p>
            </div>
            <div className="bg-white p-4 shadow rounded">
              <h2 className="text-gray-500">Total Amount</h2>
              <p className="text-2xl font-bold">Rs. {totalAmount}</p>
            </div>
          </div>

          <button
            onClick={() => router.push("/invoice/add")}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
          >
            Add Invoice
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && (
          <div className="bg-white shadow rounded overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Invoice #</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((i, index) => (
                  <tr
                    key={i._id}
                    className={`border-t ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-3">{i.invoice_number}</td>
                    <td className="p-3">{i.customer_name}</td>
                    <td className="p-3">Rs. {i.total_amount}</td>
                    <td className="p-3 capitalize">{i.status}</td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(i)}
                        className="bg-teal-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(i._id)}
                        className="bg-slate-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editing && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Update Status</h2>

              <form onSubmit={handleUpdate} className="space-y-3">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border p-2 w-full rounded"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
