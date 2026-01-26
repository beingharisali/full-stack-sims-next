"use client";

import ProtectedRoute from "../utils/protectedroutes";
import {
  FaBox,
  FaWarehouse,
  FaShoppingCart,
  FaFileInvoice,
} from "react-icons/fa";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Products",
      value: 24,
      icon: <FaBox className="text-3xl text-blue-600" />,
      bg: "bg-blue-100",
      hover: "group-hover:bg-blue-200",
    },
    {
      title: "Total Stock",
      value: 320,
      icon: <FaWarehouse className="text-3xl text-green-600" />,
      bg: "bg-green-100",
      hover: "group-hover:bg-green-200",
    },
    {
      title: "Total Sales",
      value: "Rs. 85,000",
      icon: <FaShoppingCart className="text-3xl text-purple-600" />,
      bg: "bg-purple-100",
      hover: "group-hover:bg-purple-200",
    },
    {
      title: "Invoices",
      value: 12,
      icon: <FaFileInvoice className="text-3xl text-red-600" />,
      bg: "bg-red-100",
      hover: "group-hover:bg-red-200",
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div>
        <h1 className="text-center text-3xl font-bold p-4 m-3">Dashborad</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex items-center justify-between group"
            >
              <div>
                <h2 className="text-gray-500 text-base font-medium">
                  {item.title}
                </h2>
                <p className="text-3xl font-bold mt-3 text-gray-800">
                  {item.value}
                </p>
              </div>

              <div
                className={`p-5 rounded-full ${item.bg} ${item.hover} transition`}
              >
                {item.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
