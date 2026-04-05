"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaUserAlt, FaCity, FaPhone, FaTrash, FaEdit } from "react-icons/fa";
import ProtectedRoute from "../components/protectedroutes";
import api from "../utils/api";

// Model ke mutabiq Interface
interface Customer {
  _id: string;
  name: string;
  city: string;
  contactNumber: string;
  status: string;
  category: "wholesale" | "individual";
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    contactNumber: "",
    status: "Active",
    category: "individual", // Default as per enum
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/customer/get");
      if (res.data.success) setCustomers(res.data.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend Validations (Matches your Model)
    if (formData.contactNumber.length < 11 || formData.contactNumber.length > 15) {
      alert("Contact Number must be 11-15 digits.");
      return;
    }

    try {
      if (editingId) {
        const res = await api.put(`/customer/update/${editingId}`, formData);
        if (res.data.success) {
          setCustomers(customers.map((c) => (c._id === editingId ? res.data.data : c)));
          alert("Customer updated successfully!");
        }
      } else {
        const res = await api.post("/customer/create", formData);
        if (res.data.success) {
          setCustomers([res.data.data, ...customers]);
          alert("Customer added successfully!");
        }
      }
      closeModal();
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.message || "Check validations"));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", city: "", contactNumber: "", status: "Active", category: "individual" });
  };

  const handleEdit = (customer: Customer) => {
    setEditingId(customer._id);
    setFormData({
      name: customer.name,
      city: customer.city || "",
      contactNumber: customer.contactNumber,
      status: customer.status || "Active",
      category: customer.category,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await api.delete(`/customer/delete/${id}`);
      setCustomers(customers.filter((c) => c._id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "manager", "saler"]}>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          
          {/* HEADER SECTION */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Customer Database</h1>
              <p className="text-gray-500 text-sm">Manage your wholesale and individual clients</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg transition-all active:scale-95"
            >
              <FaPlus /> Add Customer
            </button>
          </div>

          {/* CUSTOMERS LIST SECTION */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer Info</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Details</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={5} className="p-10 text-center text-gray-400 italic font-medium">Syncing data...</td></tr>
                  ) : customers.length === 0 ? (
                    <tr><td colSpan={5} className="p-10 text-center text-gray-400">No customers found in database.</td></tr>
                  ) : (
                    customers.map((c) => (
                      <tr key={c._id} className="hover:bg-teal-50/30 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold">
                              {c.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800">{c.name}</p>
                              <p className="text-xs text-gray-400 flex items-center gap-1"><FaCity /> {c.city}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600 font-medium">
                          <span className="flex items-center gap-2"><FaPhone className="text-xs text-gray-300" /> {c.contactNumber}</span>
                        </td>
                        <td className="p-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${c.category === 'wholesale' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                            {c.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-semibold text-gray-700">{c.status || "N/A"}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(c)} className="p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition"><FaEdit /></button>
                            <button onClick={() => handleDelete(c._id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition"><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ADD/EDIT MODAL */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-teal-600 p-4 text-white">
                  <h2 className="text-lg font-bold">{editingId ? "Update Customer" : "Register New Customer"}</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Customer Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Min 2 chars" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                    <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Lahore, Karachi etc." />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Contact (11-15 digits)</label>
                    <input type="text" value={formData.contactNumber} onChange={(e) => setFormData({...formData, contactNumber: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" placeholder="03XXXXXXXXX" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                      <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as any})} className="w-full border border-gray-200 p-2.5 rounded-lg bg-white outline-none">
                        <option value="individual">Individual</option>
                        <option value="wholesale">Wholesale</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                      <input type="text" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" placeholder="Active/Inactive" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={closeModal} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-lg font-bold hover:bg-gray-200">Cancel</button>
                    <button type="submit" className="flex-1 bg-teal-600 text-white py-2.5 rounded-lg font-bold hover:bg-teal-700 shadow-md transition-all">
                      {editingId ? "Save Changes" : "Create Now"}
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