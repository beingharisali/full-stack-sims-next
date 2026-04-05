"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaBox, FaTruck, FaMapMarkerAlt, FaEdit, FaTrash } from "react-icons/fa";
import ProtectedRoute from "../components/protectedroutes";
import api from "../utils/api";

// Model ke mutabiq Interface
interface InventoryItem {
  _id: string;
  productName: string;
  description: string;
  category: string;
  price: number;
  supplier: string;
  quantity: number;
  location: string;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State (As per your Mongoose Schema)
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    category: "",
    price: 0,
    supplier: "",
    quantity: 0,
    location: "warehouse",
  });

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get("/inventory/get");
      if (res.data.success) setInventory(res.data.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.put(`/inventory/update/${editingId}`, formData);
        if (res.data.success) {
          setInventory(inventory.map((item) => (item._id === editingId ? res.data.data : item)));
          alert("Inventory updated successfully!");
        }
      } else {
        const res = await api.post("/inventory/create", formData);
        if (res.data.success) {
          setInventory([res.data.data, ...inventory]);
          alert("Item added to inventory!");
        }
      }
      closeModal();
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.message || "Validation failed"));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ productName: "", description: "", category: "", price: 0, supplier: "", quantity: 0, location: "warehouse" });
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item._id);
    setFormData({
      productName: item.productName,
      description: item.description,
      category: item.category || "",
      price: item.price,
      supplier: item.supplier,
      quantity: item.quantity,
      location: item.location || "warehouse",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`/inventory/delete/${id}`);
      setInventory(inventory.filter((item) => item._id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaBox className="text-teal-600" /> Inventory Management
            </h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg transition-transform active:scale-95"
            >
              <FaPlus /> Add New Stock
            </button>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Product & Description", "Supplier", "Qty", "Price", "Location", "Actions"].map((th) => (
                      <th key={th} className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{th}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={6} className="p-10 text-center text-gray-400">Loading inventory data...</td></tr>
                  ) : (
                    inventory.map((item) => (
                      <tr key={item._id} className="hover:bg-teal-50/30 transition-colors group">
                        <td className="p-4">
                          <p className="font-bold text-gray-800">{item.productName}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{item.description}</p>
                        </td>
                        <td className="p-4 text-sm flex items-center gap-2 text-gray-600">
                          <FaTruck className="text-gray-300" /> {item.supplier}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.quantity > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {item.quantity} units
                          </span>
                        </td>
                        <td className="p-4 text-sm font-bold text-teal-600">Rs. {item.price.toLocaleString()}</td>
                        <td className="p-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1 uppercase"><FaMapMarkerAlt /> {item.location}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(item)} className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg"><FaEdit /></button>
                            <button onClick={() => handleDelete(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Form */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                <div className="bg-teal-600 p-4 text-white font-bold text-lg">
                  {editingId ? "Edit Stock Item" : "Add New Stock Item"}
                </div>
                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Product Name</label>
                    <input type="text" value={formData.productName} onChange={(e) => setFormData({...formData, productName: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" required />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Description (3-150 chars)</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" rows={2} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Category</label>
                    <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Parts" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Supplier</label>
                    <input type="text" value={formData.supplier} onChange={(e) => setFormData({...formData, supplier: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Price (Rs.)</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Quantity</label>
                    <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})} className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" required />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Warehouse Location</label>
                    <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div className="col-span-2 flex gap-3 pt-4 border-t">
                    <button type="button" onClick={closeModal} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-lg font-bold">Cancel</button>
                    <button type="submit" className="flex-1 bg-teal-600 text-white py-2.5 rounded-lg font-bold hover:bg-teal-700 shadow-md">
                      {editingId ? "Update Item" : "Save Item"}
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