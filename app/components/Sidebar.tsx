// Components/Sidebar.tsx
"use client";
import Link from "next/link";
import React from "react";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white text-gray-800 flex flex-col p-6 border-r border-gray-200">
      <h2 className="text-2xl font-bold mb-8">Menu</h2>
      <ul className="flex flex-col gap-4">
        {[
          { name: "Products", href: "/products" },
          { name: "Inventory", href: "/inventory" },
          { name: "Sales", href: "/sales" },
          { name: "Invoice", href: "/invoice" },
        ].map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className="block py-2 px-3 rounded hover:bg-blue-100 hover:text-blue-700 transition"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
