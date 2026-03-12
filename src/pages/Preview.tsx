import { useParams, useNavigate } from "react-router-dom";
import { useStudent } from "@/context/StudentContext";
import CreditMeter from "@/components/shared/CreditMeter";
import ConsentModal from "@/components/preview/ConsentModal";
import { EDU_REV_OPTIONS } from "@/data/eduRevTypes";
import { useState } from "react";
import { FileText, AlertCircle, CheckCircle2, ArrowLeft, Shield } from "lucide-react";

const Preview = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { categories, selections, getCreditsUsed, getEduRevSelection, finalizeCategory } = useStudent();
  const [showConsent, setShowConsent] = useState(false);

  const category = categories.find((c) => c.id === categoryId);
  if (!category) return <div className="py-20 text-center text-muted-foreground">Category not found.</div>;

  const sel = selections[category.id]?.selectedCourseIds || [];
  const selectedCourses = category.courses.filter((c) => sel.includes(c.id));
  const creditsUsed = getCreditsUsed(category.id);

  const allEduRevComplete = selectedCourses.every((course) => {
    const eduRev = getEduRevSelection(course.id);
    return (
      eduRev &&
      eduRev.benefitType &&
      eduRev.achievement &&
      eduRev.achievement.title &&
      eduRev.achievement.description &&
      eduRev.achievement.documentFile
    );
  });

  const handleFinalize = () => {
    finalizeCategory(category.id);
    setShowConsent(false);
    navigate("/");
  };

  return (
    <div className="py-8 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Review Selection</h1>
          <p className="text-sm text-muted-foreground">{category.name} — {selectedCourses.length} courses selected</p>
        </div>
      </div>

      <div className="mt-6 mb-8">
        <CreditMeter used={creditsUsed} max={category.maxCredits} colorKey={category.colorKey} size="md" />
      </div>

      {/* Courses with Edu Rev Details */}
      <div className="bg-card rounded-lg overflow-hidden mb-8 border border-border">
        <div className="px-5 py-3.5 border-b border-border bg-secondary/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            <span>Course & Edu Rev Details</span>
            <span>Credits</span>
          </div>
        </div>
        {selectedCourses.map((course) => {
          const eduRev = getEduRevSelection(course.id);
          const optionLabel = eduRev?.optionType
            ? EDU_REV_OPTIONS[eduRev.optionType].label
            : "Not selected";

          return (
            <div key={course.id} className="border-b border-border last:border-0">
              <div className="flex items-center justify-between py-4 px-5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{course.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-mono text-[11px] text-muted-foreground tracking-tight">{course.courseCode}</span>
                    <span className="text-[11px] text-muted-foreground/60">·</span>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground/60">
                      <span>L:{course.L}</span>
                      <span>T:{course.T}</span>
                      <span>P:{course.P}</span>
                    </div>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-foreground tabular-nums ml-4">{course.credits}</span>
              </div>

              {/* Edu Rev Details */}
              {eduRev && (
                <div className="px-5 pb-4 pt-2 bg-primary/[0.02] border-t border-border">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {optionLabel}
                      </span>
                    </div>

                    {eduRev.achievement && (
                      <>
                        <div>
                          <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Achievement</p>
                          <p className="text-sm font-medium text-foreground">{eduRev.achievement.title}</p>
                        </div>

                        <div>
                          <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Description</p>
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{eduRev.achievement.description}</p>
                        </div>

                        {eduRev.achievement.documentName && (
                          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-card border border-border">
                            <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center">
                              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                            <span className="text-xs text-muted-foreground font-medium truncate">{eduRev.achievement.documentName}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-auto" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Validation Message */}
      {!allEduRevComplete && (
        <div className="flex items-center gap-2.5 mb-6 px-4 py-3.5 rounded-lg bg-amber-50 text-amber-700 text-sm border border-amber-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-medium">Some courses are missing Edu Rev details. Please complete all selections before finalizing.</span>
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <button
          onClick={() => navigate(`/edurev/${categoryId}`)}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-secondary text-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Edu Rev
        </button>
        <button
          onClick={() => setShowConsent(true)}
          disabled={!allEduRevComplete}
          className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Shield className="w-4 h-4" />
          Finalize Selection
        </button>
      </div>

      <ConsentModal open={showConsent} onCancel={() => setShowConsent(false)} onConfirm={handleFinalize} />
    </div>
  );
};

export default Preview;
