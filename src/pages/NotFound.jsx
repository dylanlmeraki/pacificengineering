import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-6">
      <div className="max-w-lg w-full text-center">
        <div className="text-7xl font-black text-gray-200 mb-3">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-600 mb-6">
          The page you’re looking for doesn’t exist, or it was moved during the refactor.
        </p>

        <div className="flex gap-3 justify-center">
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700">Go Home</Button>
          </Link>
          <Link to="/blog">
            <Button variant="outline">Blog</Button>
          </Link>
          <Link to="/portal">
            <Button variant="outline">Client Portal</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
