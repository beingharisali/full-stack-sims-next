"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/protectedroutes";
import axios from "axios";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  supplier: string;
  category: string;
  description: string;
};

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [supplier, setSupplier] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/products/get");
      console.log(res.data);
      setProducts(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (_id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/products/delete/${_id}`);
      setProducts(products.filter((p) => p._id !== _id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);
    setSupplier(product.supplier);
    setCategory(product.category);
    setDescription(product.description);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    try {
      const updatedProduct = {
        name,
        price: Number(price),
        stock: Number(stock),
        supplier,
        category,
        description,
      };

      await axios.put(
        `http://localhost:5000/api/v1/products/update/${editing._id}`,
        updatedProduct,
      );

      setProducts(
        products.map((p) =>
          p._id === editing._id ? { ...p, ...updatedProduct } : p,
        ),
      );
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
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
                  Name
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">
                  Price
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">
                  Stock
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">
                  Supplier
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">
                  Category
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">
                  Description
                </th>
                <th className="p-3 text-center text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p._id}
                  className="border-t bg-white hover:bg-blue-50 transition"
                >
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">${p.price}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">{p.supplier}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{p.description}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-slate-500 text-white px-3 py-1 rounded hover:bg-slate-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">
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
                    setPrice(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className="border p-2 w-full rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={stock}
                  onChange={(e) =>
                    setStock(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className="border p-2 w-full rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Supplier"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="border p-2 w-full rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border p-2 w-full rounded"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
