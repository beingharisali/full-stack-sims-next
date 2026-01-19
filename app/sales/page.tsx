"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/app/components/protectedroutes";

type Sale = {
  id: number;
  product: string;
  quantity: number;
  total: number;
};

export default function SalesPage() {
  const router = useRouter();

  const defaultSales: Sale[] = [
    { id: 1, product: "Laptop", quantity: 2, total: 2400 },
    { id: 2, product: "Mouse", quantity: 5, total: 100 },
    { id: 3, product: "Keyboard", quantity: 3, total: 150 },
  ];

  const [sales, setSales] = useState<Sale[]>([]);
  const [editing, setEditing] = useState<Sale | null>(null);
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [total, setTotal] = useState<number | "">("");

  // load sales
  useEffect(() => {
    const stored = localStorage.getItem("sales");
    const userSales: Sale[] = stored ? JSON.parse(stored) : [];
    setSales([...defaultSales, ...userSales]);
  }, []);

  const save = (data: Sale[]) => {
    setSales(data);
    const userSales = data.filter((s) => s.id > 3);
    localStorage.setItem("sales", JSON.stringify(userSales));
  };

  const handleDelete = (id: number) => {
    save(sales.filter((s) => s.id !== id));
  };

  const handleEdit = (sale: Sale) => {
    setEditing(sale);
    setProduct(sale.product);
    setQuantity(sale.quantity);
    setTotal(sale.total);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    const updated = sales.map((s) =>
      s.id === editing.id
        ? { ...s, product, quantity: Number(quantity), total: Number(total) }
        : s
    );

    save(updated);
    setEditing(null);
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "sales"]}>
      <div className="p-6">
      {/* Top Section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-gray-500">Total Sales</h2>
            <p className="text-2xl font-bold">{sales.length}</p>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-gray-500">Total Revenue</h2>
            <p className="text-2xl font-bold">
              ${sales.reduce((a, b) => a + b.total, 0)}
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push("/sales/add")}
          className="bg-teal-600 text-white px-5 py-2 rounded hover:bg-teal-700 h-fit"
        >
          Add Sale
        </button>
      </div>

      {/* Sales Table */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">
                ID
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">
                Product
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">
                Quantity
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">
                Total
              </th>
              <th className="p-3 text-center text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s, index) => (
              <tr
                key={`${s.id}-${index}`}
                className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}
              >
                <td className="p-3">{s.id}</td>
                <td className="p-3 font-medium">{s.product}</td>
                <td className="p-3">{s.quantity}</td>
                <td className="p-3">${s.total}</td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="bg-slate-500 text-white px-3 py-1 rounded hover:bg-slate-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No sales available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Edit Sale
            </h2>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="border p-2 w-full rounded"
                required
              />
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="border p-2 w-full rounded"
                required
              />
              <input
                type="number"
                value={total}
                onChange={(e) =>
                  setTotal(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="border p-2 w-full rounded"
                required
              />
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
