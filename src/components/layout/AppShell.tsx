import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GraduationCap, ArrowLeft } from "lucide-react";

const AppShell = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isHome && (
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 -ml-1.5 rounded-lg hover:bg-secondary transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
            <button onClick={() => navigate("/")} className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-foreground" />
              <span className="text-sm font-semibold tracking-tight text-foreground">Course Mapper</span>
            </button>
          </div>
          <span className="text-xs text-muted-foreground font-mono">2025/2026</span>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {children}
      </main>
    </div>
  );
};

export default AppShell;
