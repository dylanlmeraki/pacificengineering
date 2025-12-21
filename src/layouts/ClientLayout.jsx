import { Outlet, Navigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "@/components/portal/NotificationBell";

export default function ClientLayout() {
  const { user, role, loading } = useAuth();

  if (loading) return null;

  if (!user || role !== "client") {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-cyan-800 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" />
            <div>
              <h1 className="text-3xl font-bold">Client Portal</h1>
              <p className="text-cyan-100">Welcome back, {user.full_name}</p>
            </div>
          </div>
          <NotificationBell user={user} />
        </div>
      </section>

      <main className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <Outlet context={{ user }} />
        </div>
      </main>
    </div>
  );
}
