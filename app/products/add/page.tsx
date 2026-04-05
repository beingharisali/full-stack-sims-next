"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaBoxOpen, FaArrowLeft, FaSave, FaTags, FaTruck, FaMoneyBillWave } from "react-icons/fa";
import ProtectedRoute from "../../components/protectedroutes";
import api from "../../utils/api";

type Supplier = { _id: string; name: string };

export default function AddProductPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    supplier: "",
    stock: "0",
    lowStockThreshold: "5",
  });

  // Suppliers load karna taake dropdown mein show hon
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await api.get("/supplier/get");
        if (res.data.success) setSuppliers(res.data.data || []);
      } catch (err) {
        console.error("Suppliers load failed");
      }
    };
    fetchSuppliers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
        supplier: formData.supplier || null,
      };

      const res = await api.post("/products/create", payload);
      if (res.data.success) {
        alert("Product Added Successfully!");
        router.push("/products");
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Error saving product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
          
          {/* Header - Teal Theme */}
          <div className="bg-teal-600 p-6 text-white flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Add New Product</h1>
              <p className="text-teal-100 text-sm">Enter product details and stock levels</p>
            </div>
            <FaBoxOpen className="text-4xl opacity-30" />
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {errorMsg && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-red-700 text-sm font-medium">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Name */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block tracking-wider">Product Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="e.g. iPhone 15 Pro" required />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block tracking-wider">Description (Max 150 chars)</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" rows={2} placeholder="Brief product details..." required />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1 mb-1 tracking-wider">
                  <FaTags className="text-teal-600" /> Category
                </label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white" required>
                  <option value="">Select Category</option>
                  <option value="mobile">Mobile</option>
                  <option value="laptop">Laptop</option>
                  <option value="headphones">Headphones</option>
                  <option value="tablet">Tablet</option>
                  <option value="televison">Television</option>
                  <option value="camera">Camera</option>
                  <option value="smartwatch">Smartwatch</option>
                  <option value="accessories">Accessories</option>
                  <option value="home-appliances">Home Appliances</option>
                </select>
              </div>

              {/* Supplier Dropdown */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1 mb-1 tracking-wider">
                  <FaTruck className="text-teal-600" /> Supplier
                </label>
                <select value={formData.supplier} onChange={(e) => setFormData({...formData, supplier: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white">
                  <option value="">Select Supplier (Optional)</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1 mb-1 tracking-wider">
                  <FaMoneyBillWave className="text-teal-600" /> Price (Rs)
                </label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="0.00" required />
              </div>

              {/* Stock */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block tracking-wider">Initial Stock</label>
                <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="0" />
              </div>

              {/* Threshold */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block tracking-wider">Low Stock Threshold</label>
                <input type="number" value={formData.lowStockThreshold} onChange={(e) => setFormData({...formData, lowStockThreshold: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="5" />
              </div>

            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t mt-4">
              <button type="button" onClick={() => router.push("/products")} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition">
                <FaArrowLeft /> Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 shadow-md transition active:scale-95 disabled:opacity-50">
                <FaSave /> {loading ? "Saving..." : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}