import http from "./http";
import { Supplier } from "../types/supplier";

export async function createSupplier(
supplierGroup: String,
  name: string,
  contactnumber: string,
  status: string,
 category: String,
):Promise<{supplier:Supplier}> {
    const res =await http.post("/create",{name,supplierGroup,contactnumber,status,category})
    return res.data;
}
export async function getSupplier():Promise<{supplier:Supplier}> {
const res =await http.get("/get");
return res.data    
}
export async function getSingleSupplier(id:string):Promise<{supplier:Supplier}>{
    const res =await http.get("/get/${id}");
    return res.data
}
export async function updateSupplier(
      name: string,
  supplierGroup: string,
  contactnumber: string,
  status: string,
 category: string,
 id:string
):Promise<{supplier:Supplier}> {
    const res=await http.put("/update/${id}",{name,supplierGroup,contactnumber, id, status,category})
return res.data    
}
export async function deleteCustomer(id:string):Promise<{supplier:Supplier}> {
    const res= await http.delete("/delete/${id}")
    return res.data
    
}
