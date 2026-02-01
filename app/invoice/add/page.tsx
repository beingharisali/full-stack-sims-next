"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProtectedRoute from "../../components/protectedroutes";
import api from "../../utils/api";

export default function AddInvoicePage() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const numericAmount = Number(amount);

    const payload = {
      invoice_number: `INV-${Date.now()}`,
      customer_name: customerName,
      customer_email: customerEmail,

      items: [
        {
          description,
          quantity: 1,
          unit_price: numericAmount,
          total_price: numericAmount,
        },
      ],

      subtotal: numericAmount,
      tax_amount: 0,
      discount_amount: 0,
      total_amount: numericAmount,
      status,
    };

    console.log("🚀 Sending invoice payload:", payload);

    try {
      const res = await api.post("/invoice", payload);
      console.log("✅ Invoice created:", res.data);
      router.push("/invoice");
    } catch (err: any) {
      console.error(
        "❌ Create invoice error:",
        err.response?.data || err.message,
      );
      setErrorMsg(err.response?.data?.message || "Unable to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "sales"]}>
      <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Add Invoice</h2>

        {errorMsg && <p className="text-red-500 mb-3">{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />

          <input
            type="email"
            placeholder="Customer Email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />

          <input
            placeholder="Item Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />

          <input
            type="number"
            placeholder="Amount"
            min={200}
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="border p-2 w-full rounded"
            required
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>

          <div className="flex gap-2">
            <button
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/invoice")}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
