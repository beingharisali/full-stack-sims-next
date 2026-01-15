export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface InvoiceClient {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Invoice {
  _id?: string;
  invoiceNumber: string;
  client: InvoiceClient;
  items: InvoiceItem[];
  subTotal: number;
  tax: number;
  grandTotal: number;
  status: "pending" | "paid" | "cancelled";
  invoiceDate: Date;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
