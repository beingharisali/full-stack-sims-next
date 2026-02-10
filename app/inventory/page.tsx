"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/protectedroutes";
import api from "../utils/api";

type InventoryItem = {
  _id: string;
  product: string;
  quantity: number;
  category: string;
  description: string;
  price: number;
  supplier: string;
  location: string;
};

export default function InventoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await api.get("/inventory/get");
        if (res.data.success) {
          const backendItems = res.data.data.map((item: any) => ({
            _id: item._id,
            product: item.productName,
            quantity: item.quantity,
            category: item.category,
            description: item.description,
            price: item.price,
            supplier: item.supplier,
            location: item.location,
          }));
          setItems(backendItems);
        }
      } catch (err: any) {
        console.error("Error fetching inventory:", err.message);
      }
    };

    fetchInventory();
  }, []);

  const handleDelete = async (_id: string) => {
    try {
      await api.delete(`/inventory/delete/${_id}`);
      setItems((prev) => prev.filter((i) => i._id !== _id));
    } catch (err: any) {
      console.error("Delete failed:", err.message);
    }
  };

  const handleUpdate = async () => {
    if (!editItem) return;

    try {
      await api.put(`/inventory/update/${editItem._id}`, {
        productName: editItem.product,
        quantity: editItem.quantity,
        supplier: editItem.supplier,
        price: editItem.price,
        location: editItem.location,
      });

      setItems((prev) =>
        prev.map((i) => (i._id === editItem._id ? editItem : i)),
      );
      setEditItem(null);
    } catch (err: any) {
      console.error("Update failed:", err.message);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 shadow rounded">
              <h2 className="text-gray-500">Total Products</h2>
              <p className="text-2xl font-bold">{items.length}</p>
            </div>
            <div className="bg-white p-4 shadow rounded">
              <h2 className="text-gray-500">Total Stock</h2>
              <p className="text-2xl font-bold">
                {items.reduce((a, b) => a + b.quantity, 0)}
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/inventory/add")}
            className="bg-teal-600 text-white px-4 py-3 rounded hover:bg-teal-700"
          >
            Add Products
          </button>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Stock</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Supplier</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{item.product}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2">{item.location}</td>
                  <td className="px-4 py-2">{item.price}</td>
                  <td className="px-4 py-2">{item.supplier}</td>
                  <td className="px-4 py-2 space-x-2 text-center">
                    <button
                      onClick={() => setEditItem(item)}
                      className="bg-teal-600 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-slate-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editItem && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white w-105 p-6 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-4">Edit Inventory</h2>

              <input
                className="border p-2 w-full mb-3 rounded"
                value={editItem.product}
                onChange={(e) =>
                  setEditItem({ ...editItem, product: e.target.value })
                }
              />

              <input
                type="number"
                className="border p-2 w-full mb-3 rounded"
                value={editItem.quantity}
                onChange={(e) =>
                  setEditItem({ ...editItem, quantity: Number(e.target.value) })
                }
              />

              <input
                className="border p-2 w-full mb-4 rounded"
                value={editItem.location}
                onChange={(e) =>
                  setEditItem({ ...editItem, location: e.target.value })
                }
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditItem(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
