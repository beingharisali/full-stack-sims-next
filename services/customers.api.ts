import http from "./http";
import { Customers } from "@/types/customers";

export async function createCustomer(
  name: string,
  city: string,
  contactnumber: string,
  status: string,
  category: "wholesale" | "individual",
): Promise<{ customer: Customers }> {
  const res = await http.post("/create", {
    name,
    city,
    contactnumber,
    status,
    category,
  });
  return res.data;
}
export async function getCustomer(): Promise<{ customer: Customers }> {
  const res = await http.get("/get");
  return res.data;
}
export async function getSingleCustomer(
  id: string,
): Promise<{ customer: Customers }> {
  const res = await http.get("/get/${id}");
  return res.data;
}
export async function updateCustomer(
  name: string,
  city: string,
  contactnumber: string,
  status: string,
  category: "wholesale" | "individual",
  id: string,
): Promise<{ customer: Customers }> {
  const res = await http.put("/update/${id}", {
    name,
    city,
    contactnumber,
    status,
    category,
  });
  return res.data;
}
export async function deleteCustomer(
  id: string,
): Promise<{ customer: Customers }> {
  const res = await http.delete("/delete/${id}");
  return res.data;
}
