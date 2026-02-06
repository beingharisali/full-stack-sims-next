"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../components/protectedroutes";
import api from "../utils/api";

interface InvoiceItem {
  productId: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Invoice {
  _id: string;
  customer_name: string;
  customer_email: string;
  items: InvoiceItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  status: string;
  createdAt: string;
  createdBy?: string;
}

export default function InvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all invoices
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/invoice");
      if (res.data.success) {
        setInvoices(res.data.data);
      } else {
        setError(res.data.message || "Failed to fetch invoices");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Delete invoice
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    try {
      setLoading(true);
      const res = await api.delete(`/invoice/${id}`);
      if (res.data.success) {
        setInvoices(invoices.filter((inv) => inv._id !== id));
      } else {
        setError(res.data.message || "Failed to delete invoice");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "manager", "saler"]}>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          All Invoices
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {loading ? (
          <p className="text-center">Loading invoices...</p>
        ) : invoices.length === 0 ? (
          <p className="text-center">No invoices found.</p>
        ) : (
          <div className="space-y-6">
            {invoices.map((invoice) => (
              <div
                key={invoice._id}
                className="border rounded p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between mb-2">
                  <div>
                    <p>
                      <span className="font-semibold">Customer:</span>{" "}
                      {invoice.customer_name} ({invoice.customer_email})
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      {invoice.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>
                      <span className="font-semibold">Total:</span> $
                      {invoice.total_amount}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(invoice.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-2">
                  <p className="font-semibold mb-1">Items:</p>
                  <ul className="list-disc list-inside">
                    {invoice.items.map((item, idx) => (
                      <li key={idx}>
                        {item.description} - Qty: {item.quantity} | Unit: $
                        {item.unit_price} | Total: ${item.total_price}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Delete button */}
                <div className="mt-3 text-right">
                  <button
                    onClick={() => handleDelete(invoice._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
