"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "../utils/protectedroutes";
import {
  FaBox,
  FaWarehouse,
  FaShoppingCart,
  FaFileInvoice,
  FaUserTie,
  FaUserTag,
} from "react-icons/fa";
import api from "../utils/api";
import axios from "axios";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  supplier: string;
  category: string;
  description?: string;
};

type InventoryItem = {
  _id: string;
  productName: string;
  quantity: number;
  description?: string;
  category?: string;
  price?: number;
  supplier?: string;
};

type Invoice = {
  _id: string;
  invoice_number?: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  createdAt: string;
};

type Manager = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

type Saler = {
  _id: string;
  name: string;
  contactNumber: string;
  category: string;
  status: string;
  orderitems: number;
};

interface Stats {
  totalProducts: number;
  totalStock: number;
  totalInvoices: number;
  totalManagers: number;
  totalSalers: number;
  totalSuppliers?: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalStock: 0,
    totalInvoices: 0,
    totalManagers: 0,
    totalSalers: 0,
    totalSuppliers: 0,
  });
  const [totalSales, setTotalSales] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [salers, setSalers] = useState<Saler[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setError(null);
        const [dashboardRes, salesRes, productsRes, inventoryRes, invoicesRes, usersRes, salersRes] =
          await Promise.all([
            api.get("/dashboard"),
            api.get("/invoice/total/sales").catch(() => ({ data: { totalSales: 0 } })),
            api.get("/products/get").catch(() => ({ data: { data: [] } })),
            api.get("/inventory/get").catch(() => ({ data: { data: [] } })),
            api.get("/invoice").catch(() => ({ data: { data: [] } })),
            api.get("/dashboard/users?role=manager").catch(() => ({ data: { data: [] } })),
            api.get("/saler").catch(() => ({ data: { data: [] } })),
          ]);

        const d = dashboardRes.data;
        setStats({
          totalProducts: d.totalProducts ?? 0,
          totalStock: d.totalStock ?? 0,
          totalInvoices: d.totalInvoices ?? 0,
          totalManagers: d.totalManagers ?? 0,
          totalSalers: d.totalSalers ?? 0,
        });
        setTotalSales(salesRes.data?.totalSales ?? 0);
        setProducts(productsRes.data?.data ?? []);
        setInventory(inventoryRes.data?.data ?? []);
        setInvoices(invoicesRes.data?.data ?? []);
        setManagers(usersRes.data?.data ?? []);
        setSalers(salersRes.data?.data ?? []);
      } catch (err: unknown) {
        const msg =
          axios.isAxiosError(err)
            ? err.response?.data?.message || err.message
            : err instanceof Error
              ? err.message
              : "Something went wrong";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="p-6">
          <p className="text-center text-gray-500">Loading admin panel...</p>
        </div>
      </ProtectedRoute>
    );
  }

  const statCards = [
    {
      title: "Products",
      value: stats.totalProducts,
      icon: <FaBox className="text-3xl text-blue-600" />,
      bg: "bg-blue-100",
      hover: "group-hover:bg-blue-200",
    },
    {
      title: "Inventory (Stock)",
      value: stats.totalStock,
      icon: <FaWarehouse className="text-3xl text-green-600" />,
      bg: "bg-green-100",
      hover: "group-hover:bg-green-200",
    },
    {
      title: "Invoices",
      value: stats.totalInvoices,
      icon: <FaFileInvoice className="text-3xl text-red-600" />,
      bg: "bg-red-100",
      hover: "group-hover:bg-red-200",
    },
    {
      title: "Total Sales",
      value: `Rs. ${Number(totalSales).toLocaleString()}`,
      icon: <FaShoppingCart className="text-3xl text-purple-600" />,
      bg: "bg-purple-100",
      hover: "group-hover:bg-purple-200",
    },
    {
      title: "Managers",
      value: stats.totalManagers,
      icon: <FaUserTie className="text-3xl text-amber-600" />,
      bg: "bg-amber-100",
      hover: "group-hover:bg-amber-200",
    },
    {
      title: "Salers",
      value: stats.totalSalers,
      icon: <FaUserTag className="text-3xl text-teal-600" />,
      bg: "bg-teal-100",
      hover: "group-hover:bg-teal-200",
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-center text-3xl font-bold p-4 m-3">Admin Dashboard</h1>
        {error && (
          <p className="text-center text-red-500 mb-4">{error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {statCards.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex items-center justify-between group"
            >
              <div>
                <h2 className="text-gray-500 text-base font-medium">{item.title}</h2>
                <p className="text-2xl font-bold mt-2 text-gray-800">{item.value}</p>
              </div>
              <div className={`p-4 rounded-full ${item.bg} ${item.hover} transition`}>
                {item.icon}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-10">
          {/* Products */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-800">Products</h2>
              <Link
                href="/products"
                className="text-teal-600 hover:underline text-sm font-medium"
              >
                View all →
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow border overflow-hidden">
              <div className="overflow-x-auto max-h-64">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Name</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Price</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Stock</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 10).map((p) => (
                      <tr key={p._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">{p.name}</td>
                        <td className="px-4 py-2">Rs. {p.price}</td>
                        <td className="px-4 py-2">{p.stock}</td>
                        <td className="px-4 py-2">{p.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {products.length === 0 && (
                <p className="p-4 text-center text-gray-500">No products</p>
              )}
            </div>
          </section>

          {/* Inventory */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-800">Inventory</h2>
              <Link
                href="/inventory"
                className="text-teal-600 hover:underline text-sm font-medium"
              >
                View all →
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow border overflow-hidden">
              <div className="overflow-x-auto max-h-64">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Product</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Quantity</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.slice(0, 10).map((i) => (
                      <tr key={i._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">{i.productName}</td>
                        <td className="px-4 py-2">{i.quantity}</td>
                        <td className="px-4 py-2">{i.category ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {inventory.length === 0 && (
                <p className="p-4 text-center text-gray-500">No inventory records</p>
              )}
            </div>
          </section>

          {/* Invoices */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-800">Invoices</h2>
              <Link
                href="/invoice"
                className="text-teal-600 hover:underline text-sm font-medium"
              >
                View all →
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow border overflow-hidden">
              <div className="overflow-x-auto max-h-64">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Customer</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Email</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Total</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.slice(0, 10).map((inv) => (
                      <tr key={inv._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">{inv.customer_name}</td>
                        <td className="px-4 py-2">{inv.customer_email}</td>
                        <td className="px-4 py-2">Rs. {inv.total_amount}</td>
                        <td className="px-4 py-2">{inv.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {invoices.length === 0 && (
                <p className="p-4 text-center text-gray-500">No invoices</p>
              )}
            </div>
          </section>

          {/* Managers */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Managers</h2>
            <div className="bg-white rounded-xl shadow border overflow-hidden">
              <div className="overflow-x-auto max-h-64">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Name</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Email</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {managers.map((m) => (
                      <tr key={m._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">{m.firstName} {m.lastName}</td>
                        <td className="px-4 py-2">{m.email}</td>
                        <td className="px-4 py-2">{m.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {managers.length === 0 && (
                <p className="p-4 text-center text-gray-500">No managers</p>
              )}
            </div>
          </section>

          {/* Salers */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-800">Salers</h2>
              <Link
                href="/saler"
                className="text-teal-600 hover:underline text-sm font-medium"
              >
                View all →
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow border overflow-hidden">
              <div className="overflow-x-auto max-h-64">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Name</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Contact</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Category</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Order Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salers.slice(0, 10).map((s) => (
                      <tr key={s._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">{s.name}</td>
                        <td className="px-4 py-2">{s.contactNumber}</td>
                        <td className="px-4 py-2">{s.category}</td>
                        <td className="px-4 py-2">{s.status}</td>
                        <td className="px-4 py-2">{s.orderitems}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {salers.length === 0 && (
                <p className="p-4 text-center text-gray-500">No salers</p>
              )}
            </div>
          </section>

          {/* Suppliers */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-800">Suppliers</h2>
              <Link
                href="/admin/suppliers"
                className="text-teal-600 hover:underline text-sm font-medium"
              >
                Manage suppliers →
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow border p-6">
              <p className="text-gray-600">
                Total suppliers: <strong className="text-gray-900">{stats.totalSuppliers ?? 0}</strong>
              </p>
            </div>
          </section>

          {/* Sales summary */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Sales</h2>
            <div className="bg-white rounded-xl shadow border p-6">
              <p className="text-gray-600">
                Total revenue from invoices: <strong className="text-gray-900">Rs. {Number(totalSales).toLocaleString()}</strong>
              </p>
              <Link
                href="/invoice"
                className="inline-block mt-3 text-teal-600 hover:underline text-sm font-medium"
              >
                View all invoices →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
