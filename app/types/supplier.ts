// Supplier status type
export type SupplierStatus = "active" | "inactive";

// Main Supplier type
export type Supplier = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: SupplierStatus;
  createdAt: string;
  updatedAt?: string;
};

// Create Supplier (form / POST)
export type CreateSupplierPayload = {
  name: string;
  email: string;
  phone: string;
  address: string;
  status?: SupplierStatus;
};

// Update Supplier (PUT / PATCH)
export type UpdateSupplierPayload = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: SupplierStatus;
};
