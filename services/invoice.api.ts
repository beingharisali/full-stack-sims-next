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
<<<<<<< HEAD
  dueDate: Date,
=======
  dueDate: Date
>>>>>>> 216487e7feb4ac443c647a48ba5830963bd0a7e8
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
<<<<<<< HEAD
  id: string,
=======
  id: string
>>>>>>> 216487e7feb4ac443c647a48ba5830963bd0a7e8
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
<<<<<<< HEAD
  dueDate: Date,
=======
  dueDate: Date
>>>>>>> 216487e7feb4ac443c647a48ba5830963bd0a7e8
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

<<<<<<< HEAD
export async function deleteInvoice(id: string): Promise<{ invoice: Invoice }> {
=======
export async function deleteInvoice(
  id: string
): Promise<{ invoice: Invoice }> {
>>>>>>> 216487e7feb4ac443c647a48ba5830963bd0a7e8
  const res = await http.delete(`/${id}`);
  return res.data;
}
