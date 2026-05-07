import ClientDashboard from "./ClientDashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <ClientDashboard />
    </ProtectedRoute>
  );
}
