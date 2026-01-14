"use client";

import ProtectedRoute from "../../utils/protectedroutes";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddSalePage() {
  const router = useRouter();

  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [total, setTotal] = useState<number | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const stored = localStorage.getItem("sales");
    const sales = stored ? JSON.parse(stored) : [];

    const newSale = {
      id: Date.now(),
      product,
      quantity: Number(quantity),
      total: Number(total),
    };

    localStorage.setItem("sales", JSON.stringify([...sales, newSale]));
    router.push("/sales");
  };

  return (
    <ProtectedRoute role="sales">
      <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
        {/* tumhara form exactly same */}
      </div>
    </ProtectedRoute>
  );
}
