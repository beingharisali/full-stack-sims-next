"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/protectedroutes";

type Invoice = {
  id: number;
  customer: string;
  amount: number;
  status: string;
};

export default function InvoicePage() {
  const router = useRouter();

  const defaultInvoices: Invoice[] = [
    { id: 1, customer: "John Doe", amount: 2500, status: "Paid" },
    { id: 2, customer: "Jane Smith", amount: 150, status: "Pending" },
  ];

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [editing, setEditing] = useState<Invoice | null>(null);

  const [customer, setCustomer] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    const stored = localStorage.getItem("invoices");
    if (stored) {
      setInvoices(JSON.parse(stored));
    } else {
      localStorage.setItem("invoices", JSON.stringify(defaultInvoices));
      setInvoices(defaultInvoices);
    }
  }, []);

  const save = (data: Invoice[]) => {
    setInvoices(data);
    localStorage.setItem("invoices", JSON.stringify(data));
  };

  const handleDelete = (id: number) => {
    save(invoices.filter((i) => i.id !== id));
  };

  const handleEdit = (inv: Invoice) => {
    setEditing(inv);
    setCustomer(inv.customer);
    setAmount(inv.amount);
    setStatus(inv.status);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    const updated = invoices.map((i) =>
      i.id === editing?.id ? { ...i, customer, amount, status } : i,
    );

    save(updated);
    setEditing(null);
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "sales"]}>
      <div className="p-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 shadow rounded">
              <h2 className="text-gray-500">Total Invoices</h2>
              <p className="text-2xl font-bold">{invoices.length}</p>
            </div>
            <div className="bg-white p-4 shadow rounded">
              <h2 className="text-gray-500">Total Amount</h2>
              <p className="text-2xl font-bold">
                ${invoices.reduce((a, b) => a + b.amount, 0)}
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/invoice/add")}
            className="bg-teal-600 text-white px-5 py-2 rounded hover:bg-teal-700 h-fit"
          >
            Add Invoice
          </button>
        </div>

        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">
                  ID
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">
                  Customer
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">
                  Amount
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="p-3 text-center text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((i, index) => (
                <tr
                  key={i.id}
                  className={`border-t ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="p-3">{i.id}</td>
                  <td className="p-3 font-medium">{i.customer}</td>
                  <td className="p-3">${i.amount}</td>
                  <td className="p-3">{i.status}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(i)}
                      className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(i.id)}
                      className="bg-slate-500 text-white px-3 py-1 rounded hover:bg-slate-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editing && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Edit Invoice
              </h2>

              <form onSubmit={handleUpdate} className="space-y-3">
                <input
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="border p-2 w-full rounded"
                  required
                />

                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="border p-2 w-full rounded"
                  required
                />

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border p-2 w-full rounded"
                >
                  <option>Paid</option>
                  <option>Pending</option>
                </select>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
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
