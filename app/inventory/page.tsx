"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type InventoryItem = {
  id: number;
  product: string;
  quantity: number;
  location: string;
};

const DEFAULT_INVENTORY: InventoryItem[] = [
  { id: 1, product: "Laptop", quantity: 10, location: "Warehouse A" },
  { id: 2, product: "Mouse", quantity: 25, location: "Warehouse B" },
  { id: 3, product: "Keyboard", quantity: 15, location: "Warehouse A" },
];

export default function InventoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("inventory");

    if (stored) {
      const parsed = JSON.parse(stored);

      if (parsed.length === 0) {
        setItems(DEFAULT_INVENTORY);
        localStorage.setItem("inventory", JSON.stringify(DEFAULT_INVENTORY));
      } else {
        setItems(parsed);
      }
    } else {
      setItems(DEFAULT_INVENTORY);
      localStorage.setItem("inventory", JSON.stringify(DEFAULT_INVENTORY));
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("inventory", JSON.stringify(items));
    }
  }, [items]);

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUpdate = () => {
    if (!editItem) return;

    setItems((prev) => prev.map((i) => (i.id === editItem.id ? editItem : i)));
    setEditItem(null);
  };

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='bg-white p-4 shadow rounded'>
            <h2 className='text-gray-500'>Total Products</h2>
            <p className='text-2xl font-bold'>{items.length}</p>
          </div>
          <div className='bg-white p-4 shadow rounded'>
            <h2 className='text-gray-500'>Total Stock</h2>
            <p className='text-2xl font-bold'>
              {items.reduce((a, b) => a + b.quantity, 0)}
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push("/inventory/add")}
          className='bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700'>
          Add Inventory
        </button>
      </div>

      <div className='overflow-x-auto bg-white shadow rounded'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-4 py-2 text-left'>ID</th>
              <th className='px-4 py-2 text-left'>Product</th>
              <th className='px-4 py-2 text-left'>Quantity</th>
              <th className='px-4 py-2 text-left'>Location</th>
              <th className='px-4 py-2 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className='border-b hover:bg-gray-50'>
                <td className='px-4 py-2'>{item.id}</td>
                <td className='px-4 py-2'>{item.product}</td>
                <td className='px-4 py-2'>{item.quantity}</td>
                <td className='px-4 py-2'>{item.location}</td>
                <td className='px-4 py-2 space-x-2 text-center'>
                  <button
                    onClick={() => setEditItem(item)}
                    className='bg-teal-600 text-white px-2 py-1 rounded'>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className='bg-slate-500 text-white px-2 py-1 rounded'>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editItem && (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          <div className='bg-white w-[25.5px] p-6 rounded shadow-lg'>
            <h2 className='text-xl font-bold mb-4'>Edit Inventory</h2>

            <input
              className='border p-2 w-full mb-3 rounded'
              value={editItem.product}
              onChange={(e) =>
                setEditItem({ ...editItem, product: e.target.value })
              }
            />

            <input
              type='number'
              className='border p-2 w-full mb-3 rounded'
              value={editItem.quantity}
              onChange={(e) =>
                setEditItem({
                  ...editItem,
                  quantity: Number(e.target.value),
                })
              }
            />

            <input
              className='border p-2 w-full mb-4 rounded'
              value={editItem.location}
              onChange={(e) =>
                setEditItem({ ...editItem, location: e.target.value })
              }
            />

            <div className='flex justify-end gap-2'>
              <button
                onClick={() => setEditItem(null)}
                className='bg-gray-500 text-white px-4 py-2 rounded'>
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className='bg-green-600 text-white px-4 py-2 rounded'>
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
