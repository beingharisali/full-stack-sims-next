"use client"; // must be client

import "./globals.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  const hideLayout = pathname === "/" || pathname === "/signup";

  // Show layout if user exists or not on login/signup
  const showLayout = !hideLayout || (!!user && !isLoading);

  return (
    <>
      <Toaster position="top-right" />
      {showLayout && <Navbar />}
      <div className="flex flex-1">
        {showLayout && <Sidebar />}
        <main className="flex-1 p-6">{children}</main>
      </div>
      {showLayout && <Footer />}
    </>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen flex flex-col">
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
