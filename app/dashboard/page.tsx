"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../components/protectedroutes";
import {
  FaBox,
  FaWarehouse,
  FaShoppingCart,
  FaFileInvoice,
  FaUser,
  FaUsers,
  FaTruck,
} from "react-icons/fa";
import api from "../utils/api";
import axios from "axios";

interface Stats {
  totalProducts: number;
  totalStock: number;
  totalSales: number;
  totalInvoices: number;
  totalCustomers: number;
  totalSuppliers: number;
  totalUsers: number;
}

interface User {
  name: string;
  role: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalStock: 0,
    totalSales: 0,
    totalInvoices: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
    totalUsers: 0,
  });

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setErrorMsg(null);

      if (!user) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
      }

      const statsRes = await api.get("/dashboard");
      const currentStats = statsRes.data;
      const salesRes = await api.get("/invoice/total/sales");
      const totalSales = salesRes.data.totalSales;

      setStats({ ...currentStats, totalSales });
    } catch (err: unknown) {
      let message = "Something went wrong!";
      if (axios.isAxiosError(err)) {
        message =
          err.response?.data?.message || err.response?.data || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="p-6">
        <h1 className="text-center text-3xl font-bold mb-2">Dashboard</h1>

        {user && (
          <p className="text-center text-gray-500 mb-6">
            Role: <span className="font-semibold">{user.role}</span>
          </p>
        )}

        {errorMsg && (
          <p className="text-center text-red-500 mb-4">{errorMsg}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Total Products",
              value: stats.totalProducts,
              icon: <FaBox className="text-3xl text-blue-600" />,
              bg: "bg-blue-100",
              hover: "group-hover:bg-blue-200",
            },
            {
              title: "Total Stock",
              value: stats.totalStock,
              icon: <FaWarehouse className="text-3xl text-green-600" />,
              bg: "bg-green-100",
              hover: "group-hover:bg-green-200",
            },
            {
              title: "Total Sales",
              value: `Rs. ${stats.totalSales.toLocaleString()}`,
              icon: <FaShoppingCart className="text-3xl text-purple-600" />,
              bg: "bg-purple-100",
              hover: "group-hover:bg-purple-200",
            },
            {
              title: "Invoices",
              value: stats.totalInvoices,
              icon: <FaFileInvoice className="text-3xl text-red-600" />,
              bg: "bg-red-100",
              hover: "group-hover:bg-red-200",
            },
            {
              title: "Customers",
              value: stats.totalCustomers,
              icon: <FaUser className="text-3xl text-yellow-600" />,
              bg: "bg-yellow-100",
              hover: "group-hover:bg-yellow-200",
            },
            {
              title: "Suppliers",
              value: stats.totalSuppliers,
              icon: <FaTruck className="text-3xl text-indigo-600" />,
              bg: "bg-indigo-100",
              hover: "group-hover:bg-indigo-200",
            },
            {
              title: "Users",
              value: stats.totalUsers,
              icon: <FaUsers className="text-3xl text-pink-600" />,
              bg: "bg-pink-100",
              hover: "group-hover:bg-pink-200",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-gray-100
                         flex items-center justify-between group
                         transform transition-all duration-500 ease-in-out
                         hover:-translate-y-2 hover:scale-105
                         hover:shadow-2xl hover:shadow-blue-200/30"
            >
              <div>
                <h2 className="text-gray-500 text-base font-medium">
                  {item.title}
                </h2>
                <p className="text-3xl font-bold mt-2 sm:mt-3 text-gray-800">
                  {item.value}
                </p>
              </div>

              <div
                className={`p-5 rounded-full ${item.bg} ${item.hover}
                            flex items-center justify-center
                            transition-transform duration-500
                            group-hover:rotate-12 group-hover:scale-110`}
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
