"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/app/components/ProtectedRoutes";

export default function AddProductPage() {
	const router = useRouter();

	const [name, setName] = useState<string>("");
	const [price, setPrice] = useState<number | "">("");
	const [stock, setStock] = useState<number | "">("");

	const getNextId = (): number => {
		const defaultProducts = [
			{ id: 1, name: "Laptop" },
			{ id: 2, name: "Mouse" },
			{ id: 3, name: "Keyboard" },
		];

		const stored = localStorage.getItem("products");
		const userProducts = stored ? JSON.parse(stored) : [];

		const allProducts = [...defaultProducts, ...userProducts];
		return allProducts.length
			? Math.max(...allProducts.map((p: any) => p.id)) + 1
			: 1;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const stored = localStorage.getItem("products");
		const products = stored ? JSON.parse(stored) : [];

		const newProduct = {
			id: getNextId(),
			name,
			price: Number(price),
			stock: Number(stock),
		};

		products.push(newProduct);
		localStorage.setItem("products", JSON.stringify(products));

		router.push("/products");
	};

	return (
		<ProtectedRoute allowedRoles={["admin", "manager"]}>
			<div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
				<h2 className="text-2xl font-bold mb-4">Add Product</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						placeholder="Product Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="border p-2 rounded w-full"
						required
					/>
					<input
						type="number"
						placeholder="Price"
						value={price}
						onChange={(e) =>
							setPrice(e.target.value === "" ? "" : Number(e.target.value))
						}
						className="border p-2 rounded w-full"
						required
					/>
					<input
						type="number"
						placeholder="Stock"
						value={stock}
						onChange={(e) =>
							setStock(e.target.value === "" ? "" : Number(e.target.value))
						}
						className="border p-2 rounded w-full"
						required
					/>
					<div className="flex space-x-2">
						<button
							type="submit"
							className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
							Add Product
						</button>
						<button
							type="button"
							onClick={() => router.push("/products")}
							className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
							Cancel
						</button>
					</div>
				</form>
			</div>
		</ProtectedRoute>
	);
}
