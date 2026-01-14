import http from "./http";
import { Customers } from "@/types/customers";

export async function createCustomers(
    name: string,
  city: string,
  contactnumber: string,
  status: string,
 category: "wholesale" | "individual",
):Promise<{customers:Customers}> {
    const res =await http.post("/create",{name,city,contactnumber,status,category})
    return res.data;
}
export async function getallProducts():Promise<{customers:Customers}> {
const res =await http.get("/get");
return res.data    
}