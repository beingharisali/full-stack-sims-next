import { Supplier } from "../types/supplier";
import { getSupplierById as getById } from "./supplierservices";

/**
 * Get single supplier by id
 */
export const getSupplier = (id: number): Supplier | undefined => {
  return getById(id);
};
