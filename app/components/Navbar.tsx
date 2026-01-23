"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
	const router = useRouter();
	const { logout, user } = useAuth();

	const handleLogout = () => {
		logout();
		router.push("/");
	};

	return (
		<nav className="bg-gray-800 text-white px-6 py-4 flex items-center">
			<div className="font-bold text-xl w-1/4">
				<Link href="/dashboard">My Dashboard</Link>
			</div>

			<div className="flex justify-center gap-8 w-2/4">
				{[
					{ name: "Products", href: "/products" },
					{ name: "Inventory", href: "/inventory" },
					{ name: "Sales", href: "/sales" },
					{ name: "Invoice", href: "/invoice" },
				].map((link) => (
					<Link
						key={link.name}
						href={link.href}
						className="relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full">
						{link.name}
					</Link>
				))}
			</div>

			<div className="flex justify-end gap-4 w-1/4 items-center">
				{user && (
					<div className="text-sm">
						<p className="text-gray-300">
							{user.firstName} {user.lastName}
						</p>
						<p className="text-yellow-400 text-xs">{user.role}</p>
					</div>
				)}
				<button
					onClick={handleLogout}
					className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium">
					Logout
				</button>
			</div>
		</nav>
	);
}
