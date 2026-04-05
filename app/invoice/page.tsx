"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaFileInvoiceDollar, FaTrash, FaEye, FaEdit, FaPrint, FaFilePdf, FaTimes, FaFlask } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ProtectedRoute from "../components/protectedroutes";
import api from "../utils/api";

export default function InvoicePage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/invoice");
      if (res.data.success) setInvoices(res.data.data || []);
    } catch (err: any) { console.error("Error fetching"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchInvoices(); }, []);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `PARAGON_INV_${selectedInvoice?.invoice_number}`,
  });

  const downloadPDF = async () => {
    const element = contentRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 3 });
    const data = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Paragon_Invoice_${selectedInvoice?.invoice_number}.pdf`);
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="p-6 bg-[#fcfcfc] min-h-screen font-sans">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8 border-b pb-5">
            <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tighter">
                <FaFlask className="text-teal-600" /> Paragon Laboratories
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Billing Management</p>
            </div>
            <button onClick={() => router.push("/invoice/add")} className="bg-teal-600 text-white px-10 py-5 rounded-2xl text-x font-bold hover:bg-teal-600 shadow-xl transition-all flex items-center gap-2">
              <FaPlus /> New Invoice
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  <th className="p-5">Invoice #</th>
                  <th className="p-5">Customer</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Total Amount</th>
                  <th className="p-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr><td colSpan={5} className="p-20 text-center text-slate-300 italic font-medium">Syncing invoices...</td></tr>
                ) : invoices.map((inv) => (
                  <tr key={inv._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 font-bold text-slate-700">{inv.invoice_number}</td>
                    <td className="p-5 text-slate-500 font-medium">{inv.customer_name}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${inv.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-5 font-bold text-teal-700">Rs. {inv.total_amount.toLocaleString()}</td>
                    <td className="p-5 flex justify-center gap-5">
                      <button onClick={() => { setSelectedInvoice(inv); setShowModal(true); }} className="text-slate-400 hover:text-teal-600 transition-all transform hover:scale-110"><FaEye size={18} /></button>
                      <button onClick={() => router.push(`/invoice/edit/${inv._id}`)} className="text-slate-400 hover:text-blue-500 transition-all transform hover:scale-110"><FaEdit size={18} /></button>
                      <button className="text-slate-300 hover:text-rose-500 transition-all transform hover:scale-110"><FaTrash size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- MODERN CENTERED PREVIEW MODAL --- */}
          {showModal && selectedInvoice && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <div className="bg-white w-[60%] max-h-[95vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300">
                
                {/* Modal Header */}
                <div className="p-5 border-b flex justify-between items-center bg-slate-50/50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Official Document</span>
                  <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"><FaTimes size={18} /></button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-12 bg-[#f1f5f9]">
                  <div ref={contentRef} className="bg-white p-12 shadow-2xl rounded-sm mx-auto border border-slate-100 relative min-h-[1000px]">
                    
                    {/* Centered INVOICE Title */}
                    <div className="text-center mb-10">
                        <h1 className="text-5xl font-black text-slate-100 absolute left-0 right-0 top-10 opacity-40 uppercase tracking-[0.5em] -z-0">INVOICE</h1>
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Paragon Laboratories</h2>
                            <div className="w-16 h-1 bg-teal-500 mx-auto mt-2 rounded-full"></div>
                        </div>
                    </div>

                    {/* Top Details */}
                    <div className="flex justify-between items-start mt-16 mb-12 border-b-2 border-slate-900 pb-8">
                      <div>
                        <h3 className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-3">Client Information</h3>
                        <p className="text-lg font-bold text-slate-800 leading-none">{selectedInvoice.customer_name}</p>
                        <p className="text-xs text-slate-400 font-medium mt-2">{selectedInvoice.customer_email}</p>
                      </div>
                      <div className="text-right">
                        <h3 className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-3">Invoice Details</h3>
                        <p className="text-sm font-bold text-slate-800"># {selectedInvoice.invoice_number}</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-1">{new Date(selectedInvoice.createdAt).toLocaleDateString('en-GB', {day:'2-digit', month:'long', year:'numeric'})}</p>
                      </div>
                    </div>

                    {/* Items Table */}
                    <table className="w-full text-left mb-10">
                      <thead>
                        <tr className="border-b-2 border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="py-4">Service Description</th>
                          <th className="py-4 text-center">Qty</th>
                          <th className="py-4 text-right">Unit Price</th>
                          <th className="py-4 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs">
                        {selectedInvoice.items?.map((item: any, i: number) => (
                          <tr key={i} className="border-b border-slate-50">
                            <td className="py-5 font-bold text-slate-700 uppercase tracking-tighter">{item.description}</td>
                            <td className="py-5 text-center text-slate-500 font-medium">{item.quantity}</td>
                            <td className="py-5 text-right text-slate-500 font-medium">Rs. {item.unit_price.toLocaleString()}</td>
                            <td className="py-5 text-right font-black text-slate-900">Rs. {item.total_price.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Financial Breakdown */}
                    <div className="flex justify-end pt-10">
                      <div className="w-72 space-y-3">
                        <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                          <span>Subtotal</span>
                          <span className="text-slate-800">Rs. {selectedInvoice.subtotal?.toLocaleString() || "0"}</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-bold text-rose-400 uppercase tracking-widest">
                          <span>Discount</span>
                          <span>- Rs. {selectedInvoice.discount_amount?.toLocaleString() || "0"}</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-bold text-blue-500 uppercase tracking-widest">
                          <span>Sales Tax</span>
                          <span>+ Rs. {selectedInvoice.tax_amount?.toLocaleString() || "0"}</span>
                        </div>
                        <div className="flex justify-between text-lg font-black text-white bg-slate-900 p-5 rounded-2xl italic mt-6 shadow-xl shadow-slate-100">
                          <span className="tracking-tighter">GRAND TOTAL</span>
                          <span>Rs. {selectedInvoice.total_amount?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Notes */}
                    <div className="mt-24 border-t border-slate-100 pt-8 grid grid-cols-2 gap-10">
                      <div>
                        <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-3">Terms & Conditions</h4>
                        <p className="text-[10px] text-slate-400 leading-relaxed font-medium italic">
                          {selectedInvoice.notes || "This is a digital receipt of Paragon Laboratories. Payment is due within 15 days of invoice date."}
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end justify-end">
                         <div className="w-32 h-px bg-slate-200 mb-2"></div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Authorized Signature</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-6 border-t bg-white flex gap-5">
                  <button onClick={() => handlePrint()} className="flex-1 bg-slate-100 text-slate-800 py-4 rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-3 border border-slate-200">
                    <FaPrint size={14} /> Print Document
                  </button>
                  <button onClick={downloadPDF} className="flex-1 bg-teal-600 text-white py-4 rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-teal-700 shadow-xl shadow-teal-100 transition-all flex items-center justify-center gap-3">
                    <FaFilePdf size={14} /> Download PDF
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </ProtectedRoute>
  );
}