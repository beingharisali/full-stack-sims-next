"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaBox, FaEdit, FaTrash, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import ProtectedRoute from "../components/protectedroutes";
import api from "../utils/api";

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products/get");
      if (res.data.success) {
        setProducts(res.data.data || []);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/delete/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          {/* HEADER SECTION (Uniform Design) */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaBox className="text-teal-600" /> Product Management
              </h1>
              <p className="text-gray-500 text-sm font-medium">Manage your items and pricing</p>
            </div>
            
            <button 
              onClick={() => router.push("/products/add")}
              className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg transition-all active:scale-95"
            >
              <FaPlus /> Add Product
            </button>
          </div>

          {/* PRODUCTS LIST TABLE */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product Info</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price (Rs)</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={5} className="p-10 text-center text-gray-400 font-medium italic">Syncing product data...</td></tr>
                  ) : products.length === 0 ? (
                    <tr><td colSpan={5} className="p-10 text-center text-gray-400">No products registered yet.</td></tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p._id} className="hover:bg-teal-50/30 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-gray-800">{p.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{p.description}</p>
                        </td>
                        <td className="p-4">
                          <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4 text-sm font-bold text-teal-600">
                          {p.price.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className={`text-sm font-bold ${p.stock <= p.lowStockThreshold ? 'text-red-500' : 'text-gray-700'}`}>
                              {p.stock} Units
                            </span>
                            {p.stock <= p.lowStockThreshold ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 uppercase">
                                <FaExclamationTriangle className="text-[8px]" /> Low Stock
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase">
                                <FaCheckCircle className="text-[8px]" /> In Stock
                              </span>
                            )}
                          </div>
                        </td>
                        {/* Icons Hamesha Nazar Aayenge */}
                        <td className="p-4">
                          <div className="flex justify-center gap-4">
                            <button 
                              onClick={() => router.push(`/products/edit/${p._id}`)} 
                              className="text-teal-600 hover:text-teal-800 transition-colors"
                              title="Edit"
                            >
                              <FaEdit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(p._id)} 
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Delete"
                            >
                              <FaTrash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}