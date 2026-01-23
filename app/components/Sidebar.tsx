"use client";
import Link from "next/link";

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;
  const pageAccess: Record<string, string[]> = {
    products: ["admin"],
    inventory: ["admin", "manager"],
    sales: ["admin", "manager", "saler"],
    invoice: ["admin", "manager"],
  };

  const links = [
    { name: "Products", href: "/products" },
    { name: "Inventory", href: "/inventory" },
    { name: "Sales", href: "/sales" },
    { name: "Invoice", href: "/invoice" },
  ];

  return (
    <aside className="w-64 h-screen bg-white text-gray-800 flex flex-col p-6 border-r border-gray-200">
      <h2 className="text-2xl font-bold mb-8">Menu</h2>
      <ul className="flex flex-col gap-4">
        {links.map((item) =>
          pageAccess[item.name.toLowerCase()]?.includes(role) ? (
            <li key={item.name}>
              <Link
                href={item.href}
                className="block py-2 px-3 rounded hover:bg-blue-100 hover:text-blue-700 transition"
              >
                {item.name}
              </Link>
            </li>
          ) : null,
        )}
      </ul>
    </aside>
  );
}
