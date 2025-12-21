import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { createPageUrl } from "@/utils";

export default function AdminRoute({ allowedRoles = ["admin"] }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to={createPageUrl("Auth")} replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={createPageUrl("InternalDashboard")} replace />;
  }

  return <Outlet />;
}
