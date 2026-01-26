"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoutes";

export default function AddInvoicePage() {
	const router = useRouter();

	const [customer, setCustomer] = useState("");
	const [amount, setAmount] = useState<number | "">("");
	const [status, setStatus] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const stored = localStorage.getItem("invoices");
		const invoices = stored ? JSON.parse(stored) : [];

		const nextId =
			invoices.length > 0 ? invoices[invoices.length - 1].id + 1 : 1;

		invoices.push({
			id: nextId,
			customer,
			amount: Number(amount),
			status,
		});

		localStorage.setItem("invoices", JSON.stringify(invoices));

		router.push("/invoice");
	};

	return (
		<ProtectedRoute allowedRoles={["admin", "sales"]}>
			<div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
				<h2 className="text-2xl font-bold mb-4">Add Invoice</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						placeholder="Customer Name"
						value={customer}
						onChange={(e) => setCustomer(e.target.value)}
						className="border p-2 w-full rounded"
						required
					/>

					<input
						type="number"
						placeholder="Amount"
						value={amount}
						onChange={(e) =>
							setAmount(e.target.value === "" ? "" : Number(e.target.value))
						}
						className="border p-2 w-full rounded"
						required
					/>

					<select
						value={status}
						onChange={(e) => setStatus(e.target.value)}
						className="border p-2 w-full rounded"
						required>
						<option value="" disabled>
							Select Status
						</option>
						<option value="Paid">Paid</option>
						<option value="Pending">Pending</option>
					</select>

					<div className="flex gap-2">
						<button className="bg-green-600 text-white px-4 py-2 rounded">
							Save
						</button>
						<button
							type="button"
							onClick={() => router.push("/invoice")}
							className="bg-gray-500 text-white px-4 py-2 rounded">
							Cancel
						</button>
					</div>
				</form>
			</div>
		</ProtectedRoute>
	);
}
