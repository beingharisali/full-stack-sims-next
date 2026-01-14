"use client";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";
import { AuthProvider } from "./context/authcontext";
import { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  // hide layout on specific routes
  const hideLayout = pathname === "/" || pathname === "/signup";

  return (
    <AuthProvider>
      {!hideLayout && <Navbar />}

      <div className="flex min-h-screen">
        {!hideLayout && <Sidebar />}

        <main className="flex-1 p-6">{children}</main>
      </div>

      {!hideLayout && <Footer />}
    </AuthProvider>
  );
}
