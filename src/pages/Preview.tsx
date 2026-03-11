import { useParams, useNavigate } from "react-router-dom";
import { useStudent } from "@/context/StudentContext";
import CreditMeter from "@/components/shared/CreditMeter";
import ConsentModal from "@/components/preview/ConsentModal";
import { useState } from "react";

const Preview = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { categories, selections, getCreditsUsed, finalizeCategory } = useStudent();
  const [showConsent, setShowConsent] = useState(false);

  const category = categories.find((c) => c.id === categoryId);
  if (!category) return <div className="py-20 text-center text-muted-foreground">Category not found.</div>;

  const sel = selections[category.id]?.selectedCourseIds || [];
  const selectedCourses = category.courses.filter((c) => sel.includes(c.id));
  const creditsUsed = getCreditsUsed(category.id);

  const handleFinalize = () => {
    finalizeCategory(category.id);
    setShowConsent(false);
    navigate("/");
  };

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold tracking-[-0.02em] text-foreground mb-1">Review Selection</h1>
      <p className="text-sm text-muted-foreground mb-6">{category.name} — {selectedCourses.length} courses selected</p>

      <div className="mb-8">
        <CreditMeter used={creditsUsed} max={category.maxCredits} colorKey={category.colorKey} size="md" />
      </div>

      <div className="bg-card rounded-2xl shadow-card overflow-hidden mb-8">
        <div className="px-5 py-3 border-b border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider">
            <span>Course</span>
            <span>Credits</span>
          </div>
        </div>
        {selectedCourses.map((course) => (
          <div key={course.id} className="flex items-center justify-between py-4 px-5 border-b border-border/50 last:border-0">
            <div>
              <span className="font-mono text-xs text-muted-foreground tracking-tight">{course.courseCode}</span>
              <p className="text-sm font-medium text-foreground">{course.name}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span>L:{course.L}</span>
                <span>T:{course.T}</span>
                <span>P:{course.P}</span>
                <span>Year {course.year}, Sem {course.term}</span>
              </div>
            </div>
            <span className="font-mono text-sm font-medium text-foreground tabular-nums">{course.credits}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={() => navigate(-1)}
          className="h-10 px-5 rounded-xl bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
          Save as Draft
        </button>
        <button
          onClick={() => setShowConsent(true)}
          className="h-10 px-5 rounded-xl bg-foreground text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Finalize Selection
        </button>
      </div>

      <ConsentModal open={showConsent} onCancel={() => setShowConsent(false)} onConfirm={handleFinalize} />
    </div>
  );
};

export default Preview;
