"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ProtectedRoute from "../../components/protectedroutes";

export default function AddSalePage() {
  const router = useRouter();

  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [total, setTotal] = useState<number | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get existing sales from localStorage
    const existing = JSON.parse(localStorage.getItem("sales") || "[]");

    // Generate unique ID using Date.now()
    const newSale = {
      id: Date.now(),
      product,
      quantity: Number(quantity),
      total: Number(total),
    };

    // Save to localStorage
    localStorage.setItem("sales", JSON.stringify([...existing, newSale]));

    // Redirect back to sales list page
    router.push("/sales");
  };

  return (
    <ProtectedRoute allowedRoles={["sales", "admin"]}>
      <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
        <h2 className="text-xl font-bold mb-4">Add Sale</h2>

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
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add
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
