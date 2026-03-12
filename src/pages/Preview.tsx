import { useParams, useNavigate } from "react-router-dom";
import { useStudent } from "@/context/StudentContext";
import CreditMeter from "@/components/shared/CreditMeter";
import { ArrowLeft, ArrowRight, Shield } from "lucide-react";

const Preview = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { categories, selections, getCreditsUsed } = useStudent();

  const category = categories.find((c) => c.id === categoryId);
  if (!category) return <div className="py-20 text-center text-muted-foreground">Category not found.</div>;

  const sel = selections[category.id]?.selectedCourseIds || [];
  const selectedCourses = category.courses.filter((c) => sel.includes(c.id));
  const creditsUsed = getCreditsUsed(category.id);

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

      {/* Selected Courses */}
      <div className="bg-card rounded-lg overflow-hidden mb-8 border border-border">
        <div className="px-5 py-3.5 border-b border-border bg-secondary/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            <span>Selected Courses</span>
            <span>Credits</span>
          </div>
        </div>
        {selectedCourses.map((course) => (
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
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={() => navigate(`/category/${categoryId}`)}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-secondary text-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Category
        </button>
        <button
          onClick={() => navigate(`/edurev/${categoryId}`)}
          disabled={selectedCourses.length === 0}
          className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Proceed to Edu Rev Options
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Preview;
