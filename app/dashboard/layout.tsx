import ProtectedRoute from "../utils/protectedroutes";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute role="admin">
      {children}
    </ProtectedRoute>
  );
}
