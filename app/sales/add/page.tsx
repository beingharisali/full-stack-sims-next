"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ProtectedRoute from "../../components/protectedroutes";
import api from "../../utils/api";

export default function AddSalePage() {
  const router = useRouter();
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [total, setTotal] = useState<number | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/sales/create", {
        productName: product,
        quantity: Number(quantity),
        total: Number(total),
      });
      router.push("/sales");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
            ? err.message
            : "Failed to add sale";
      setError(String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "manager", "saler"]}>
      <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
        <h2 className="text-xl font-bold mb-4">Add Sale</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="border p-2 w-full rounded"
            placeholder="Product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
          />

          <input
            type="number"
            className="border p-2 w-full rounded"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
          />

          <input
            type="number"
            className="border p-2 w-full rounded"
            placeholder="Total Amount"
            value={total}
            onChange={(e) =>
              setTotal(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? "Adding…" : "Add"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/sales")}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
