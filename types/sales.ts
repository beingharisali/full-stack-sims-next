export interface Saler {
  id: string;
  name: string;
  contactNumber: string; 
  category:
    |"mobile"
    |"laptop"
    | "headphones"
    | "tablet"
    | "televison"
    | "camera"
    | "smartwatch"
    | "accessories"
    | "home-appliances";
  status: string;
  orderitems: number;
}
