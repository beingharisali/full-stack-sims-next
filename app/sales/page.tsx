"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaShoppingCart, FaHistory, FaMoneyBillWave, FaTrash, FaEdit } from "react-icons/fa";
import ProtectedRoute from "../components/protectedroutes";
import api from "../utils/api";

interface Sale {
  _id: string;
  productName: string;
  quantity: number;
  total: number;
  createdAt: string;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    productName: "",
    quantity: 1,
    unitPrice: 0, // Sirf calculation ke liye
    total: 0,
  });

  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await api.get("/sales/get");
      if (res.data.success) setSales(res.data.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSales(); }, []);

  // Auto-calculate total whenever quantity or unitPrice changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      total: prev.quantity * prev.unitPrice
    }));
  }, [formData.quantity, formData.unitPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/sales/create", {
        productName: formData.productName,
        quantity: Number(formData.quantity),
        total: Number(formData.total),
      });

      if (res.data.success) {
        setSales([res.data.data, ...sales]);
        alert("Sale Recorded Successfully!");
        closeModal();
      }
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.message || "Failed to save sale"));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ productName: "", quantity: 1, unitPrice: 0, total: 0 });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this sale record?")) return;
    try {
      await api.delete(`/sales/delete/${id}`);
      setSales(sales.filter((s) => s._id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "manager", "saler"]}>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          {/* HEADER SECTION */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaShoppingCart className="text-teal-600" /> Sales Management
              </h1>
              <p className="text-gray-500 text-sm font-medium">Track your daily transactions</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg transition-all active:scale-95"
            >
              <FaPlus /> New Sale
            </button>
          </div>

          {/* SALES TABLE */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total Amount</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={5} className="p-10 text-center text-gray-400 font-medium italic">Syncing sales data...</td></tr>
                  ) : sales.length === 0 ? (
                    <tr><td colSpan={5} className="p-10 text-center text-gray-400 font-medium italic">No sales recorded yet.</td></tr>
                  ) : (
                    sales.map((s) => (
                      <tr key={s._id} className="hover:bg-teal-50/30 transition-colors">
                        <td className="p-4 text-sm text-gray-500">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-gray-800">{s.productName}</p>
                        </td>
                        <td className="p-4 text-sm font-bold text-gray-600">
                          {s.quantity}
                        </td>
                        <td className="p-4 text-sm font-bold text-teal-600">
                          Rs. {s.total.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-4">
                            <button className="text-teal-600 hover:text-teal-800 transition-colors"><FaEdit size={16} /></button>
                            <button onClick={() => handleDelete(s._id)} className="text-red-500 hover:text-red-700 transition-colors"><FaTrash size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* NEW SALE MODAL */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                <div className="bg-teal-600 p-4 text-white font-bold text-lg flex items-center gap-2">
                  <FaMoneyBillWave /> Record New Sale
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name</label>
                    <input type="text" value={formData.productName} onChange={(e) => setFormData({...formData, productName: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Enter product name" required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</label>
                      <input type="number" min="1" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})} className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unit Price (Rs)</label>
                      <input type="number" value={formData.unitPrice} onChange={(e) => setFormData({...formData, unitPrice: Number(e.target.value)})} className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" required />
                    </div>
                  </div>

                  <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                    <p className="text-xs font-bold text-teal-600 uppercase mb-1">Total Bill</p>
                    <p className="text-2xl font-black text-teal-700">Rs. {formData.total.toLocaleString()}</p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={closeModal} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-lg font-bold">Cancel</button>
                    <button type="submit" className="flex-1 bg-teal-600 text-white py-2.5 rounded-lg font-bold hover:bg-teal-700 shadow-md">
                      Confirm Sale
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </ProtectedRoute>
  );
}