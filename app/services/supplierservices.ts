import {
  Supplier,
  CreateSupplierPayload,
  UpdateSupplierPayload,
} from "../types/supplier";

const STORAGE_KEY = "suppliers";

/**
 * Get all suppliers
 */
export const getSuppliers = (): Supplier[] => {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Get single supplier by id
 */
export const getSupplierById = (id: number): Supplier | undefined => {
  const suppliers = getSuppliers();
  return suppliers.find((s) => s.id === id);
};

/**
 * Create supplier
 */
export const createSupplier = (
  payload: CreateSupplierPayload
): Supplier => {
  const suppliers = getSuppliers();

  const newSupplier: Supplier = {
    id: Date.now(),
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    address: payload.address,
    status: payload.status ?? "active",
    createdAt: new Date().toISOString(),
  };

  const updated = [...suppliers, newSupplier];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return newSupplier;
};

/**
 * Update supplier
 */
export const updateSupplier = (
  id: number,
  payload: UpdateSupplierPayload
): Supplier | null => {
  const suppliers = getSuppliers();

  let updatedSupplier: Supplier | null = null;

  const updated = suppliers.map((s) => {
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

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updatedSupplier;
};

/**
 * Delete supplier
 */
export const deleteSupplier = (id: number): boolean => {
  const suppliers = getSuppliers();
  const filtered = suppliers.filter((s) => s.id !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered.length !== suppliers.length;
};
