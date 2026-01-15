import http from "./http";
import { Invoice } from "../types/invoice";

export async function createInvoice(
  invoiceNumber: string,
  client: {
    name: string;
    email: string;
    phone: string;
    address: string;
  },
  items: {
    description: string;
    quantity: number;
    price: number;
    total: number;
  },
  subTotal: number,
  tax: number,
  grandTotal: number,
  status: "pending" | "paid" | "cancelled",
  invoiceDate: Date,
  dueDate: Date
): Promise<{ invoice: Invoice }> {
  const res = await http.post("/", {
    invoiceNumber,
    client,
    items,
    subTotal,
    tax,
    grandTotal,
    status,
    invoiceDate,
    dueDate,
  });
  return res.data;
}

export async function getInvoices(): Promise<{ invoices: Invoice[] }> {
  const res = await http.get("/");
  return res.data;
}

export async function getSingleInvoice(
  id: string
): Promise<{ invoice: Invoice }> {
  const res = await http.get(`/${id}`);
  return res.data;
}

export async function updateInvoice(
  id: string,
  invoiceNumber: string,
  client: {
    name: string;
    email: string;
    phone: string;
    address: string;
  },
  items: {
    description: string;
    quantity: number;
    price: number;
    total: number;
  }[],
  subTotal: number,
  tax: number,
  grandTotal: number,
  status: "pending" | "paid" | "cancelled",
  invoiceDate: Date,
  dueDate: Date
): Promise<{ invoice: Invoice }> {
  const res = await http.put(`/${id}`, {
    invoiceNumber,
    client,
    items,
    subTotal,
    tax,
    grandTotal,
    status,
    invoiceDate,
    dueDate,
  });
  return res.data;
}

// export async function deleteInvoice(
//   id: string
// ): Promise<{ invoice: Invoice }> {
//   const res = await http.delete(`/${id}`);
//   return res.data;
// }
