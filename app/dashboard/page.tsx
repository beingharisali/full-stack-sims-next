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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

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

interface MonthlySale {
  month: string;
  totalSales: number;
}

const CHART_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#ef4444", // red
];

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

  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlySale[]>([]);
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

      const [statsRes, salesRes, monthlyRes] = await Promise.all([
        api.get("/dashboard"),
        api
          .get("/invoice/total/sales")
          .catch(() => ({ data: { totalSales: 0 } })),
        api.get("/invoice/monthly/sales").catch(() => ({ data: { data: [] } })),
      ]);

      const currentStats = statsRes.data;
      const totalSales = salesRes.data?.totalSales ?? 0;
      setStats({ ...currentStats, totalSales });

      const monthly = monthlyRes.data?.data ?? [];
      setMonthlyRevenue(Array.isArray(monthly) ? monthly : []);
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

  // Bar chart: Suppliers, Products, Invoices, Customers
  const overviewChartData = [
    { name: "Suppliers", value: stats.totalSuppliers, fill: CHART_COLORS[0] },
    { name: "Products", value: stats.totalProducts, fill: CHART_COLORS[1] },
    { name: "Invoices", value: stats.totalInvoices, fill: CHART_COLORS[2] },
    { name: "Customers", value: stats.totalCustomers, fill: CHART_COLORS[3] },
    { name: "Users", value: stats.totalUsers, fill: CHART_COLORS[4] },
  ];

  // Revenue chart: monthly or single total
  const revenueChartData =
    monthlyRevenue.length > 0
      ? monthlyRevenue.map((m) => ({
          name: m.month,
          revenue: m.totalSales,
          fill: CHART_COLORS[5],
        }))
      : [
          {
            name: "Total Revenue",
            revenue: stats.totalSales,
            fill: CHART_COLORS[5],
          },
        ];

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["admin", "manager"]}>
        <p className="text-center mt-10 text-gray-500">Loading...</p>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-center text-3xl font-bold mb-2">Dashboard</h1>

        {user && (
          <p className="text-center text-gray-500 mb-6">
            Role: <span className="font-semibold">{user.role}</span>
          </p>
        )}

        {errorMsg && (
          <p className="text-center text-red-500 mb-4">{errorMsg}</p>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
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
              value: `Rs. ${Number(stats.totalSales).toLocaleString()}`,
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

        {/* Bar charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Overview: Suppliers, Products, Invoices, Customers */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Overview — Suppliers, Products, Invoices &amp; Customers
            </h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={overviewChartData}
                margin={{ top: 12, right: 12, left: 12, bottom: 12 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#d1d5db" }}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#d1d5db" }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value?: number) => `${value ?? 0} Count`}
                  labelStyle={{ color: "#374151" }}
                />
                <Legend />
                <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]}>
                  {overviewChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Revenue {monthlyRevenue.length > 0 ? "(by month)" : "(total)"}
            </h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={revenueChartData}
                margin={{ top: 12, right: 12, left: 12, bottom: 12 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#d1d5db" }}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickFormatter={(v) => `Rs. ${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value?: number) =>
                    `Rs. ${value?.toLocaleString() ?? 0} Revenue`
                  }
                  labelStyle={{ color: "#374151" }}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill={CHART_COLORS[5]}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
