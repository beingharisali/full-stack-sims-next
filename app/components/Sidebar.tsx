"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaBox, FaWarehouse, FaShoppingCart, FaFileInvoice, FaUser, FaUsers, FaTruck } from "react-icons/fa";

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
    products: ["admin", "manager"],
    inventory: ["admin", "manager"],
    sales: ["admin", "manager", "saler"],
    invoices: ["admin", "manager", "saler"],
    customers: ["admin", "manager", "saler"],
    suppliers: ["admin"],
    users: ["admin"],
  };

  const items = [
    { name: "Products", href: "/products", icon: <FaBox /> },
    { name: "Inventory", href: "/inventory", icon: <FaWarehouse /> },
    { name: "Sales", href: "/sales", icon: <FaShoppingCart /> },
    { name: "Invoices", href: "/invoice", icon: <FaFileInvoice /> },
    { name: "Customers", href: "/customers", icon: <FaUser /> },
    { name: "Suppliers", href: "/suppliers", icon: <FaTruck /> },
    { name: "Users", href: "/users", icon: <FaUsers /> },
  ];

  return (
    <aside className="w-64 h-screen bg-white text-gray-800 flex flex-col border-r border-gray-200 shrink-0">
      <div className="h-16 border-b border-gray-200 flex items-center px-6 bg-gray-50">
        <span className="font-bold text-gray-500 uppercase tracking-widest text-sm">Main Menu</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <ul className="flex flex-col gap-2">
          {items.map(
            (item) =>
              role &&
              pageAccess[item.name.toLowerCase()]?.includes(role) && (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 py-3 px-4 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium transition-colors"
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ),
          )}
        </ul>
      </div>
    </aside>
  );
}