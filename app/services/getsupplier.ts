import { Supplier } from "../types/supplier";
import { getSuppliers as getAllSuppliers } from "./supplierservices";

/**
 * Get all suppliers
 * (Wrapper service for supplierService)
 */
export const getSuppliers = (): Supplier[] => {
  return getAllSuppliers();
};
