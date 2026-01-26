export interface Saler {
  id: string;
  name: string;
<<<<<<< HEAD
  contactNumber: string;
  category:
    | "mobile"
    | "laptop"
=======
  contactNumber: string; 
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
    | "home-appliances";
  status: string;
  orderitems: number;
}
