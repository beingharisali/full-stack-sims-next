"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Sale type
type Sale = {
  id: number;
  product: string;
  quantity: number;
  total: number;
};

// Default sales data
const DEFAULT_SALES: Sale[] = [
  { id: 1, product: "Laptop", quantity: 2, total: 2400 },
  { id: 2, product: "Mouse", quantity: 5, total: 100 },
  { id: 3, product: "Keyboard", quantity: 3, total: 150 },
  { id: 4, product: "Monitor", quantity: 1, total: 300 },
];

export default function SalesPage() {
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [editSale, setEditSale] = useState<Sale | null>(null);

  // Load sales data
  useEffect(() => {
    const stored = localStorage.getItem("sales");
    if (stored) {
      setSales(JSON.parse(stored));
    } else {
      setSales(DEFAULT_SALES);
      localStorage.setItem("sales", JSON.stringify(DEFAULT_SALES));
    }
  }, []);

  // Delete sale
  const handleDelete = (id: number) => {
    const updated = sales.filter((s) => s.id !== id);
    setSales(updated);
    localStorage.setItem("sales", JSON.stringify(updated));
  };

  // Update sale
  const handleUpdate = () => {
    if (!editSale) return;

    const updated = sales.map((s) =>
      s.id === editSale.id ? editSale : s
    );

    setSales(updated);
    localStorage.setItem("sales", JSON.stringify(updated));
    setEditSale(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sales Dashboard</h1>

      <button
        onClick={() => router.push("/sales/add")}
        className="mb-4 bg-teal-600 text-white px-4 py-2 rounded"
      >
        Add Sale
      </button>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id} className="border-t">
              <td>{sale.id}</td>
              <td>{sale.product}</td>
              <td>{sale.quantity}</td>
              <td>${sale.total}</td>
              <td className="flex gap-2">
                <button
                  onClick={() => setEditSale(sale)}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(sale.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editSale && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Edit Sale</h2>

          <input
            className="border p-2 mr-2"
            value={editSale.product}
            onChange={(e) =>
              setEditSale({ ...editSale, product: e.target.value })
            }
          />

          <input
            type="number"
            className="border p-2 mr-2"
            value={editSale.quantity}
            onChange={(e) =>
              setEditSale({
                ...editSale,
                quantity: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            className="border p-2 mr-2"
            value={editSale.total}
            onChange={(e) =>
              setEditSale({
                ...editSale,
                total: Number(e.target.value),
              })
            }
          />

          <button
            onClick={handleUpdate}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>
      )}
    </div>
  );
}
