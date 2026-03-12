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
      <nav className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isHome && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
            <button onClick={() => navigate("/")} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-foreground leading-none">COURSREV</span>
                <span className="text-[10px] text-primary font-semibold leading-none mt-0.5">EDU-REVOLUTION</span>
              </div>
            </button>
          </div>
          <div className="hidden sm:block">
            <span className="text-xs font-medium text-muted-foreground border border-border rounded-md px-2.5 py-1">2025–26</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {children}
      </main>
    </div>
  );
};

export default AppShell;
