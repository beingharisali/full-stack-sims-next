"use client";

import "./globals.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { AuthProvider, useAuth } from "../context/authcontext";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hideLayout = pathname === "/" || pathname === "/signup";

  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen flex flex-col">
        <AuthProvider>
          <Toaster position="top-right" />
          {!hideLayout && <Navbar />}
          <div className="flex flex-1">
            {!hideLayout && <Sidebar />}
            <main className="flex-1 p-6">{children}</main>
          </div>

          {/* Conditional Footer */}
          {!hideLayout && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}
