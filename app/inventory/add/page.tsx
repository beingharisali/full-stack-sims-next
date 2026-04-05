"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaBox, FaTruck, FaMapMarkerAlt, FaArrowLeft, FaSave } from "react-icons/fa";
import ProtectedRoute from "../../components/protectedroutes";
import api from "../../utils/api";

export default function AddInventoryPage() {
  const router = useRouter();
  
  // Form State (As per your Mongoose Model)
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    category: "",
    price: "",
    supplier: "",
    quantity: "",
    location: "warehouse",
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      // Numbers ko validate aur convert karna
      const payload = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      };

      const res = await api.post("/inventory/create", payload);

      if (res.data.success) {
        alert("Stock Added Successfully!");
        router.push("/inventory"); // Wapis list par le jaye ga
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Unable to add inventory. Check connection.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
          
          {/* Top Header Label */}
          <div className="bg-teal-600 p-6 text-white flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Add New Inventory</h1>
              <p className="text-teal-100 text-sm">Enter new stock arrival details</p>
            </div>
            <FaBox className="text-4xl opacity-20" />
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {errorMsg && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-red-700 text-sm font-medium">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Product Name */}
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
                   Product Name
                </label>
                <input 
                  type="text" 
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition" 
                  placeholder="e.g. Engine Oil 1L" 
                  required 
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Description (3-150 chars)</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition" 
                  rows={2}
                  placeholder="Details about the item..."
                  required
                />
              </div>

              {/* Supplier */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
                  <FaTruck className="text-teal-600" /> Supplier
                </label>
                <input 
                  type="text" 
                  value={formData.supplier}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition" 
                  placeholder="Supplier Name" 
                  required 
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Category</label>
                <input 
                  type="text" 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition" 
                  placeholder="e.g. Hardware" 
                />
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Price (Rs.)</label>
                <input 
                  type="number" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition" 
                  placeholder="0.00" 
                  required 
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Quantity</label>
                <input 
                  type="number" 
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition" 
                  placeholder="0" 
                  required 
                />
              </div>

              {/* Location */}
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
                  <FaMapMarkerAlt className="text-teal-600" /> Warehouse Location
                </label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition" 
                  placeholder="e.g. Shelf A-1" 
                />
              </div>
            </div>

            {/* Form Buttons */}
            <div className="flex gap-4 pt-6 border-t mt-4">
              <button 
                type="button"
                onClick={() => router.push("/inventory")}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition"
              >
                <FaArrowLeft /> Back to List
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 shadow-lg transition active:scale-95 disabled:opacity-50"
              >
                <FaSave /> {loading ? "Saving..." : "Save Stock"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}