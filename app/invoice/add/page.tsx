"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/protectedroutes";
import api from "../../utils/api";
import { useRouter } from "next/navigation";

interface Product {
  category: string | number | readonly string[] | undefined;
  _id: string;
  name: string;
  stock: number;
  price: number;
}

interface InvoiceItem {
  category: string | number | readonly string[] | undefined;
  productId: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export default function SalerInvoiceAdd() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/get");
      if (res.data.success) {
        setProducts(res.data.data);
      } else {
        setError(res.data.message || "Failed to fetch products");
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error ? err.message : "Server error";
      setError(String(msg));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add empty item
  const addItem = () => {
    setItems([
      ...items,
      {
        productId: "",
        description: "",
        quantity: 1,
        unit_price: 0,
        total_price: 0,
        category: undefined,
      },
    ]);
  };

  // Update item
  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };

    const item = updated[index];

    if (field === "productId") {
      const prod = products.find((p) => p._id === value);
      if (prod) {
        item.description = prod.name;
        item.unit_price = prod.price;
        item.total_price = prod.price * item.quantity;
      }
    }

    if (field === "quantity") {
      item.total_price = item.unit_price * item.quantity;
    }

    if (field === "unit_price") {
      item.total_price = item.unit_price * item.quantity;
    }

    updated[index] = item;
    setItems(updated);
  };
  // Create invoice (backend auto-generates sales from invoice items)
  const handleCreateInvoice = async () => {
    if (!customerName || !customerEmail || items.length === 0) {
      alert("Please fill customer info and add at least one item");
      return;
    }

    try {
      setLoading(true);
      setError("");

      let createdBy: string | null = null;
      const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.token) {
            const payload = JSON.parse(atob(user.token.split(".")[1]));
            createdBy = payload.userId || payload._id || null;
          }
        } catch {
          // ignore
        }
      }

      const invoicePayload = {
        customer_name: customerName,
        customer_email: customerEmail,
        items: items.map(({ productId, description, quantity, unit_price, total_price }) => ({
          description,
          quantity,
          unit_price,
          total_price,
        })),
        subtotal,
        tax_amount: 0,
        discount_amount: 0,
        total_amount: subtotal,
        status: "paid",
        ...(createdBy && { createdBy }),
      };

      await api.post("/invoice", invoicePayload);
      router.push("/invoice");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error ? err.message : "Something went wrong";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "manager", "saler"]}>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Create Invoice
        </h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              placeholder="Enter customer name"
              className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Email
            </label>
            <input
              type="email"
              placeholder="Enter customer email"
              className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Invoice Items */}
        {items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Category
              </label>
              <select
                className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={item.category}
                onChange={(e) => updateItem(idx, "category", e.target.value)}
              >
                <option value="">Select Category</option>
                {[
                  "mobile",
                  "laptop",
                  "headphones",
                  "tablet",
                  "televison",
                  "camera",
                  "smartwatch",
                  "accessories",
                  "home-appliances",
                ].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Select */}
            <select
              className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={item.productId || ""}
              onChange={(e) => updateItem(idx, "productId", e.target.value)}
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} (${p.price})
                </option>
              ))}
            </select>

            {/* Description (editable) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                placeholder="Enter description"
                className="border border-gray-300 p-3 w-full rounded"
                value={item.description}
                onChange={(e) => updateItem(idx, "description", e.target.value)}
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                min={1}
                className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(idx, "quantity", Number(e.target.value))
                }
              />
            </div>

            {/* Unit Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Price
              </label>
              <input
                type="number"
                min={0}
                className="border border-gray-300 p-3 w-full rounded"
                value={item.unit_price}
                onChange={(e) =>
                  updateItem(idx, "unit_price", Number(e.target.value))
                }
              />
            </div>
          </div>
        ))}

        <button
          onClick={addItem}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mb-6"
        >
          + Add Item
        </button>

        <div className="text-right text-lg font-semibold mb-6">
          Total: <span className="text-teal-600">${subtotal}</span>
        </div>

        <button
          onClick={handleCreateInvoice}
          disabled={loading}
          className="bg-teal-600 text-white px-6 py-3 rounded w-full hover:bg-teal-700"
        >
          {loading ? "Creating..." : "Create Invoice"}
        </button>
      </div>
    </ProtectedRoute>
  );
}
