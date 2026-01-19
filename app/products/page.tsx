"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/app/components/protectedroutes";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

export default function ProductsPage() {
  const router = useRouter();

  const defaultProducts: Product[] = [
    { id: 1, name: "Laptop", price: 1200, stock: 10 },
    { id: 2, name: "Mouse", price: 20, stock: 50 },
    { id: 3, name: "Keyboard", price: 35, stock: 30 },
  ];

  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");

  
  const getNextId = (products: Product[]) =>
    products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;

  
  useEffect(() => {
    const stored = localStorage.getItem("products");
    const userProducts: Product[] = stored ? JSON.parse(stored) : [];
    setProducts([...defaultProducts, ...userProducts]);
  }, []);

  
  const save = (data: Product[]) => {
    setProducts(data);
    const userProducts = data.filter((p) => p.id > 3);
    localStorage.setItem("products", JSON.stringify(userProducts));
  };

  const handleDelete = (id: number) => {
    save(products.filter((p) => p.id !== id));
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    const updated = products.map((p) =>
      p.id === editing.id
        ? {
            ...p,
            name,
            price: Number(price),
            stock: Number(stock),
          }
        : p
    );
    save(updated);
    setEditing(null);
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-6">
     
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-gray-500">Total Products</h2>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-gray-500">Total Stock</h2>
            <p className="text-2xl font-bold">
              {products.reduce((a, b) => a + b.stock, 0)}
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push("/products/add")}
          className="bg-teal-600 text-white px-5 py-2 rounded hover:bg-teal-700 h-fit"
        >
          Add Product
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
                Name
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">
                Price
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">
                Stock
              </th>
              <th className="p-3 text-center text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr
                key={`${p.id}-${index}`} 
                className={`border-t ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition`}
              >
                <td className="p-3">{p.id}</td>
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">${p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-slate-500 text-white px-3 py-1 rounded hover:bg-slate-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

     
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Edit Product
            </h2>

            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full rounded"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="border p-2 w-full rounded"
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) =>
                  setStock(e.target.value === "" ? "" : Number(e.target.value))
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
