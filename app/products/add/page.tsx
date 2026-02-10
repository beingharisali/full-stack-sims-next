// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import ProtectedRoute from "../../components/protectedroutes";
// import api from "../../utils/api";

// type Supplier = { _id: string; name: string; supplierGroup: string };

// export default function AddProductPage() {
//   const router = useRouter();

//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [price, setPrice] = useState<number | "">("");
//   const [supplier, setSupplier] = useState("");
//   const [stock, setStock] = useState<number | "">("");
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchSuppliers = async () => {
//       try {
//         const res = await api.get("/supplier/get");
//         if (res.data.success) setSuppliers(res.data.data || []);
//       } catch {
//         // ignore
//       }
//     };
//     fetchSuppliers();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (Number(price) < 0) {
//       setErrorMsg("Price cannot be negative");
//       return;
//     }
//     if (Number(stock) < 0) {
//       setErrorMsg("Stock cannot be negative");
//       return;
//     }
//     if (!supplier) {
//       setErrorMsg("Please select a supplier");
//       return;
//     }

//     try {
//       setErrorMsg(null);
//       const res = await api.post("/products/create", {
//         name,
//         description,
//         category,
//         price: Number(price),
//         supplier,
//         stock: Number(stock),
//       });

//       if (res.data.success) {
//         router.push("/products");
//       } else {
//         setErrorMsg(res.data.message || "Unable to create product");
//       }
//     } catch (err: unknown) {
//       const msg =
//         err && typeof err === "object" && "response" in err
//           ? (err as { response?: { data?: { message?: string } } }).response
//               ?.data?.message
//           : err instanceof Error
//             ? err.message
//             : "Server error";
//       setErrorMsg(String(msg));
//     }
//   };

//   return (
//     <ProtectedRoute allowedRoles={["admin", "manager"]}>
//       <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
//         <h2 className="text-2xl font-bold mb-4">Add Product</h2>

//         {errorMsg && (
//           <p className="text-red-500 mb-3 font-medium">{errorMsg}</p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-3">
//           <input
//             type="text"
//             placeholder="Product Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="border p-2 w-full rounded"
//             required
//           />
//           <input
//             type="text"
//             placeholder="Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="border p-2 w-full rounded"
//             required
//           />
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="border p-2 w-full rounded"
//             required
//           >
//             <option value="">Select Category</option>
//             <option value="mobile">Mobile</option>
//             <option value="laptop">Laptop</option>
//             <option value="headphones">Headphones</option>
//             <option value="tablet">Tablet</option>
//             <option value="television">Television</option>
//             <option value="camera">Camera</option>
//             <option value="smartwatch">Smartwatch</option>
//             <option value="accessories">Accessories</option>
//             <option value="home-appliances">Home Appliances</option>
//           </select>

//           <select
//             value={supplier}
//             onChange={(e) => setSupplier(e.target.value)}
//             className="border p-2 w-full rounded"
//             required
//           >
//             <option value="">Select supplier</option>
//             {suppliers.map((s) => (
//               <option key={s._id} value={s._id}>
//                 {s.name} ({s.supplierGroup})
//               </option>
//             ))}
//           </select>

//           <input
//             type="number"
//             placeholder="Price"
//             value={price}
//             onChange={(e) =>
//               setPrice(e.target.value === "" ? "" : Number(e.target.value))
//             }
//             className="border p-2 w-full rounded"
//             required
//           />

//           <input
//             type="number"
//             placeholder="Stock"
//             value={stock}
//             onChange={(e) =>
//               setStock(e.target.value === "" ? "" : Number(e.target.value))
//             }
//             className="border p-2 w-full rounded"
//             required
//           />

//           <div className="flex justify-end gap-2 pt-3">
//             <button
//               type="button"
//               onClick={() => router.push("/products")}
//               className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600"
//             >
//               Cancel
//             </button>
//             <button className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-700">
//               Add Product
//             </button>
//           </div>
//         </form>
//       </div>
//     </ProtectedRoute>
//   );
// }
