"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaTrash, FaArrowLeft, FaSave, FaFlask } from "react-icons/fa";
import ProtectedRoute from "../../components/protectedroutes";
import api from "../../utils/api";

export default function AddInvoice() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    invoice_number: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    customer_name: "",
    customer_email: "",
    // Notice: Yahan ab sirf description hai, 'product' ID nahi
    items: [{ description: "", quantity: 1, unit_price: 0, total_price: 0 }],
    subtotal: 0,
    tax_amount: 0,
    discount_amount: 0,
    total_amount: 0,
    status: "paid",
    due_date: new Date().toISOString().split('T')[0],
    notes: "",
  });

  // ✅ CALCULATE TOTALS
  useEffect(() => {
    const subtotal = form.items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.unit_price)), 0);
    const tax = Number(form.tax_amount) || 0;
    const discount = Number(form.discount_amount) || 0;
    const total = subtotal + tax - discount;
    
    setForm(prev => ({
      ...prev,
      subtotal,
      total_amount: total < 0 ? 0 : total
    }));
  }, [form.items, form.tax_amount, form.discount_amount]);

  // ✅ HANDLE MANUAL INPUT CHANGES
  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...form.items];
    
    if (field === "description") {
      newItems[index].description = value;
    } else {
      newItems[index] = { ...newItems[index], [field]: Number(value) || 0 };
    }
    
    if (field === "quantity" || field === "unit_price") {
      newItems[index].total_price = Number(newItems[index].quantity) * Number(newItems[index].unit_price);
    }
    
    setForm({ ...form, items: newItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: "", quantity: 1, unit_price: 0, total_price: 0 }]
    });
  };

  const removeItem = (index: number) => {
    if (form.items.length > 1) {
      setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
    }
  };

  // ✅ SUBMIT FORM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Khali rows rokein
    const validItems = form.items.filter(item => item.description.trim() !== "");

    if (validItems.length === 0) {
      alert("Please enter at least one product name!");
      return;
    }

    const payload = { ...form, items: validItems };
    setLoading(true);

    try {
      const res = await api.post("/invoice", payload); 
      if (res.data.success || res.status === 200 || res.status === 201) {
        alert("Paragon Invoice Created Successfully!");
        router.push("/invoice");
      }
    } catch (err: any) {
      console.error("Submit Error:", err);
      alert(err.response?.data?.message || "Error saving invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="p-6 bg-[#f8fafc] min-h-screen font-sans text-slate-700">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-teal-600 font-semibold transition-all">
              <FaArrowLeft /> Back to List
            </button>
            <h1 className="text-xl font-bold uppercase tracking-tight text-slate-800">New Bill — Paragon Labs</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* BOX 1: Customer Details */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Invoice Number</label>
                <input type="text" value={form.invoice_number} readOnly className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl font-bold text-teal-600 outline-none cursor-not-allowed" />
              </div>
              <div className="col-span-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Customer Name</label>
                <input type="text" required placeholder="Full Name" className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-medium transition-all" 
                  onChange={(e) => setForm({...form, customer_name: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Customer Email</label>
                <input type="email" required placeholder="email@domain.com" className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-medium transition-all" 
                  onChange={(e) => setForm({...form, customer_email: e.target.value})} />
              </div>
            </div>

            {/* BOX 2: MANUAL TEXT INPUT TABLE */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-slate-800 flex items-center gap-2 uppercase text-sm tracking-tighter">
                  <FaFlask className="text-teal-600" /> Services / Products
                </h2>
                <button type="button" onClick={addItem} className="text-teal-600 font-bold text-xs uppercase flex items-center gap-1 hover:bg-teal-50 px-3 py-1 rounded-lg transition-all">
                  <FaPlus size={10} /> Add Line
                </button>
              </div>

              <div className="space-y-4">
                {form.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-center border-b border-slate-50 pb-4">
                    
                    {/* 👇 YAHAN AB DROPDOWN NAHI, BAKE TEXT INPUT HAI 👇 */}
                    <div className="col-span-5">
                      <input 
                        type="text" 
                        required 
                        placeholder="Product ka naam likhein..." 
                        className="w-full border border-slate-100 p-3 rounded-xl text-sm outline-none bg-slate-50/50 focus:ring-2 focus:ring-teal-500 font-medium"
                        value={item.description} 
                        onChange={(e) => handleItemChange(index, "description", e.target.value)} 
                      />
                    </div>

                    <div className="col-span-2">
                      <input type="number" placeholder="Qty" min="1" required className="w-full border border-slate-100 p-3 rounded-xl text-sm outline-none text-center focus:ring-2 focus:ring-teal-500 font-medium"
                        value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <input type="number" placeholder="Price" min="0" required className="w-full border border-slate-100 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                        value={item.unit_price} onChange={(e) => handleItemChange(index, "unit_price", e.target.value)} />
                    </div>
                    <div className="col-span-2 text-right font-bold text-teal-600 text-sm pt-2">
                      Rs. {item.total_price.toLocaleString()}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button type="button" onClick={() => removeItem(index)} className="text-rose-300 hover:text-rose-600 transition-colors p-2">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BOX 3: Notes & Calculations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Additional Notes</label>
                <textarea rows={4} placeholder="Payment terms or instructions..." className="w-full flex-1 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 text-sm italic transition-all"
                  onChange={(e) => setForm({...form, notes: e.target.value})}></textarea>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center text-sm font-semibold text-slate-500">
                  <span>Subtotal</span>
                  <span>Rs. {form.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-xs font-bold text-slate-400 uppercase">Discount (-)</span>
                   <input type="number" min="0" className="w-24 border border-slate-100 p-2 rounded-lg text-right text-sm outline-none focus:border-teal-500 font-medium" 
                     onChange={(e) => setForm({...form, discount_amount: Number(e.target.value) || 0})} />
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-xs font-bold text-slate-400 uppercase">Sales Tax (GST) (+)</span>
                   <input type="number" min="0" className="w-24 border border-slate-100 p-2 rounded-lg text-right text-sm outline-none focus:border-teal-500 font-medium" 
                     onChange={(e) => setForm({...form, tax_amount: Number(e.target.value) || 0})} />
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                   <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">Grand Total</span>
                   <span className="text-2xl font-black text-teal-600 tracking-tighter">Rs. {form.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-teal-700 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50">
              <FaSave /> {loading ? "Processing..." : "Finalize & Save Invoice"}
            </button>

          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}