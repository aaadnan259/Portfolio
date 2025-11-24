import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
            <h2 className="text-4xl font-bold text-text-light mt-4 mb-6">Page Not Found</h2>
            <p className="text-text/80 text-lg mb-10 max-w-md">
                Oops! The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                href="/"
                className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-all flex items-center gap-2 group"
            >
                <Home size={18} />
                Back to Home
            </Link>
        </div>
    );
}
