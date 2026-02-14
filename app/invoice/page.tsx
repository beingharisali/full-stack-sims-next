"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/protectedroutes";
import api from "../utils/api";
import html2pdf from "html2pdf.js";

interface InvoiceItem {
  productId?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface CreatedBy {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
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
  createdBy?: string | CreatedBy;
  createdByName?: string | null;
}

function createdByLabel(
  invoice: Pick<Invoice, "createdByName" | "createdBy">,
): string {
  if (invoice.createdByName && invoice.createdByName.trim())
    return invoice.createdByName;
  const createdBy = invoice.createdBy;
  if (!createdBy) return "—";
  if (typeof createdBy === "string") return createdBy;
  const c = createdBy as CreatedBy;
  if (c.firstName || c.lastName)
    return [c.firstName, c.lastName].filter(Boolean).join(" ");
  if (c.email) return c.email;
  return c._id ? String(c._id) : "—";
}

export default function InvoicePage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (
              err as {
                response?: { data?: { message?: string }; message?: string };
              }
            ).response?.data?.message
          : err instanceof Error
            ? err.message
            : "Server error";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

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
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : err instanceof Error
            ? err.message
            : "Server error";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (invoice: Invoice) => {
    const element = document.createElement("div");

    element.innerHTML = `
    <h2>Invoice</h2>
    <p><strong>Customer:</strong> ${invoice.customer_name}</p>
    <p><strong>Email:</strong> ${invoice.customer_email}</p>
    <p><strong>Status:</strong> ${invoice.status}</p>
    <p><strong>Total:</strong> Rs. ${invoice.total_amount}</p>
    <hr/>
    <h3>Items</h3>
    <ul>
      ${invoice.items
        .map(
          (item) =>
            `<li>
              ${item.description} - Qty: ${item.quantity} |
              Unit: Rs. ${item.unit_price} |
              Total: Rs. ${item.total_price}
            </li>`,
        )
        .join("")}
    </ul>
  `;

    html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: `Invoice-${invoice._id}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save();
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "manager", "saler"]}>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-center sm:text-left">
            All Invoices
          </h1>
          <button
            type="button"
            onClick={() => router.push("/invoice/add")}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 font-medium shrink-0"
          >
            Add Invoice
          </button>
        </div>

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
                    <p className="text-sm text-gray-600">
                      Created by: {createdByLabel(invoice)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>
                      <span className="font-semibold">Total:</span> Rs.{" "}
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
                        {item.description} - Qty: {item.quantity} | Unit: Rs.{" "}
                        {item.unit_price} | Total: Rs. {item.total_price}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 flex justify-end gap-3">
                  <button
                    onClick={() => handleDownload(invoice)}
                    className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Download
                  </button>

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
