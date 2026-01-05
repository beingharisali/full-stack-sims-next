"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Sale = {
  id: number;
  product: string;
  quantity: number;
  total: number;
};

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

  // LOAD SALES
  useEffect(() => {
    const stored = localStorage.getItem("sales");
    if (stored) {
      setSales(JSON.parse(stored));
    } else {
      setSales(DEFAULT_SALES);
      localStorage.setItem("sales", JSON.stringify(DEFAULT_SALES));
    }
  }, []);

  // DELETE SALE (NO ALERT)
  const handleDelete = (id: number) => {
    const updated = sales.filter((s) => s.id !== id);
    setSales(updated);
    localStorage.setItem("sales", JSON.stringify(updated));
  };

  // UPDATE SALE
  const handleUpdate = () => {
    if (!editSale) return;

    const updated = sales.map((s) =>
      s.id === editSale.id ? editSale : s
    );

    setSales(updated);
    localStorage.setItem("sales", JSON.stringify(updated));

    alert("Sale updated successfully ✅");
    setEditSale(null);
  };

  return (
    <div className="p-6">
      {/* TOP SUMMARY */}
      <div className="mb-6 flex items-center justify-between">
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
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Add Sale
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Product
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                Quantity
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                Total
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale, index) => (
              <tr
                key={sale.id}
                className={`border-t ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition`}
              >
                <td className="px-6 py-3 text-sm text-gray-700">
                  {sale.id}
                </td>
                <td className="px-6 py-3 text-sm font-medium text-gray-800">
                  {sale.product}
                </td>
                <td className="px-6 py-3 text-sm text-center">
                  {sale.quantity}
                </td>
                <td className="px-6 py-3 text-sm text-right font-semibold">
                  ${sale.total}
                </td>
                <td className="px-6 py-3">
                  <div className="flex justify-center gap-2">
                    {/* EDIT → DIRECT MODAL */}
                    <button
                      onClick={() => setEditSale(sale)}
                      className="px-3 py-1 text-sm rounded bg-teal-600 text-white hover:bg-teal-700"
                    >
                      Edit
                    </button>

                    {/* DELETE → DIRECT */}
                    <button
                      onClick={() => handleDelete(sale.id)}
                      className="px-3 py-1 text-sm rounded bg-slate-500 text-white hover:bg-slate-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sales.length === 0 && (
          <p className="text-center py-6 text-gray-500">
            No sales found
          </p>
        )}
      </div>

      {/* EDIT MODAL */}
      {editSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Edit Sale
            </h2>

            <div className="mb-3">
              <label className="text-sm text-gray-600">Product</label>
              <input
                className="border p-2 w-full rounded mt-1"
                value={editSale.product}
                onChange={(e) =>
                  setEditSale({ ...editSale, product: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="text-sm text-gray-600">Quantity</label>
              <input
                type="number"
                className="border p-2 w-full rounded mt-1"
                value={editSale.quantity}
                onChange={(e) =>
                  setEditSale({
                    ...editSale,
                    quantity: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-600">Total</label>
              <input
                type="number"
                className="border p-2 w-full rounded mt-1"
                value={editSale.total}
                onChange={(e) =>
                  setEditSale({
                    ...editSale,
                    total: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditSale(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
