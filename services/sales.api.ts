import http from "./http";
import { Saler } from "../types/sales";

export async function createSaler(
  name: string,
  contactNumber: string, 
  category:
    |"mobile"
    |"laptop"
    | "headphones"
    | "tablet"
    | "televison"
    | "camera"
    | "smartwatch"
    | "accessories"
    | "home-appliances",
  status: string,
  orderitems: number,
):Promise<{saler:Saler}> {
    const res =await http.post("/",{name,orderitems,contactNumber,status,category})
    return res.data;
}
export async function getSaler():Promise<{saler:Saler[]}> {
const res =await http.get("/get");
return res.data    
}
// export async function getSingleSaler(id:string):Promise<{saler:Saler}>{
//     const res =await http.get(`/get/${id}`);
//     return res.data
// }
// export async function updateSaler(
//      name: string,
//   contactNumber: string, 
//   category:
//     |"mobile"
//     |"laptop"
//     | "headphones"
//     | "tablet"
//     | "televison"
//     | "camera"
//     | "smartwatch"
//     | "accessories"
//     | "home-appliances",
//   status: string,
//   orderitems: number,
//   id:string,
// ):Promise<{saler:Saler}> {
//     const res=await http.put(`/update/${id}`,{name,orderitems,contactNumber, id, status,category})
// return res.data    
// }
// export async function deleteSaler(id:string):Promise<{saler:Saler}> {
//     const res= await http.delete(`/delete/${id}`)
//     return res.data
    
// }