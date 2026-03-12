import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { GraduationCap } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <GraduationCap className="w-8 h-8 text-primary" />
        </div>
        <h1 className="mb-2 text-6xl font-extrabold text-gradient">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">This page doesn't exist</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-gradient-to-r from-primary to-amber-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
