const STORAGE_KEY = "suppliers";

/**
 * Delete supplier by id
 */
export const deleteSupplier = (id: number): boolean => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return false;

  const suppliers = JSON.parse(stored);
  const filtered = suppliers.filter((s: any) => s.id !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered.length !== suppliers.length;
};
