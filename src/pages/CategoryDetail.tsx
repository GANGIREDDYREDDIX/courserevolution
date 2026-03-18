import { useEffect, useMemo, useState } from "react";
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
  rose: "bg-rose-50",
  lime: "bg-lime-50",
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
  rose: "text-rose-600",
  lime: "text-lime-600",
};

const engineeringMinorPaths = [
  { id: "em-cloud", label: "Cloud Computing", color: "from-blue-500 to-blue-600" },
  { id: "em-cyber", label: "Cyber Security", color: "from-slate-700 to-slate-800" },
  { id: "em-data", label: "Data Science", color: "from-indigo-500 to-indigo-600" },
  { id: "em-ml", label: "Machine Learning", color: "from-purple-500 to-purple-600" },
  { id: "em-qe", label: "Quality Engineering and Test Automation", color: "from-amber-500 to-amber-600" },
  { id: "em-fullstack", label: "Full Stack Web Development", color: "from-teal-500 to-teal-600" },
] as const;

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { student, categories, selections, toggleCourse, setCategorySelectedCourses, getCreditsUsed, getStatus } = useStudent();

  const category = categories.find((c) => c.id === id);
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

  const status = getStatus(category.id);
  const creditsUsed = getCreditsUsed(category.id);
  const isFinalized = status === "finalized";
  const isMandatoryCategory = !category.isElective;
  const isEngineeringMinorPathOnly = category.id === "cat-4";
  const sel = selections[category.id]?.selectedCourseIds || [];
  const Icon = categoryIcons[category.id];
  const colorText = textMap[category.colorKey] || textMap.blue;
  const colorBg = bgMap[category.colorKey] || bgMap.blue;
  const isEngineeringMinor = category.id === "cat-4";

  const detectedPathFromSelection = useMemo(() => {
    if (!isEngineeringMinor || sel.length === 0) return null;
    const found = engineeringMinorPaths.find((path) => sel.some((courseId) => courseId.startsWith(`${path.id}-`)));
    return found?.id ?? null;
  }, [isEngineeringMinor, sel]);

  const [selectedMinorPath, setSelectedMinorPath] = useState<string>(detectedPathFromSelection || engineeringMinorPaths[0].id);

  useEffect(() => {
    if (!isEngineeringMinor) return;
    if (detectedPathFromSelection) {
      setSelectedMinorPath(detectedPathFromSelection);
    }
  }, [detectedPathFromSelection, isEngineeringMinor]);

  const studentCurrentTerm = (student.year - 1) * 2 + student.term;

  const displayedCourses = useMemo(() => {
    if (!isEngineeringMinor) return category.courses;
    return category.courses.filter((course) => course.id.startsWith(`${selectedMinorPath}-`));
  }, [category.courses, isEngineeringMinor, selectedMinorPath]);

  // Group courses by term
  const coursesByTerm: Record<number, typeof displayedCourses> = {};
  for (const course of displayedCourses) {
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

  const handlePathChange = (pathId: string) => {
    if (!isEngineeringMinor || pathId === selectedMinorPath) return;

    const pathwayCourseIds = category.courses
      .filter((course) => course.id.startsWith(`${pathId}-`))
      .map((course) => course.id);

    setCategorySelectedCourses(category.id, pathwayCourseIds);
    setSelectedMinorPath(pathId);
  };

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
                {category.code} · {isEngineeringMinor ? `${engineeringMinorPaths.length} pathways` : `${category.courses.length} courses`} · Max {category.maxCredits} credits
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

      {isEngineeringMinor && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">Engineering Minor Areas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {engineeringMinorPaths.map((path) => {
              const isActive = selectedMinorPath === path.id;
              return (
                <button
                  key={path.id}
                  type="button"
                  onClick={() => handlePathChange(path.id)}
                  className={`rounded-xl p-4 text-left border-2 transition-all text-white bg-gradient-to-r ${path.color} ${
                    isActive ? "ring-2 ring-primary/40 scale-[1.01]" : "opacity-90 hover:opacity-100"
                  }`}
                >
                  <div className="text-sm font-bold tracking-wide uppercase">{path.label}</div>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Select one pathway. Courses are auto-selected for the chosen pathway.
          </p>
        </div>
      )}

      {isFinalized && (
        <div className="flex items-center gap-2.5 mb-6 px-4 py-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm border border-emerald-200">
          <Lock className="w-4 h-4" />
          <span className="font-medium">This category has been finalized. Selections are locked.</span>
        </div>
      )}

      {isMandatoryCategory && (
        <div className="flex items-center gap-2.5 mb-6 px-4 py-3 rounded-lg bg-blue-50 text-blue-700 text-sm border border-blue-200">
          <Info className="w-4 h-4" />
          <span className="font-medium">This is a mandatory category. All courses are fixed and pre-selected.</span>
        </div>
      )}

      {isEngineeringMinorPathOnly && (
        <div className="flex items-center gap-2.5 mb-6 px-4 py-3 rounded-lg bg-orange-50 text-orange-700 text-sm border border-orange-200">
          <Info className="w-4 h-4" />
          <span className="font-medium">Engineering Minor is pathway-based. Select a pathway; individual course selection is disabled.</span>
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
                    const isDisabled = isMandatoryCategory || isEngineeringMinorPathOnly || isFinalized || (!isSelected && wouldExceed);

                    return (
                      <label
                        key={course.id}
                        className={`flex flex-col gap-2 p-4 rounded-xl border-2 transition-all
                          ${isDisabled && !isSelected ? "opacity-40 pointer-events-none" : ""}
                          ${isSelected ? "bg-primary/[0.04] border-primary/30" : "border-border bg-card hover:bg-secondary/30"}
                          ${(isDisabled || isEngineeringMinorPathOnly) ? "cursor-default" : "cursor-pointer"}
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
                          {!isEngineeringMinorPathOnly && (
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={isSelected}
                              disabled={isDisabled}
                              onChange={() => toggleCourse(category.id, course.id)}
                            />
                          )}
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
