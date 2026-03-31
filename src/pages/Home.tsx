import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import StudentHero from "@/components/layout/StudentHero";
import CategoryGrid from "@/components/categories/CategoryGrid";
import { useStudent } from "@/context/StudentContext";
import { getDemoStudentOptions } from "@/data/mockStudent";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserRound } from "lucide-react";

const Home = () => {
  const { setDemoStudentProfile, selectedDemoProfileId } = useStudent();
  const [showLogin, setShowLogin] = useState(() => !selectedDemoProfileId);
  const demoOptions = getDemoStudentOptions();
  const selectedOption = selectedDemoProfileId
    ? demoOptions.find((option) => option.id === selectedDemoProfileId)
    : null;

  return (
    <AppShell>
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={() => setShowLogin(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors"
        >
          <UserRound className="w-4 h-4 text-primary" />
          <span>{selectedOption ? selectedOption.title : "Select Demo User"}</span>
        </button>
      </div>

      <Dialog
        open={showLogin}
        onOpenChange={setShowLogin}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Login with Demo Student</DialogTitle>
            <DialogDescription>
              Choose one demo user to start. This will auto-fill CGPA and marks for the eligibility flow.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {demoOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setDemoStudentProfile(option.id);
                  setShowLogin(false);
                }}
                className="text-left rounded-xl border border-border p-4 hover:border-primary/40 hover:bg-secondary/20 transition-colors"
              >
                <p className="text-sm font-bold text-foreground">{option.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{option.subtitle}</p>
                <p className="text-xs text-primary mt-2 font-semibold">
                  CGPA {option.cgpa} · Marks {option.marks}%
                </p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <StudentHero />
      <CategoryGrid />
    </AppShell>
  );
};

export default Home;
