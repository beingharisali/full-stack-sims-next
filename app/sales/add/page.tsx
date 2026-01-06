"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddSalePage() {
  const router = useRouter();

  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [total, setTotal] = useState<number | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const stored = localStorage.getItem("sales");
    const sales = stored ? JSON.parse(stored) : [];

    const newSale = {
      id: Date.now(),
      product,
      quantity: Number(quantity),
      total: Number(total),
    };

    const updated = [...sales, newSale];
    localStorage.setItem("sales", JSON.stringify(updated));

    router.push("/sales");
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Add Sale</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Product"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="number"
          placeholder="Total"
          value={total}
          onChange={(e) => setTotal(e.target.value === "" ? "" : Number(e.target.value))}
          className="border p-2 w-full rounded"
          required
        />

        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Add
          </button>
          <button
            type="button"
            onClick={() => router.push("/sales")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
