"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRedirectIfAuth } from "@/hooks/useRedirectIfAuth";

export default function LoginPage() {
	useRedirectIfAuth();
	const router = useRouter();
	const { login } = useAuth();
	const [form, setForm] = useState({
		email: "",
		password: "",
		role: "",
	});
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!form.email || !form.password || !form.role) {
			setError("Please fill all fields");
			return;
		}

		setIsLoading(true);
		try {
			await login(form.email, form.password);
			router.push("/dashboard");
		} catch (error: any) {
			setError(
				error?.response?.data?.message || "Login failed. Please try again.",
			);
			console.error("Error occurred in login user", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-white">
			<div className="w-96 p-6 rounded-2xl bg-white border border-gray-300 shadow-lg">
				<h2 className="text-2xl font-bold mb-5 text-gray-800">Login Here</h2>
				{error && (
					<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
						{error}
					</div>
				)}
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label className="block mb-1 font-semibold text-black">Email</label>
						<input
							name="email"
							type="email"
							value={form.email}
							placeholder="abc@gmail.com"
							className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
							onChange={handleChange}
						/>
					</div>

					<div className="mb-3">
						<label className="block mb-1 font-semibold text-black">
							Password
						</label>
						<input
							name="password"
							type="password"
							value={form.password}
							placeholder="*********"
							className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
							onChange={handleChange}
						/>
					</div>

					<div className="mb-5">
						<label className="block mb-1 font-semibold text-black">Role</label>
						<select
							name="role"
							value={form.role}
							onChange={handleChange}
							className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500">
							<option value="">Select Role</option>
							<option value="manager">Manager</option>
							<option value="admin">Admin</option>
							<option value="sales">Saler</option>
						</select>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400 text-white font-semibold p-3 rounded transition duration-200">
						{isLoading ? "Logging in..." : "Login"}
					</button>
				</form>

				<p className="text-center mt-3 text-gray-600 text-sm">
					Don't have an account?{" "}
					<Link
						href="./signup"
						className="text-sky-500 hover:underline font-semibold">
						Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
}
