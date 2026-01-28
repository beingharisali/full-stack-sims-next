"use client";

import ProtectedRoute from "../../app/components/protectedroutes";
import {
  FaBox,
  FaWarehouse,
  FaShoppingCart,
  FaFileInvoice,
} from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalSales: 0,
    invoices: 0,
  });

  // const stats = [
  //   {
  //     title: "Total Products",
  //     value: 24,
  //     icon: <FaBox className="text-3xl text-blue-600" />,
  //     bg: "bg-blue-100",
  //     hover: "group-hover:bg-blue-200",
  //   },
  //   {
  //     title: "Total Stock",
  //     value: 320,
  //     icon: <FaWarehouse className="text-3xl text-green-600" />,
  //     bg: "bg-green-100",
  //     hover: "group-hover:bg-green-200",
  //   },
  //   {
  //     title: "Total Sales",
  //     value: "Rs. 85,000",
  //     icon: <FaShoppingCart className="text-3xl text-purple-600" />,
  //     bg: "bg-purple-100",
  //     hover: "group-hover:bg-purple-200",
  //   },
  //   {
  //     title: "Invoices",
  //     value: 12,
  //     icon: <FaFileInvoice className="text-3xl text-red-600" />,
  //     bg: "bg-red-100",
  //     hover: "group-hover:bg-red-200",
  //   },
  // ];

  const stats = [
    {
      title: "Total Products",
      value: dashboardData.totalProducts,
      icon: <FaBox className="text-3xl text-blue-600" />,
      bg: "bg-blue-100",
      hover: "group-hover:bg-blue-200",
    },
    {
      title: "Total Stock",
      value: dashboardData.totalStock,
      icon: <FaWarehouse className="text-3xl text-green-600" />,
      bg: "bg-green-100",
      hover: "group-hover:bg-green-200",
    },
    {
      title: "Total Sales",
      value: `Rs. ${dashboardData.totalSales}`,
      icon: <FaShoppingCart className="text-3xl text-purple-600" />,
      bg: "bg-purple-100",
      hover: "group-hover:bg-purple-200",
    },
    {
      title: "Invoices",
      value: dashboardData.invoices,
      icon: <FaFileInvoice className="text-3xl text-red-600" />,
      bg: "bg-red-100",
      hover: "group-hover:bg-red-200",
    },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      const res = await fetch("http://localhost:5000/api/v1/dashboard");
      const data = await res.json();
      setDashboardData(data);
    };

    fetchDashboardData();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-6">
        <h1 className="text-center text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className={`
                bg-white rounded-2xl p-6 sm:p-8 shadow-md 
                hover:shadow-2xl transform hover:-translate-y-2 
                transition-all duration-500 ease-in-out
                border border-gray-100 flex items-center justify-between group
              `}
            >
              <div>
                <h2 className="text-gray-500 text-base font-medium">{item.title}</h2>
                <p className="text-3xl font-bold mt-2 sm:mt-3 text-gray-800">{item.value}</p>
              </div>

              <div
                className={`p-5 rounded-full ${item.bg} ${item.hover} transition-colors duration-500 flex items-center justify-center`}
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
