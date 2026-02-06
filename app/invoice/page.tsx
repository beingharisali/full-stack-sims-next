"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../components/protectedroutes";
import api from "../utils/api";
import { useRouter } from "next/navigation";

interface ProductItem {
  productId: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export default function InvoicePage() {
  const router = useRouter();

  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);

  const invoiceData = {
    customer_name: "Test Customer",
    customer_email: "test@gmail.com",
    items,
    subtotal,
    tax_amount: 0,
    discount_amount: 0,
    total_amount: subtotal,
    status: "paid",
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        productId: "",
        description: "",
        quantity: 1,
        unit_price: 0,
        total_price: 0,
      },
    ]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    if (field === "quantity" || field === "unit_price") {
      updated[index].total_price =
        updated[index].quantity * updated[index].unit_price;
    }

    setItems(updated);
  };

  const handleCreateInvoice = async () => {
    try {
      setLoading(true);
      setError("");

      // 1️⃣ Create invoice
      await api.post("/invoice", invoiceData);

      // 2️⃣ Create sales
      await api.post("/sales/create", {
        items: invoiceData.items,
        totalAmount: invoiceData.total_amount,
      });

      // 3️⃣ Deduct stock
      for (const item of invoiceData.items) {
        await api.post("/stock/deduct", {
          productId: item.productId,
          quantity: item.quantity,
        });
      }

      router.push("/sales");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "manager", "saler"]}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Create Invoice
        </h1>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        {items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-3 mb-3">
            <input
              placeholder="Product ID"
              className="border p-2"
              value={item.productId}
              onChange={(e) => updateItem(idx, "productId", e.target.value)}
            />
            <input
              placeholder="Description"
              className="border p-2"
              value={item.description}
              onChange={(e) => updateItem(idx, "description", e.target.value)}
            />
            <input
              type="number"
              placeholder="Qty"
              className="border p-2"
              value={item.quantity}
              onChange={(e) =>
                updateItem(idx, "quantity", Number(e.target.value))
              }
            />
            <input
              type="number"
              placeholder="Unit Price"
              className="border p-2"
              value={item.unit_price}
              onChange={(e) =>
                updateItem(idx, "unit_price", Number(e.target.value))
              }
            />
          </div>
        ))}

        <button
          onClick={addItem}
          className="bg-gray-600 text-white px-4 py-2 rounded mb-4"
        >
          + Add Item
        </button>

        <div className="text-right font-semibold mb-4">Total: {subtotal}</div>

        <button
          onClick={handleCreateInvoice}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded w-full"
        >
          {loading ? "Creating..." : "Create Invoice"}
        </button>
      </div>
    </ProtectedRoute>
  );
}
