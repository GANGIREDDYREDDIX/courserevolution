import { useNavigate } from "react-router-dom";
import { useStudent } from "@/context/StudentContext";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

const ReviewAll = () => {
  const navigate = useNavigate();
  const { categories, selections, getCreditsUsed, areAllCategoriesSelected, getUnselectedCategoryNames } = useStudent();

  const allCategoriesSelected = areAllCategoriesSelected();
  const remaining = getUnselectedCategoryNames();

  if (!allCategoriesSelected) {
    return (
      <div className="py-20 max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Complete all categories first</h1>
        <p className="text-muted-foreground mb-4">
          Review is available only after all course categories are selected.
        </p>
        {remaining.length > 0 && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-5">
            Remaining: {remaining.join(", ")}
          </p>
        )}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Review All Course Categories</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Verify selections across all categories before continuing to term initiatives.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((category) => {
          const selectedCount = selections[category.id]?.selectedCourseIds?.length || 0;
          const usedCredits = getCreditsUsed(category.id);

          return (
            <div key={category.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{category.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {category.code} · {selectedCount} selected
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="w-3 h-3" />
                  Complete
                </span>
              </div>

              <div className="mt-3">
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${Math.min((usedCredits / category.maxCredits) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  {usedCredits} / {category.maxCredits} credits
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border border-border text-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <button
          onClick={() => navigate("/edurev-overview")}
          className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Continue to Term Initiatives
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ReviewAll;
