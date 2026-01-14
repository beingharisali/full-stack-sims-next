"use client";

import ProtectedRoute from "../utils/protectedroutes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Sale = {
  id: number;
  product: string;
  quantity: number;
  total: number;
};

const DEFAULT_SALES: Sale[] = [
  { id: 1, product: "Laptop", quantity: 2, total: 2400 },
  { id: 2, product: "Mouse", quantity: 5, total: 100 },
  { id: 3, product: "Keyboard", quantity: 3, total: 150 },
];

export default function SalesPage() {
  const router = useRouter();

  const [sales, setSales] = useState<Sale[]>([]);
  const [editing, setEditing] = useState<Sale | null>(null);

  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [total, setTotal] = useState<number | "">("");

  useEffect(() => {
    const stored = localStorage.getItem("sales");
    setSales(stored ? JSON.parse(stored) : DEFAULT_SALES);
  }, []);

  const save = (data: Sale[]) => {
    setSales(data);
    localStorage.setItem("sales", JSON.stringify(data));
  };

  const handleDelete = (id: number) => {
    save(sales.filter((s) => s.id !== id));
  };

  const handleEdit = (sale: Sale) => {
    setEditing(sale);
    setProduct(sale.product);
    setQuantity(sale.quantity);
    setTotal(sale.total);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    const updated = sales.map((s) =>
      s.id === editing.id
        ? { ...s, product, quantity: Number(quantity), total: Number(total) }
        : s
    );

    save(updated);
    setEditing(null);
  };

  return (
    <ProtectedRoute role="sales">
      {/* ⬇️ tumhara poora existing UI same ka same */}
      <div className="p-6">
        {/* summary, table, modal — unchanged */}
        {/* (tumhara code yahan exactly same rahega) */}
      </div>
    </ProtectedRoute>
  );
}
