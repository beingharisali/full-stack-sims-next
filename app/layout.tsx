"use client";

import "./globals.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // ❌ Hide layout on login & signup pages
  const hideLayout =
    pathname === "/" ||
    pathname === "/signup";

  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen flex flex-col">
        {/* Navbar */}
        {!hideLayout && <Navbar />}

        <div className="flex flex-1">
          {/* Sidebar */}
          {!hideLayout && <Sidebar />}

          {/* Main Content */}
          <main className="flex-1 p-6">{children}</main>
        </div>

        {/* Footer */}
        {!hideLayout && <Footer />}
      </body>
    </html>
  );
}
