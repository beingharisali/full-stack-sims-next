"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ProtectedRoute from "../../components/protectedroutes";
import api from "../../utils/api";

type Supplier = {
  _id: string;
  name: string;
};

export default function AddInventoryPage() {
  const router = useRouter();

  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [supplier, setSupplier] = useState("");

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await api.get("/supplier/get");
        if (res.data.success) {
          setSuppliers(res.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch suppliers");
      }
    };

    fetchSuppliers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        productName,
        description,
        category,
        price: Number(price),
        supplier,
        quantity: Number(quantity),
        location,
      };

      const res = await api.post("/inventory/create", payload);

      if (res.data.success) {
        router.push("/inventory");
      } else {
        setErrorMsg(res.data.message || "Unable to create inventory");
      }
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Unable to create inventory",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
        <h2 className="text-xl font-bold mb-4">Add Inventory</h2>

        {errorMsg && <p className="text-red-500 mb-3">{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="border p-2 w-full rounded"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />

          <input
            type="number"
            className="border p-2 w-full rounded"
            placeholder="Quantity"
            min={0}
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
          />

          <input
            className="border p-2 w-full rounded"
            placeholder="Location (Optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            className="border p-2 w-full rounded"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            className="border p-2 w-full rounded"
            placeholder="Category (Optional)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            type="number"
            className="border p-2 w-full rounded"
            placeholder="Price"
            min={0}
            value={price}
            onChange={(e) =>
              setPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
          />

          <select
            className="border p-2 w-full rounded"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            required
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Adding..." : "Add"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/inventory")}
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
