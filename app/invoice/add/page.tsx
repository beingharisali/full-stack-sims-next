"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddInvoicePage() {
  const router = useRouter();

  const [customer, setCustomer] = useState("");
  const [amount, setAmount] = useState<number | "">(""); // empty string for placeholder
  const [status, setStatus] = useState(""); // empty string for placeholder

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const stored = localStorage.getItem("invoices");
    const invoices = stored ? JSON.parse(stored) : [];

    const nextId = invoices.length > 0 ? invoices[invoices.length - 1].id + 1 : 1;

    invoices.push({
      id: nextId,
      customer,
      amount: Number(amount), // convert to number on save
      status,
    });

    localStorage.setItem("invoices", JSON.stringify(invoices));

    router.push("/invoice");
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Add Invoice</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer */}
        <input
          placeholder="Customer Name"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />

        {/* Amount */}
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
          className="border p-2 w-full rounded"
          required
        />

        {/* Status with placeholder */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full rounded"
          required
        >
          <option value="" disabled>
            Select Status
          </option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>

        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Save
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
  );
}
