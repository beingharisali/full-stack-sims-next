"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/app/components/protectedroutes";
import { FaBox, FaWarehouse, FaShoppingCart, FaFileInvoice } from "react-icons/fa";
import api from "@/app/utils/api";
import axios from "axios";

interface Stats {
  totalProducts: number;
  totalStock: number;
  totalSales: number;
  invoices: number;
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
    invoices: 0,
  });

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [ageSeconds, setAgeSeconds] = useState<number>(0);

  // Fetch user and stats
  const fetchData = async () => {
    try {
      setErrorMsg(null);

      if (!user) {
        const userRes = await api.get("/user");
        setUser(userRes.data);
        localStorage.setItem("user", JSON.stringify(userRes.data));
      }

      const statsRes = await api.get("/stats");
      const newStats = statsRes.data;

      // Update only if stats changed
      if (
        newStats.totalProducts !== stats.totalProducts ||
        newStats.totalStock !== stats.totalStock ||
        newStats.totalSales !== stats.totalSales ||
        newStats.invoices !== stats.invoices
      ) {
        setStats(newStats);
      }

      // Update last updated timestamp
      setLastUpdated(new Date());
      setAgeSeconds(0); // reset age counter
    } catch (err: unknown) {
      let message = "Something went wrong!";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.response?.data || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      console.error("Fetch error:", message);
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const fetchInterval = setInterval(fetchData, 3000); // metrics polling
    const ageInterval = setInterval(() => setAgeSeconds((prev) => prev + 1), 1000); // age timer

    return () => {
      clearInterval(fetchInterval);
      clearInterval(ageInterval);
    };
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="p-6">
        <h1 className="text-center text-3xl font-bold mb-2">Dashboard</h1>

        {errorMsg && (
          <p className="text-center text-red-500 mb-4">
            Error fetching data: {errorMsg}
          </p>
        )}

        {user && (
          <p className="text-center text-gray-500 mb-2">
            Role: <span className="font-semibold">{user.role}</span>
          </p>
        )}

        {lastUpdated && (
          <p className="text-center text-gray-400 mb-6 text-sm">
            Last updated: {lastUpdated.toLocaleTimeString()} ({ageSeconds} seconds ago)
          </p>
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
              value: stats.invoices,
              icon: <FaFileInvoice className="text-3xl text-red-600" />,
              bg: "bg-red-100",
              hover: "group-hover:bg-red-200",
            },
          ].map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-gray-100 flex items-center justify-between group
                         transform transition-all duration-500 ease-in-out hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-blue-200/30`}
            >
              <div>
                <h2 className="text-gray-500 text-base font-medium">{item.title}</h2>
                <p className="text-3xl font-bold mt-2 sm:mt-3 text-gray-800">{item.value}</p>
              </div>

              <div
                className={`p-5 rounded-full ${item.bg} ${item.hover} flex items-center justify-center transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110`}
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
