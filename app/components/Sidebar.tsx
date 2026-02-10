// Components/Sidebar.tsx
"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Sidebar() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setRole(user.role);
    }
  }, []);

  const pageAccess: Record<string, string[]> = {
    // products: ["admin", "manager"],
    inventory: ["admin", "manager"],
    sales: ["admin", "manager", "saler"],
    invoice: ["admin", "manager", "saler"],
  };

  const items = [
    // { name: "Products", href: "/products" },
    { name: "Inventory", href: "/inventory" },
    { name: "Sales", href: "/sales" },
    { name: "Invoice", href: "/invoice" },
  ];

  return (
    <aside className="w-64 h-screen bg-white text-gray-800 flex flex-col p-6 border-r border-gray-200">
      <h2 className="text-2xl font-bold mb-8">Menu</h2>
      <ul className="flex flex-col gap-4">
        {items.map(
          (item) =>
            role &&
            pageAccess[item.name.toLowerCase()]?.includes(role) && (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="block py-2 px-3 rounded hover:bg-blue-100 hover:text-blue-700 transition"
                >
                  {item.name}
                </Link>
              </li>
            ),
        )}
      </ul>
    </aside>
  );
}
