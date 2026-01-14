import { Customers } from "../types/customers"
const API_URL = "http://localhost:5000/api/customers";

class CustomerService {
  async getAll(): Promise<Customers[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch customers");
    return res.json();
  }

//   // 🔹 Get single customer by ID
//   async getById(id: string): Promise<Customers> {
//     // API call with customer ID
//     const res = await fetch(`${API_URL}/${id}`);

//     // Error handling
//     if (!res.ok) throw new Error("Failed to fetch customer");

//     // JSON response return
//     return res.json();
//   }

//   // 🔹 Create new customer
//   async create(
//     data: Omit<Customers, "id"> // id backend generate karega
//   ): Promise<Customers> {
//     const res = await fetch(API_URL, {
//       method: "POST", // HTTP method
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data), // request body
//     });

//     if (!res.ok) throw new Error("Failed to create customer");

//     return res.json();
//   }

//   // 🔹 Update existing customer
//   async update(
//     id: string, // customer ID
//     data: Partial<Customers> // sirf updated fields
//   ): Promise<Customers> {
//     const res = await fetch(`${API_URL}/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     if (!res.ok) throw new Error("Failed to update customer");

//     return res.json();
//   }

  // 🔹 Delete customer
//   async delete(id: string): Promise<void> {
//     const res = await fetch(`${API_URL}/${id}`, {
//       method: "DELETE",
//     });

//     if (!res.ok) throw new Error("Failed to delete customer");
//   }
}

// Single instance export (use directly anywhere)
export default new CustomerService();
