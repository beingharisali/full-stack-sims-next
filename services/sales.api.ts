import http from "./http";
import { Saler } from "../types/sales";

export async function createSaler(
  name: string,
<<<<<<< HEAD
  contactNumber: string,
  category:
    | "mobile"
    | "laptop"
=======
  contactNumber: string, 
  category:
    |"mobile"
    |"laptop"
>>>>>>> 216487e7feb4ac443c647a48ba5830963bd0a7e8
    | "headphones"
    | "tablet"
    | "televison"
    | "camera"
    | "smartwatch"
    | "accessories"
    | "home-appliances",
  status: string,
  orderitems: number,
<<<<<<< HEAD
): Promise<{ saler: Saler }> {
  const res = await http.post("/", {
    name,
    orderitems,
    contactNumber,
    status,
    category,
  });
  return res.data;
}
export async function getSaler(): Promise<{ saler: Saler[] }> {
  const res = await http.get("/");
  return res.data;
}
export async function getSingleSaler(id: string): Promise<{ saler: Saler }> {
  const res = await http.get(`/${id}`);
  return res.data;
}
export async function updateSaler(
  name: string,
  contactNumber: string,
  category:
    | "mobile"
    | "laptop"
=======
):Promise<{saler:Saler}> {
    const res =await http.post("/",{name,orderitems,contactNumber,status,category})
    return res.data;
}
export async function getSaler():Promise<{saler:Saler[]}> {
const res =await http.get("/");
return res.data    
}
export async function getSingleSaler(id:string):Promise<{saler:Saler}>{
    const res =await http.get(`/${id}`);
    return res.data
}
export async function updateSaler(
     name: string,
  contactNumber: string, 
  category:
    |"mobile"
    |"laptop"
>>>>>>> 216487e7feb4ac443c647a48ba5830963bd0a7e8
    | "headphones"
    | "tablet"
    | "televison"
    | "camera"
    | "smartwatch"
    | "accessories"
    | "home-appliances",
  status: string,
  orderitems: number,
<<<<<<< HEAD
  id: string,
): Promise<{ saler: Saler }> {
  const res = await http.put(`/${id}`, {
    name,
    orderitems,
    contactNumber,
    id,
    status,
    category,
  });
  return res.data;
}
export async function deleteSaler(id: string): Promise<{ saler: Saler }> {
  const res = await http.delete(`/${id}`);
  return res.data;
}
=======
  id:string,
):Promise<{saler:Saler}> {
    const res=await http.put(`/${id}`,{name,orderitems,contactNumber, id, status,category})
return res.data    
}
export async function deleteSaler(id:string):Promise<{saler:Saler}> {
    const res= await http.delete(`/${id}`)
    return res.data
    
}
>>>>>>> 216487e7feb4ac443c647a48ba5830963bd0a7e8
