import { Supplier } from "../types/supplier";

const STORAGE_KEY = "suppliers";

export const createSupplier = (
  supplier: Omit<Supplier, "id">
): Supplier => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const suppliers: Supplier[] = stored ? JSON.parse(stored) : [];

  const newSupplier: Supplier = {
    id: Date.now(),
    ...supplier,
  };

  const updatedSuppliers = [...suppliers, newSupplier];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSuppliers));

  return newSupplier;
};
