"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoutes";

export default function AddInventoryPage() {
	const router = useRouter();
	const [product, setProduct] = useState("");
	const [quantity, setQuantity] = useState<number | "">(""); // empty string
	const [location, setLocation] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const existing = JSON.parse(localStorage.getItem("inventory") || "[]");

		const newItem = {
			id: existing.length ? existing[existing.length - 1].id + 1 : 1,
			product,
			quantity: Number(quantity),
			location,
		};

		localStorage.setItem("inventory", JSON.stringify([...existing, newItem]));

		router.push("/inventory");
	};

	return (
		<ProtectedRoute allowedRoles={["admin", "manager"]}>
			<div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
				<h2 className="text-xl font-bold mb-4">Add Inventory</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						className="border p-2 w-full rounded"
						placeholder="Product"
						value={product}
						onChange={(e) => setProduct(e.target.value)}
						required
					/>

					<input
						type="number"
						className="border p-2 w-full rounded"
						placeholder="Quantity"
						value={quantity}
						onChange={(e) =>
							setQuantity(e.target.value === "" ? "" : Number(e.target.value))
						}
						required
					/>

					<input
						className="border p-2 w-full rounded"
						placeholder="Location"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						required
					/>

					<div className="flex gap-2">
						<button className="bg-green-600 text-white px-4 py-2 rounded">
							Add
						</button>
						<button
							type="button"
							onClick={() => router.push("/inventory")}
							className="bg-gray-500 text-white px-4 py-2 rounded">
							Cancel
						</button>
					</div>
				</form>
			</div>
		</ProtectedRoute>
	);
}
