import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStudent } from "@/context/StudentContext";
import CreditMeter from "@/components/shared/CreditMeter";
import ConsentModal from "@/components/preview/ConsentModal";
import { ArrowLeft, ArrowRight, Shield, X, Edit } from "lucide-react";
import { motion } from "framer-motion";

const Preview = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { categories, selections, getCreditsUsed, toggleCourse } = useStudent();
  const [showConsent, setShowConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const category = categories.find((c) => c.id === categoryId);
  const isMandatoryCategory = !!category && !category.isElective;
  const isEngineeringMinorPathOnly = !!category && category.id === "cat-4";
  const isReadOnlySelection = isMandatoryCategory || isEngineeringMinorPathOnly;
  const selectedCourses = useMemo(() => {
    if (!category) return [];
    const sel = selections[category.id]?.selectedCourseIds || [];
    return category.courses.filter((c) => sel.includes(c.id));
  }, [category, selections]);
  const creditsUsed = category ? getCreditsUsed(category.id) : 0;

  const coursesByTerm = useMemo(() => {
    const grouped = new Map<number, typeof selectedCourses>();
    for (const course of selectedCourses) {
      const list = grouped.get(course.term) || [];
      list.push(course);
      grouped.set(course.term, list);
    }
    return Array.from(grouped.entries()).sort(([a], [b]) => a - b);
  }, [selectedCourses]);

  if (!category) return (
    <div className="py-20 text-center">
      <p className="text-muted-foreground mb-4">Category not found.</p>
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
      >
        Back to Home
      </button>
    </div>
  );

  return (
    <div className="py-8 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Confirm Selected Courses</h1>
          <p className="text-sm text-muted-foreground">{category.name} — {selectedCourses.length} courses selected</p>
        </div>
      </div>

      <div className="mt-6 mb-8">
        <CreditMeter used={creditsUsed} max={category.maxCredits} colorKey={category.colorKey} size="md" />
      </div>

      {/* Selected Courses grouped by Term */}
      {coursesByTerm.map(([term, courses]) => (
        <div key={term} className="bg-card rounded-lg overflow-hidden mb-6 border border-border">
          <div className="px-5 py-3.5 border-b border-border bg-secondary/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              <span>{courses[0].yearLabel} (Term {term})</span>
              <span>Credits</span>
            </div>
          </div>
          {courses.map((course) => (
            <div key={course.id} className="border-b border-border last:border-0 group hover:bg-secondary/30 transition-colors">
              <div className="flex items-center justify-between py-4 px-5 gap-4">
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
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-foreground tabular-nums">{course.credits}</span>
                  {!isReadOnlySelection && (
                    <button
                      onClick={() => toggleCourse(category.id, course.id)}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove course"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="flex gap-3 justify-between mt-8">
        <button
          onClick={() => navigate(`/category/${categoryId}`)}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border border-border text-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors"
        >
          <Edit className="w-4 h-4" />
          {isEngineeringMinorPathOnly ? "Change Pathway" : isMandatoryCategory ? "View Courses" : "Edit Selections"}
        </button>
        {!consentGiven ? (
          <button
            onClick={() => setShowConsent(true)}
            disabled={selectedCourses.length === 0}
            className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shield className="w-4 h-4" />
            Confirm & Continue
          </button>
        ) : (
          <button
            onClick={() => navigate(`/edurev-overview/${categoryId}`)}
            className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Explore Edu Rev Initiatives
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <ConsentModal
        open={showConsent}
        onCancel={() => setShowConsent(false)}
        onConfirm={() => {
          setShowConsent(false);
          setConsentGiven(true);
        }}
        title="Confirm Your Course Selection"
        subtitle="Please review and confirm"
        description='By confirming, you acknowledge that you have reviewed your course selections and are ready to explore <strong class="text-foreground">Edu Rev initiatives</strong>. You can still edit your selections if needed.'
        cancelLabel="Go Back"
        confirmLabel="Confirm"
      />
    </div>
  );
};

export default Preview;
