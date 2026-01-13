import "./globals.css";
import AppShell from "./appshell"; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
