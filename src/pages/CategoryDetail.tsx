import { useParams, useNavigate } from "react-router-dom";
import { useStudent } from "@/context/StudentContext";
import { categoryIcons } from "@/data/categoryIcons";
import CreditMeter from "@/components/shared/CreditMeter";
import StatusChip from "@/components/shared/StatusChip";
import { motion } from "framer-motion";
import { Lock, Check } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories, selections, toggleCourse, getCreditsUsed, getStatus } = useStudent();

  const category = categories.find((c) => c.id === id);
  if (!category) return <div className="py-20 text-center text-muted-foreground">Category not found.</div>;

  const status = getStatus(category.id);
  const creditsUsed = getCreditsUsed(category.id);
  const isFinalized = status === "finalized";
  const sel = selections[category.id]?.selectedCourseIds || [];
  const capReached = creditsUsed >= category.maxCredits;
  const Icon = categoryIcons[category.id];

  return (
    <div className="py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-foreground">{category.name}</h1>
        </div>
        <StatusChip status={status} />
      </div>

      <p className="text-sm text-muted-foreground mb-6 font-mono tracking-tight">{category.code} · {category.courses.length} courses available</p>

      <div className="mb-8">
        <CreditMeter used={creditsUsed} max={category.maxCredits} colorKey={category.colorKey} size="md" />
      </div>

      {isFinalized && (
        <div className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm">
          <Lock className="w-4 h-4" />
          This category has been finalized. Selections are locked.
        </div>
      )}

      {/* Course List */}
      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        {category.courses.map((course) => {
          const isSelected = sel.includes(course.id);
          const isDisabled = isFinalized || (!isSelected && capReached);

          return (
            <label
              key={course.id}
              className={`flex items-center justify-between py-4 px-5 border-b border-border/50 last:border-0 transition-colors
                ${isDisabled && !isSelected ? "opacity-50 pointer-events-none" : ""}
                ${isSelected ? "bg-secondary/50" : "hover:bg-secondary/30"}
                ${isFinalized ? "cursor-default" : "cursor-pointer"}
              `}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Checkbox */}
                <motion.div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors
                    ${isSelected ? "bg-foreground border-foreground" : "border-border bg-card"}
                  `}
                  whileTap={!isFinalized ? { scale: 0.9 } : undefined}
                >
                  {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                </motion.div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => toggleCourse(category.id, course.id)}
                />
                <div className="min-w-0">
                  <span className="font-mono text-xs text-muted-foreground tracking-tight">{course.courseCode}</span>
                  <p className="text-sm font-medium text-foreground truncate">{course.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 ml-4">
                <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                  <span>L:{course.L}</span>
                  <span>T:{course.T}</span>
                  <span>P:{course.P}</span>
                </div>
                <span className="font-mono text-sm font-medium text-foreground w-8 text-right tabular-nums">
                  {course.credits}
                </span>
              </div>
            </label>
          );
        })}
      </div>

      {/* Actions */}
      {!isFinalized && sel.length > 0 && (
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={() => navigate(`/preview/${category.id}`)}
            className="h-10 px-5 rounded-xl bg-foreground text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Preview Selection →
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryDetail;
