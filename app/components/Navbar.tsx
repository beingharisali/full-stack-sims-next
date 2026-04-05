"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setRole(user.role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <nav className="bg-gray-50 border-b border-gray-100 text-gray-800 px-8 py-4 flex items-center justify-between shadow-sm shrink-0 z-30 sticky top-0">
      
      {/* ================= LOGO AREA ================= */}
      <Link href="/dashboard" className="flex items-center gap-4 group">
        {/* Logo container ka size barha diya gaya hai (h-16 w-32) */}
        <div className="h-16 w-32 flex items-center justify-center overflow-hidden">
          <img 
            src="/logo.png" 
            alt="SIMS Logo" 
            className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
        <div className="hidden xl:block border-l border-gray-200 pl-4">
          <p className="text-xl font-black text-teal-600 uppercase tracking-tighter leading-none">Paragon</p>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Inventory System</p>
        </div>
      </Link>

      {/* ================= ROLE & LOGOUT AREA ================= */}
      <div className="flex items-center gap-6">
        
        {role && (
          <div className="flex items-center gap-3 text-right hidden md:flex">
            <FaUserCircle className="text-3xl text-gray-300" />
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none">Access Level</p>
              <p className="text-sm font-black text-gray-800 capitalize leading-tight">{role}</p>
            </div>
          </div>
        )}

        {/* Aapke Combination ke mutabiq Logout:
          - Default: Light Red BG, Red Text
          - Hover: Teal BG (Aapka theme color), White Text
        */}
        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 
                     bg-red-300 text-red-700 
                     hover:bg-red-300 hover:text-red-700 shadow-lg shadow-white-300 hover:shadow-red-100"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="uppercase tracking-widest text-[11px]">Logout</span>
        </button>
        
      </div>
    </nav>
  );
}