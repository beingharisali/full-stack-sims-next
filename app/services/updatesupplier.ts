import { Supplier, UpdateSupplierPayload } from "../types/supplier";

const STORAGE_KEY = "suppliers";

/**
 * Update supplier by id
 */
export const updateSupplier = (
  id: number,
  payload: UpdateSupplierPayload
): Supplier | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  const suppliers: Supplier[] = JSON.parse(stored);
  let updatedSupplier: Supplier | null = null;

  const updatedSuppliers = suppliers.map((s) => {
    if (s.id === id) {
      updatedSupplier = {
        ...s,
        ...payload,
        updatedAt: new Date().toISOString(),
      };
      return updatedSupplier;
    }
    return s;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSuppliers));
  return updatedSupplier;
};
