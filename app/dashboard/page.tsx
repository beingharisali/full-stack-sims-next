"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/protectedroutes";
import {
  FaBox, FaWarehouse, FaShoppingCart, FaFileInvoice,
  FaUser, FaUsers, FaTruck, FaPlus, FaArrowUp, FaChartLine
} from "react-icons/fa";
import api from "../utils/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, AreaChart, Area
} from "recharts";

const CHART_COLORS = ["#10b981", "#3b82f6", "#6366f1", "#f59e0b", "#ec4899", "#14b8a6", "#f43f5e"];

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>({
    totalProducts: 0, totalStock: 0, totalSales: 0,
    totalInvoices: 0, totalCustomers: 0, totalSuppliers: 0, totalUsers: 0,
  });
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Monthly"); // Filter State

  const fetchData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));

      const [statsRes, salesRes, monthlyRes] = await Promise.all([
        api.get("/dashboard"),
        api.get("/invoice/total/sales").catch(() => ({ data: { totalSales: 0 } })),
        api.get("/invoice/monthly/sales").catch(() => ({ data: { data: [] } })),
      ]);

      setStats({ ...statsRes.data, totalSales: salesRes.data?.totalSales ?? 0 });
      setMonthlyRevenue(monthlyRes.data?.data ?? []);
    } catch (err: any) {
      console.error("Dashboard Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">Syncing Business Data</p>
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="p-6 lg:p-12 bg-[#fcfcfd] min-h-screen font-sans">
        <div className="max-w-7xl mx-auto">
          
          {/* ================= HEADER SECTION ================= */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div className="border-l-4 border-teal-500 pl-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2 block">Paragon Enterprise</span>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                Hello, {user?.name?.split(' ')[0] || "Admin"}<span className="text-teal-600">.</span>
              </h1>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <button 
                onClick={() => router.push("/invoice/add")}
                className="flex-1 md:flex-none bg-white border-2 border-slate-100 text-slate-900 px-7 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-teal-500 transition-all shadow-sm"
              >
                New Invoice
              </button>
              <button 
                onClick={() => router.push("/products/add")}
                className="flex-1 md:flex-none bg-teal-600 text-white px-7 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-2xl shadow-teal-100 flex items-center justify-center gap-2"
              >
                <FaPlus size={10} /> Add Product
              </button>
            </div>
          </div>

          {/* ================= 8 STATS GRID ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Gross Revenue", value: `Rs. ${stats.totalSales.toLocaleString()}`, icon: <FaShoppingCart />, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Inventory Lines", value: stats.totalProducts, icon: <FaBox />, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Stock Units", value: stats.totalStock, icon: <FaWarehouse />, color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "Total Invoices", value: stats.totalInvoices, icon: <FaFileInvoice />, color: "text-rose-600", bg: "bg-rose-50" },
              { label: "Client Base", value: stats.totalCustomers, icon: <FaUsers />, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Active Suppliers", value: stats.totalSuppliers, icon: <FaTruck />, color: "text-cyan-600", bg: "bg-cyan-50" },
              { label: "System Users", value: stats.totalUsers, icon: <FaUser />, color: "text-slate-600", bg: "bg-slate-100" },
              { label: "Growth Index", value: "+14.2%", icon: <FaArrowUp />, color: "text-emerald-500", bg: "bg-emerald-50" },
            ].map((m, i) => (
              <div key={i} className="bg-white p-7 rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${m.bg} ${m.color} text-xl group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                    {m.icon}
                  </div>
                  <span className="text-[9px] font-black text-slate-200 uppercase tracking-widest">Live</span>
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{m.label}</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{m.value}</h3>
              </div>
            ))}
          </div>

          {/* ================= CHARTS SECTION ================= */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* UPGRADED FINANCIAL ANALYTICS WITH FILTERS */}
            <div className="xl:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-60"></div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 relative z-10 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                    <h3 className="text-[10px] font-black text-teal-600 uppercase tracking-[0.3em]">Revenue Analytics</h3>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Financial Performance</h2>
                </div>

                {/* Filter Toggles */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 shadow-inner">
                  {["Daily", "Weekly", "Monthly"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                        activeTab === tab 
                        ? "bg-white text-slate-900 shadow-md scale-105" 
                        : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[340px] w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyRevenue.length > 0 ? monthlyRevenue : [{month: 'Jan', totalSales: 0}, {month: 'Current', totalSales: stats.totalSales}]}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f8fafc" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '800'}} dy={15} />
                    <YAxis hide={true} />
                    <Tooltip 
                      cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-800">
                              <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-1">{payload[0].payload.month}</p>
                              <p className="text-xl font-black text-white tracking-tighter">Rs. {payload[0].value?.toLocaleString()}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area type="monotone" dataKey="totalSales" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#revenueGradient)" animationDuration={2000} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Bottom Metrics Breakdown */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-50 relative z-10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Efficiency Rate</span>
                  <span className="text-sm font-black text-slate-800 mt-1">94.2%</span>
                </div>
                <div className="flex flex-col border-l border-slate-100 pl-4">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Forecast</span>
                  <span className="text-sm font-black text-teal-600 mt-1">Positive</span>
                </div>
                <div className="flex flex-col border-l border-slate-100 pl-4">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Avg Ticket</span>
                  <span className="text-sm font-black text-slate-800 mt-1">Rs. {(stats.totalSales / (stats.totalInvoices || 1)).toFixed(0)}</span>
                </div>
              </div>
            </div>

            {/* RESOURCE SPLIT BOX (Dark Mode) */}
            <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl"></div>
              <div>
                <h3 className="text-[10px] font-black text-teal-400 uppercase tracking-[0.4em] mb-10">Inventory Resources</h3>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'INV', val: stats.totalInvoices },
                      { name: 'PRD', val: stats.totalProducts },
                      { name: 'SUP', val: stats.totalSuppliers },
                      { name: 'USR', val: stats.totalUsers },
                    ]}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 'bold'}} />
                      <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '15px'}} />
                      <Bar dataKey="val" radius={[10, 10, 10, 10]} barSize={30}>
                        { [0,1,2,3].map((_, i) => <Cell key={i} fill={i === 1 ? '#10b981' : '#334155'} /> ) }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-slate-800/50 p-5 rounded-3xl flex items-center gap-5 mt-6 border border-slate-700/50">
                <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center text-teal-400 text-xl shadow-inner">
                  <FaChartLine />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Integrity Score</p>
                  <p className="text-base font-bold text-white tracking-tight">Optimal Health</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}