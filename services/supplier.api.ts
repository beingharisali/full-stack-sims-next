import http from "./http";
import {Supplier }  from "../types/supplier";

export async function createSupplier(
  name: string,
  supplierGroup : string,
  contactnumber: string,
  status: string,
 category: String
):Promise<{supplier:Supplier}> {
    const res =await http.post("/create",{name,supplierGroup, contactnumber,status,category})
    return res.data;
}
