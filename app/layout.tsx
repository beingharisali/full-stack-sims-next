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

  // ❌ Hide navbar/sidebar/footer on signup page
  const hideLayout = pathname === "/signup";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
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
