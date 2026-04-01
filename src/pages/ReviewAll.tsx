import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudent } from "@/context/StudentContext";

import { ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, PencilLine } from "lucide-react";

const FLOW_STORAGE_KEY = "course-navigator-flow-inputs";
const CGPA_THRESHOLD = 8;
const MARKS_THRESHOLD = 75;

const loadSavedFlowInputs = () => {
  try {
    const raw = localStorage.getItem(FLOW_STORAGE_KEY);
    if (!raw) return { cgpa: "", marks: "" };
    const parsed = JSON.parse(raw) as { cgpa?: string; marks?: string };
    return {
      cgpa: typeof parsed.cgpa === "string" ? parsed.cgpa : "",
      marks: typeof parsed.marks === "string" ? parsed.marks : "",
    };
  } catch {
    return { cgpa: "", marks: "" };
  }
};

const ReviewAll = () => {
  const navigate = useNavigate();
  const { student, categories, selections, getCreditsUsed, areAllCategoriesSelected, getUnselectedCategoryNames } = useStudent();
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<string[]>([]);

  const [flowInputs, setFlowInputs] = useState(loadSavedFlowInputs);
  const [showAcademic, setShowAcademic] = useState(true);
  const [showCategories, setShowCategories] = useState(false);

  const allCategoriesSelected = areAllCategoriesSelected();
  const remaining = getUnselectedCategoryNames();
  const cgpa = Number(flowInputs.cgpa);
  const marks = Number(flowInputs.marks);
  const hasValidCgpa = Number.isFinite(cgpa) && cgpa >= 0 && cgpa <= 10;
  const hasValidMarks = Number.isFinite(marks) && marks >= 0 && marks <= 100;
  const hasValidAcademicInputs = hasValidCgpa && hasValidMarks;
  const isEligibleStudent = (student.cgpa >= CGPA_THRESHOLD) || (student.marks >= MARKS_THRESHOLD);

  const isHighPerformanceFlow = hasValidAcademicInputs && (cgpa >= CGPA_THRESHOLD || marks >= MARKS_THRESHOLD);
  const selectedFlowTitle = isHighPerformanceFlow ? "Advanced Growth Flow" : "Foundation Support Flow";
  const selectedFlowDescription = isHighPerformanceFlow
    ? "You qualify for an advanced pathway with tier planning and goal-based progression."
    : "You will start with a foundation-first pathway focused on strengthening readiness and consistency.";

  const canProceed = hasValidAcademicInputs;

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const updateFlowInput = (key: "cgpa" | "marks", value: string) => {
    const next = { ...flowInputs, [key]: value };
    setFlowInputs(next);
    localStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify(next));
  };

  const proceedByFlow = () => {
    if (!canProceed) return;

    if (isHighPerformanceFlow) {
      navigate("/edurev-pathway", {
        state: {
          flowType: "advanced",
          cgpa,
          marks,
        },
      });
      return;
    }

    navigate("/edurev-overview", {
      state: {
        flowType: "foundation",
        cgpa,
        marks,
      },
    });
  };

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
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <button 
          onClick={() => setShowCategories(!showCategories)}
          className="w-full flex items-center justify-between p-4 md:p-5 bg-card hover:bg-secondary/20 transition-colors"
        >
          <div className="text-left">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Review All Course Categories</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Verify selections across all categories before continuing to term initiatives.
            </p>
          </div>
          {showCategories ? <ChevronUp className="w-6 h-6 text-muted-foreground" /> : <ChevronDown className="w-6 h-6 text-muted-foreground" />}
        </button>

        {showCategories && (
          <div className="p-4 md:p-5 border-t border-border bg-secondary/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((category) => {
          const selectedCount = selections[category.id]?.selectedCourseIds?.length || 0;
          const selectedCourseIds = selections[category.id]?.selectedCourseIds || [];
          const selectedCourses = category.courses.filter((course) => selectedCourseIds.includes(course.id));
          const isExpanded = expandedCategoryIds.includes(category.id);
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

              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleExpanded(category.id)}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        Hide Review
                        <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        Review
                        <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  {category.isElective && (
                    <button
                      onClick={() => navigate(`/category/${category.id}`)}
                      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-primary/30 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                    >
                      <PencilLine className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-3 rounded-lg border border-border bg-secondary/20 p-3 space-y-2">
                  {selectedCourses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{course.name}</p>
                        <p className="font-mono text-muted-foreground">{course.courseCode}</p>
                      </div>
                      <span className="font-mono text-muted-foreground shrink-0">{course.credits} cr</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
            </div>
          </div>
        )}
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
          onClick={() => {
            if (!isEligibleStudent) {
              window.location.replace("https://edurev.vercel.app/");
              return;
            }
            proceedByFlow();
          }}
          className={`inline-flex items-center gap-2 h-10 px-6 rounded-lg font-bold text-sm shadow-sm transition-all ${
            canProceed
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-secondary text-muted-foreground opacity-50 cursor-not-allowed"
          }`}
          disabled={!canProceed}
        >
          Select your Learning Pathway
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden">
        <button 
          onClick={() => setShowAcademic(!showAcademic)}
          className="w-full flex items-center justify-between p-4 bg-secondary/20 hover:bg-secondary/40 transition-colors"
        >
          <div className="text-left">
            <h2 className="text-sm font-bold text-foreground">Academic Eligibility Flow</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              We use CGPA and current marks to assign one of two student flows.
            </p>
          </div>
          {showAcademic ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
        </button>

        {showAcademic && (
          <div className="p-4 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cgpa-input" className="text-xs font-semibold text-foreground">CGPA (0-10)</label>
            <input
              id="cgpa-input"
              type="number"
              min={0}
              max={10}
              step="0.01"
              value={flowInputs.cgpa}
              onChange={(event) => updateFlowInput("cgpa", event.target.value)}
              className="mt-1 w-full h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="e.g. 8.2"
            />
          </div>

          <div>
            <label htmlFor="marks-input" className="text-xs font-semibold text-foreground">Marks (%)</label>
            <input
              id="marks-input"
              type="number"
              min={0}
              max={100}
              step="0.1"
              value={flowInputs.marks}
              onChange={(event) => updateFlowInput("marks", event.target.value)}
              className="mt-1 w-full h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="e.g. 78"
            />
          </div>
        </div>

        {!hasValidAcademicInputs && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mt-3">
            Enter valid values to continue. CGPA must be between 0 and 10, and marks must be between 0 and 100.
          </p>
        )}

        {hasValidAcademicInputs && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className={`rounded-lg border p-3 ${isHighPerformanceFlow ? "border-emerald-300 bg-emerald-50" : "border-border bg-secondary/20"}`}>
              <p className="text-xs font-semibold text-foreground">Advanced Growth Flow</p>
              <p className="text-xs text-muted-foreground mt-1">Eligible when CGPA ≥ {CGPA_THRESHOLD} or Marks ≥ {MARKS_THRESHOLD}%.</p>
            </div>

            <div className={`rounded-lg border p-3 ${!isHighPerformanceFlow ? "border-blue-300 bg-blue-50" : "border-border bg-secondary/20"}`}>
              <p className="text-xs font-semibold text-foreground">Foundation Support Flow</p>
              <p className="text-xs text-muted-foreground mt-1">Default flow when both values are below the advanced threshold.</p>
            </div>
          </div>
        )}

          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewAll;
