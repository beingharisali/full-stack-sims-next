// app/layout.tsx
import Link from "next/link";
import "./globals.css"; // Tailwind base CSS, agar import kiya hai

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Navbar */}
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <div className="font-bold text-xl">My Dashboard</div>
          <div className="space-x-4">
            <Link href="/products" className="hover:text-yellow-400">
              Products
            </Link>
            <Link href="/inventory" className="hover:text-yellow-400">
              Inventory
            </Link>
            <Link href="/sales" className="hover:text-yellow-400">
              Sales
            </Link>
            <Link href="/invoice" className="hover:text-yellow-400">
              Invoice
            </Link>
          </div>
        </nav>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
