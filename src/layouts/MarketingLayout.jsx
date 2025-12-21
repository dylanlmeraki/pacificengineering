import { Outlet, Link, useLocation } from "react-router-dom";
import FloatingButtons from "@/components/FloatingButtons";
import { Button } from "@/components/ui/button";

export default function MarketingLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      {/* (use your existing header JSX here, unchanged) */}

      <main className="pt-20">
        <Outlet />
      </main>

      <FloatingButtons />

      {/* Footer */}
      {/* (use your existing footer JSX here, unchanged) */}
    </div>
  );
}
