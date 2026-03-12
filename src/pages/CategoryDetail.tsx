import { useParams, useNavigate } from "react-router-dom";
import { useStudent } from "@/context/StudentContext";
import { categoryIcons } from "@/data/categoryIcons";
import StatusChip from "@/components/shared/StatusChip";
import { motion } from "framer-motion";
import { Lock, ArrowRight, MapPin, CheckCircle2, Circle, Info } from "lucide-react";
import { COMPLETED_TERM_ALLOWED_OPTIONS, EDU_REV_OPTIONS } from "@/data/eduRevTypes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const bgMap: Record<string, string> = {
  purple: "bg-purple-50",
  charcoal: "bg-gray-100",
  blue: "bg-blue-50",
  orange: "bg-orange-50",
  red: "bg-red-50",
  yellow: "bg-amber-50",
  navy: "bg-indigo-50",
  green: "bg-emerald-50",
  teal: "bg-teal-50",
  gold: "bg-amber-50",
  cyan: "bg-cyan-50",
  slate: "bg-slate-100",
};

const textMap: Record<string, string> = {
  purple: "text-purple-600",
  charcoal: "text-gray-600",
  blue: "text-blue-600",
  orange: "text-orange-600",
  red: "text-red-600",
  yellow: "text-amber-600",
  navy: "text-indigo-700",
  green: "text-emerald-600",
  teal: "text-teal-600",
  gold: "text-amber-600",
  cyan: "text-cyan-600",
  slate: "text-slate-600",
};

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { student, categories, selections, toggleCourse, getCreditsUsed, getStatus } = useStudent();

  const category = categories.find((c) => c.id === id);
  if (!category) return <div className="py-20 text-center text-muted-foreground">Category not found.</div>;

  const status = getStatus(category.id);
  const creditsUsed = getCreditsUsed(category.id);
  const isFinalized = status === "finalized";
  const sel = selections[category.id]?.selectedCourseIds || [];
  const Icon = categoryIcons[category.id];
  const colorText = textMap[category.colorKey] || textMap.blue;
  const colorBg = bgMap[category.colorKey] || bgMap.blue;

  const studentCurrentTerm = (student.year - 1) * 2 + student.term;

  // Group courses by term
  const coursesByTerm: Record<number, typeof category.courses> = {};
  for (const course of category.courses) {
    (coursesByTerm[course.term] ||= []).push(course);
  }
  const termNumbers = Object.keys(coursesByTerm).map(Number).sort((a, b) => a - b);

  const getTermStatus = (term: number) => {
    if (term < studentCurrentTerm) return "completed" as const;
    if (term === studentCurrentTerm) return "current" as const;
    return "upcoming" as const;
  };

  const getTermCredits = (courses: typeof category.courses) =>
    courses.reduce((sum, c) => sum + c.credits, 0);

  const getTermSelectedCredits = (courses: typeof category.courses) =>
    courses.filter((c) => sel.includes(c.id)).reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="py-8 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorBg}`}>
                <Icon className={`w-5 h-5 ${colorText}`} />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">{category.name}</h1>
              <p className="text-sm text-muted-foreground font-mono tracking-tight mt-0.5">
                {category.code} · {category.courses.length} courses · Max {category.maxCredits} credits
              </p>
            </div>
          </div>
          <StatusChip status={status} />
        </div>
      </div>

      {/* Credit bar */}
      <div className="bg-card rounded-xl border border-border p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Credits Used</span>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">{sel.length} selected</span>
        </div>
        <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-2 rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((creditsUsed / category.maxCredits) * 100, 100)}%` }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        </div>
        <span className="font-mono text-xs tabular-nums text-muted-foreground mt-1.5 block">
          {creditsUsed} / {category.maxCredits} Credits Selected
        </span>
      </div>

      {isFinalized && (
        <div className="flex items-center gap-2.5 mb-6 px-4 py-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm border border-emerald-200">
          <Lock className="w-4 h-4" />
          <span className="font-medium">This category has been finalized. Selections are locked.</span>
        </div>
      )}

      {/* Term-grouped course list */}
      <Accordion
        type="multiple"
        defaultValue={termNumbers.map((t) => `term-${t}`)}
        className="space-y-3"
      >
        {termNumbers.map((term) => {
          const courses = coursesByTerm[term];
          const termStatus = getTermStatus(term);
          const isTermCompleted = termStatus === "completed";
          const isTermCurrent = termStatus === "current";
          const termCredits = getTermCredits(courses);
          const termSelectedCredits = getTermSelectedCredits(courses);

          return (
            <AccordionItem
              key={term}
              value={`term-${term}`}
              className={`bg-card rounded-xl overflow-hidden ${
                isTermCurrent
                  ? "border-2 border-primary/30"
                  : "border border-border"
              }`}
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  {/* Status icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isTermCompleted ? "bg-emerald-100" : isTermCurrent ? "bg-primary/10" : "bg-secondary"
                  }`}>
                    {isTermCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isTermCurrent ? (
                      <MapPin className="w-4 h-4 text-primary" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">Term {term}</span>
                      {isTermCurrent && (
                        <span className="uppercase text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded tracking-wider inline-flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" />
                          Your Current Term
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 text-left">
                      {isTermCompleted
                        ? `Completed \u00B7 ${courses.length} Courses \u00B7 ${termSelectedCredits > 0 ? `${termSelectedCredits} Credits Selected` : `${termCredits} Credits`}`
                        : isTermCurrent
                        ? `Selection in Progress \u00B7 ${termSelectedCredits} of ${category.maxCredits} Credits Selected`
                        : `${courses.length} Courses \u00B7 ${termCredits} Credits`
                      }
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                {isTermCompleted && (
                  <div className="mx-4 mt-3 flex items-start gap-2 px-3 py-2.5 rounded-lg bg-amber-50 text-amber-800 text-xs border border-amber-200">
                    <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>
                      Completed-term courses are eligible only for:{" "}
                      <strong>{COMPLETED_TERM_ALLOWED_OPTIONS.map(t => EDU_REV_OPTIONS[t].label).join(", ")}</strong>
                    </span>
                  </div>
                )}
                <div className="border-t border-border p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {courses.map((course) => {
                    const isSelected = sel.includes(course.id);
                    const wouldExceed = creditsUsed + course.credits > category.maxCredits;
                    const isDisabled = isFinalized || (!isSelected && wouldExceed);

                    return (
                      <label
                        key={course.id}
                        className={`flex flex-col gap-2 p-4 rounded-xl border-2 transition-all
                          ${isDisabled && !isSelected ? "opacity-40 pointer-events-none" : ""}
                          ${isSelected ? "bg-primary/[0.04] border-primary/30" : "border-border bg-card hover:bg-secondary/30"}
                          ${isDisabled ? "cursor-default" : "cursor-pointer"}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          {/* Check circle */}
                          <div className="shrink-0">
                            {isSelected ? (
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                            ) : (
                              <Circle className={`w-5 h-5 ${isTermCompleted ? "text-border" : "text-border"} transition-colors`} />
                            )}
                          </div>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={isSelected}
                            disabled={isDisabled}
                            onChange={() => toggleCourse(category.id, course.id)}
                          />
                          {/* Credits */}
                          <span className={`text-sm font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>
                            {course.credits} Credits
                          </span>
                        </div>

                        {/* Content */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-mono text-[11px] font-semibold ${colorText} ${colorBg} rounded px-1.5 py-0.5`}>
                              {course.courseCode}
                            </span>
                            <span className="text-sm font-bold text-foreground">{course.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2">
                            {[`L:${course.L}`, `T:${course.T}`, `P:${course.P}`].map((pill) => (
                              <span key={pill} className="text-[10px] font-medium text-muted-foreground bg-secondary rounded px-1.5 py-0.5">
                                {pill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Actions */}
      {!isFinalized && sel.length > 0 && (
        <div className="mt-8 flex gap-3 justify-end">
          <button
            onClick={() => navigate(`/preview/${category.id}`)}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Review Selected Courses
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryDetail;
