"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/protectedroutes";
import api from "../utils/api"; // make sure this axios instance points to your backend

type Sale = {
  _id: string;
  productName: string;
  quantity: number;
  total: number;
};

export default function SalesPage() {
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [editing, setEditing] = useState<Sale | null>(null);
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [total, setTotal] = useState<number | "">("");

  // Get user role from localStorage
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;
  const role = user?.role;

  // Fetch sales from backend
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await api.get("/sales/get");
        if (res.data.success) {
          setSales(res.data.data);
        }
      } catch (err: unknown) {
        // Only log unexpected errors; 404 is handled by showing empty list
        if (err && typeof err === "object" && "response" in err) {
          const status = (err as { response?: { status?: number } }).response
            ?.status;
          if (status !== 404) {
            console.error("Error fetching sales:", err);
          }
        } else {
          console.error("Error fetching sales:", err);
        }
      }
    };

    fetchSales();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/sales/delete/${id}`);
      setSales((prev) => prev.filter((s) => s._id !== id));
    } catch (err: any) {
      console.error("Delete failed:", err.message);
    }
  };

  const handleEdit = (sale: Sale) => {
    setEditing(sale);
    setProduct(sale.productName);
    setQuantity(sale.quantity);
    setTotal(sale.total);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    try {
      await api.put(`/sales/update/${editing._id}`, {
        productName: product,
        quantity: Number(quantity),
        total: Number(total),
      });

      setSales((prev) =>
        prev.map((s) =>
          s._id === editing._id
            ? {
                ...s,
                productName: product,
                quantity: Number(quantity),
                total: Number(total),
              }
            : s,
        ),
      );
      setEditing(null);
    } catch (err: any) {
      console.error("Update failed:", err.message);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "manager", "saler"]}>
      <div className="p-6">
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
        </div>

        {/* Sales Table */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
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
              {sales.map((s) => (
                <tr
                  key={s._id}
                  className="border-t bg-white hover:bg-blue-50 transition"
                >
                  <td className="p-3 font-medium">{s.productName}</td>
                  <td className="p-3">{s.quantity}</td>
                  <td className="p-3">${s.total}</td>
                  <td className="p-3 text-center space-x-2">
                    {["admin", "manager"].includes(role) && (
                      <>
                        <button
                          onClick={() => handleEdit(s)}
                          className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s._id)}
                          className="bg-slate-500 text-white px-3 py-1 rounded hover:bg-slate-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
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
                    setQuantity(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className="border p-2 w-full rounded"
                  required
                />
                <input
                  type="number"
                  value={total}
                  onChange={(e) =>
                    setTotal(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
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
