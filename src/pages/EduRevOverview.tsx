import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useStudent } from "@/context/StudentContext";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { 
  Lightbulb,
  BookOpen,
  Briefcase, 
  Award, 
  Code, 
  DollarSign,
  FileText,
  Download,
  FileSpreadsheet,
  Globe,
  Laptop,
  Network,
  Target
} from "lucide-react";
import type { EduRevPathwayId, EduRevTierId } from "@/context/StudentContext";

// Dummy data for each term
const termDetails: Record<number, {
  inClass: Array<{ title: string; code: string; description: string; ltp: string; credits: number }>;
  outClass: Array<{ category: string; title: string; description: string; icon: any; color: string }>;
}> = {
  1: {
    inClass: [
      {
        title: "Computer Programming",
        code: "CSE111",
        description: "Introduction to programming fundamentals with hands-on coding exercises",
        ltp: "L:3 T:0 P:2",
        credits: 4
      },
      {
        title: "Applied Chemistry",
        code: "CHE110",
        description: "Chemical principles and their applications in engineering",
        ltp: "L:2 T:0 P:2",
        credits: 3
      }
    ],
    outClass: [
      {
        category: "Projects",
        title: "Linux Setup & Git Portfolio",
        description: "Learn Linux command line, version control with Git, and create your personal portfolio website",
        icon: Code,
        color: "from-yellow-500 to-yellow-600"
      },
      {
        category: "Certifications",
        title: "PCEP - Python Institute",
        description: "Entry-level Python programming certification recognized globally",
        icon: Award,
        color: "from-blue-500 to-blue-600"
      },
      {
        category: "Internship",
        title: "Tech Company Internship Prep",
        description: "Resume building, interview preparation, and company application guidance",
        icon: Briefcase,
        color: "from-purple-500 to-purple-600"
      }
    ]
  },
  2: {
    inClass: [
      {
        title: "Data Structures & Algorithms",
        code: "CSE202",
        description: "Core concepts of data structures and algorithmic problem solving",
        ltp: "L:3 T:0 P:2",
        credits: 4
      },
      {
        title: "Database Management Systems",
        code: "INT306",
        description: "Relational databases, SQL, and database design principles",
        ltp: "L:2 T:0 P:2",
        credits: 3
      }
    ],
    outClass: [
      {
        category: "Projects",
        title: "Full-Stack Web Application",
        description: "Build a complete web application using React, Node.js, and MongoDB",
        icon: Globe,
        color: "from-yellow-500 to-yellow-600"
      },
      {
        category: "Revenue Generation",
        title: "Freelance Project Work",
        description: "Take on real client projects through platforms like Upwork and Fiverr",
        icon: DollarSign,
        color: "from-orange-500 to-orange-600"
      },
      {
        category: "Certifications",
        title: "AWS Cloud Practitioner",
        description: "Foundational cloud computing certification from Amazon Web Services",
        icon: Award,
        color: "from-blue-500 to-blue-600"
      }
    ]
  },
  3: {
    inClass: [
      {
        title: "Machine Learning",
        code: "CSE333",
        description: "Introduction to ML algorithms, neural networks, and practical applications",
        ltp: "L:2 T:0 P:2",
        credits: 3
      },
      {
        title: "Computer Networks",
        code: "CSE306",
        description: "Network protocols, architecture, and communication systems",
        ltp: "L:2 T:0 P:2",
        credits: 3
      }
    ],
    outClass: [
      {
        category: "Projects",
        title: "AI/ML Model Development",
        description: "Create and deploy machine learning models for real-world problems",
        icon: Network,
        color: "from-yellow-500 to-yellow-600"
      },
      {
        category: "Certifications",
        title: "Google Data Analytics Professional",
        description: "Professional certificate in data analytics and visualization",
        icon: Award,
        color: "from-blue-500 to-blue-600"
      },
      {
        category: "Internship",
        title: "Summer Internship",
        description: "3-month internship with partner companies in your domain",
        icon: Briefcase,
        color: "from-purple-500 to-purple-600"
      }
    ]
  },
  4: {
    inClass: [
      {
        title: "Cloud Computing Fundamentals",
        code: "INT335",
        description: "Cloud architecture, services, and deployment models",
        ltp: "L:2 T:0 P:2",
        credits: 3
      },
      {
        title: "Operating Systems",
        code: "CSE316",
        description: "OS concepts, process management, memory management, and file systems",
        ltp: "L:2 T:0 P:2",
        credits: 3
      }
    ],
    outClass: [
      {
        category: "Projects",
        title: "Cloud-Native Application",
        description: "Deploy scalable applications on AWS/Azure with CI/CD pipelines",
        icon: Laptop,
        color: "from-yellow-500 to-yellow-600"
      },
      {
        category: "Revenue Generation",
        title: "SaaS Product Development",
        description: "Build and monetize your own software-as-a-service product",
        icon: DollarSign,
        color: "from-orange-500 to-orange-600"
      },
      {
        category: "Certifications",
        title: "Microsoft Azure Fundamentals",
        description: "Entry-level certification for Azure cloud services",
        icon: Award,
        color: "from-blue-500 to-blue-600"
      }
    ]
  },
  5: {
    inClass: [
      {
        title: "Software Engineering",
        code: "CSE320",
        description: "Software development lifecycle, agile methodologies, and best practices",
        ltp: "L:2 T:0 P:2",
        credits: 3
      }
    ],
    outClass: [
      {
        category: "Projects",
        title: "Open Source Contribution",
        description: "Contribute to major open-source projects and build your GitHub profile",
        icon: Code,
        color: "from-yellow-500 to-yellow-600"
      },
      {
        category: "Internship",
        title: "Industry Internship",
        description: "Full-time internship opportunity with leading tech companies",
        icon: Briefcase,
        color: "from-purple-500 to-purple-600"
      }
    ]
  },
  6: {
    inClass: [
      {
        title: "DevOps Engineering",
        code: "INT364",
        description: "CI/CD, containerization, orchestration, and automation",
        ltp: "L:2 T:0 P:2",
        credits: 3
      }
    ],
    outClass: [
      {
        category: "Projects",
        title: "DevOps Pipeline Implementation",
        description: "Set up complete DevOps infrastructure with Docker, Kubernetes, Jenkins",
        icon: Network,
        color: "from-yellow-500 to-yellow-600"
      },
      {
        category: "Certifications",
        title: "Docker Certified Associate",
        description: "Professional certification for containerization expertise",
        icon: Award,
        color: "from-blue-500 to-blue-600"
      }
    ]
  },
  7: {
    inClass: [
      {
        title: "Capstone Project I",
        code: "CSE339",
        description: "First phase of major final year project",
        ltp: "L:0 T:0 P:4",
        credits: 2
      }
    ],
    outClass: [
      {
        category: "Projects",
        title: "Final Year Project",
        description: "Work on innovative solutions to real-world problems",
        icon: FileText,
        color: "from-yellow-500 to-yellow-600"
      },
      {
        category: "Revenue Generation",
        title: "Startup Development",
        description: "Develop your startup idea with mentorship and funding support",
        icon: DollarSign,
        color: "from-orange-500 to-orange-600"
      }
    ]
  },
  8: {
    inClass: [
      {
        title: "Capstone Project II",
        code: "CSE439",
        description: "Final phase and presentation of major project",
        ltp: "L:0 T:0 P:16",
        credits: 8
      }
    ],
    outClass: [
      {
        category: "Projects",
        title: "Project Publication",
        description: "Present and publish your research in conferences and journals",
        icon: FileText,
        color: "from-yellow-500 to-yellow-600"
      },
      {
        category: "Internship",
        title: "Pre-Placement Offers",
        description: "Full-time job offers and placement assistance",
        icon: Briefcase,
        color: "from-purple-500 to-purple-600"
      }
    ]
  }
};

const EduRevOverview = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    categories,
    selections,
    areAllCategoriesSelected,
    getUnselectedCategoryNames,
    hasJoinedEduRev,
    selectedEduRevPathway,
    selectedEduRevTier,
    setSelectedEduRevPathway,
    setSelectedEduRevTier,
  } = useStudent();
  const [selectedTerm, setSelectedTerm] = useState<number>(1);
  const [activeOutClassCategory, setActiveOutClassCategory] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const statePathway = (location.state as { pathway?: EduRevPathwayId } | null)?.pathway;
  const stateTier = (location.state as { tier?: EduRevTierId } | null)?.tier;

  const effectivePathway: EduRevPathwayId | null = statePathway || selectedEduRevPathway;
  const effectiveTier: EduRevTierId | null = stateTier || selectedEduRevTier;

  useEffect(() => {
    if (statePathway) setSelectedEduRevPathway(statePathway);
    if (stateTier) setSelectedEduRevTier(stateTier);
  }, [statePathway, stateTier, setSelectedEduRevPathway, setSelectedEduRevTier]);

  const category = categoryId ? categories.find((c) => c.id === categoryId) : null;
  const selectedCourses = category
    ? category.courses.filter((c) => selections[category.id]?.selectedCourseIds?.includes(c.id))
    : categories.flatMap((cat) =>
        cat.courses.filter((course) => selections[cat.id]?.selectedCourseIds?.includes(course.id))
      );

  if (categoryId && !category) {
    return (
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
  }

  const allCategoriesSelected = areAllCategoriesSelected();
  const remainingCategories = getUnselectedCategoryNames();
  const proceedTarget = "/edurev-categories";

  if (!allCategoriesSelected) {
    return (
      <div className="py-20 max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Complete all categories first</h1>
        <p className="text-muted-foreground mb-4">
          You can access the term initiatives only after selecting all course categories.
        </p>
        {remainingCategories.length > 0 && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-5">
            Remaining: {remainingCategories.slice(0, 5).join(", ")}
            {remainingCategories.length > 5 ? ` +${remainingCategories.length - 5} more` : ""}
          </p>
        )}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  // Group courses by term
  const coursesByTerm: Record<number, typeof selectedCourses> = {};
  for (const course of selectedCourses) {
    (coursesByTerm[course.term] ||= []).push(course);
  }
  const terms = Object.keys(coursesByTerm).map(Number).sort((a, b) => a - b);

  const selectedTermDetails = termDetails[selectedTerm] || { inClass: [], outClass: [] };

  const pathwayLabelMap: Record<EduRevPathwayId, string> = {
    placements: "Placements",
    entrepreneurship: "Entrepreneurship",
    revenue_generation: "Revenue Generation",
    higher_studies: "Higher Studies",
    govt_exams: "Government Exams",
  };

  const tierLabelMap: Record<EduRevTierId, string> = {
    tier_50: "₹50 LPA Track",
    tier_30: "₹30 LPA Track",
    tier_20: "₹20 LPA Track",
  };

  const tierFocusMap: Record<EduRevTierId, string> = {
    tier_50: "Focus level: elite outcomes, advanced depth, and high-impact execution",
    tier_30: "Focus level: strong role readiness, applied depth, and measurable consistency",
    tier_20: "Focus level: foundational outcomes, practical execution, and step-by-step growth",
  };

  const termMilestoneMap: Record<number, string> = {
    1: "Foundation setup and baseline execution",
    2: "Applied build phase with measurable outputs",
    3: "Intermediate depth with portfolio expansion",
    4: "Advanced implementation and performance improvement",
    5: "Industry-aligned delivery and consistency",
    6: "Scale, automation, and impact tracking",
    7: "Capstone integration with role readiness",
    8: "Final outcomes, showcase, and transition readiness",
  };

  const getOutClassByPathway = (
    baseItems: Array<{ category: string; title: string; description: string; icon: any; color: string }>,
    pathway: EduRevPathwayId | null,
    tier: EduRevTierId | null,
    term: number
  ) => {
    if (!pathway || pathway === "placements") return baseItems;

    const presets: Record<EduRevPathwayId, Array<{ category: string; icon: any; focus: string }>> = {
      placements: [
        { category: "Projects", icon: Code, focus: "Portfolio and project impact" },
        { category: "Certifications", icon: Award, focus: "Industry credential readiness" },
        { category: "Internship", icon: Briefcase, focus: "Interview and internship preparation" },
      ],
      entrepreneurship: [
        { category: "Projects", icon: Code, focus: "MVP building and iteration" },
        { category: "Revenue Generation", icon: DollarSign, focus: "Early customer acquisition" },
        { category: "Internship", icon: Briefcase, focus: "Founder ecosystem exposure" },
      ],
      revenue_generation: [
        { category: "Revenue Generation", icon: DollarSign, focus: "Freelance and consulting income" },
        { category: "Projects", icon: Code, focus: "Service portfolio depth" },
        { category: "Certifications", icon: Award, focus: "Trust and pricing premium" },
      ],
      higher_studies: [
        { category: "Higher Studies", icon: BookOpen, focus: "Research and application readiness" },
        { category: "Projects", icon: FileText, focus: "Publication-worthy project outputs" },
        { category: "Certifications", icon: Award, focus: "Profile strengthening credentials" },
      ],
      govt_exams: [
        { category: "Government Exams", icon: Target, focus: "Exam strategy and consistency" },
        { category: "Projects", icon: FileText, focus: "Role-relevant practical artifacts" },
        { category: "Certifications", icon: Award, focus: "Domain-proof credentials" },
      ],
    };

    const selectedPreset = presets[pathway];
    const termMilestone = termMilestoneMap[term] || "Term-specific execution milestones";

    if (baseItems.length === 0) {
      return selectedPreset.map((slot) => ({
        category: slot.category,
        title: `${slot.category} - Term ${term}`,
        description: `${tier ? `${tierFocusMap[tier]}. ` : ""}${slot.focus}. ${termMilestone}.`,
        icon: slot.icon,
        color: "from-slate-500 to-slate-600",
      }));
    }

    return selectedPreset.map((slot, index) => {
      const fallback = baseItems[index % baseItems.length];
      const tierFocus = tier ? `${tierFocusMap[tier]}. ` : "";
      return {
        category: slot.category,
        title: fallback?.title || `${slot.category} - Term ${term}`,
        description: `${tierFocus}${slot.focus}. ${fallback?.description || ""} ${termMilestone}.`.trim(),
        icon: slot.icon,
        color: fallback?.color || "from-slate-500 to-slate-600",
      };
    });
  };

  const pathwayOutClass = getOutClassByPathway(
    selectedTermDetails.outClass,
    effectivePathway,
    effectiveTier,
    selectedTerm
  );
  const groupedOutClassMap = pathwayOutClass.reduce((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {} as Record<string, typeof pathwayOutClass>);
  const groupedOutClassEntries = Object.entries(groupedOutClassMap);
  const activeOutClassItems = activeOutClassCategory ? groupedOutClassMap[activeOutClassCategory] || [] : [];
  const termYearLabel = `Year ${Math.ceil(selectedTerm / 2)} Sem ${selectedTerm % 2 === 1 ? 1 : 2}`;

  const curriculumRows = selectedCourses
    .slice()
    .sort((a, b) => a.term - b.term || a.name.localeCompare(b.name))
    .map((course) => {
      const categoryName = categories.find((c) => c.id === course.categoryId)?.name || "Unknown Category";
      return {
        category: categoryName,
        courseName: course.name,
        courseCode: course.courseCode,
        term: `Term ${course.term}`,
        yearSem: course.yearLabel,
        credits: course.credits,
      };
    });

  const handleDownloadPdf = () => {
    if (curriculumRows.length === 0) {
      toast.error("No curriculum data to export");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape" });
    const title = "Selected Curriculum";
    const generatedAt = `Generated: ${new Date().toLocaleString()}`;

    doc.setFontSize(16);
    doc.text(title, 14, 14);
    doc.setFontSize(10);
    doc.text(generatedAt, 14, 20);

    autoTable(doc, {
      startY: 26,
      head: [["Category", "Course", "Code", "Term", "Year/Sem", "Credits"]],
      body: curriculumRows.map((row) => [
        row.category,
        row.courseName,
        row.courseCode,
        row.term,
        row.yearSem,
        String(row.credits),
      ]),
      styles: { fontSize: 9, cellPadding: 2.5 },
      headStyles: { fillColor: [249, 115, 22] },
    });

    doc.save("selected-curriculum.pdf");
    toast.success("PDF downloaded");
  };

  const handleDownloadExcel = () => {
    if (curriculumRows.length === 0) {
      toast.error("No curriculum data to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(curriculumRows, {
      header: ["category", "courseName", "courseCode", "term", "yearSem", "credits"],
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Curriculum");
    XLSX.writeFile(workbook, "selected-curriculum.xlsx");
    toast.success("Excel downloaded");
  };

  const outClassTheme: Record<string, { card: string; iconWrap: string; icon: string; title: string }> = {
    "Revenue Generation": {
      card: "bg-orange-50 border-orange-200",
      iconWrap: "bg-orange-500",
      icon: "text-white",
      title: "text-orange-700",
    },
    Projects: {
      card: "bg-amber-50 border-amber-200",
      iconWrap: "bg-amber-500",
      icon: "text-white",
      title: "text-amber-700",
    },
    Certifications: {
      card: "bg-blue-50 border-blue-200",
      iconWrap: "bg-blue-500",
      icon: "text-white",
      title: "text-blue-700",
    },
    Internship: {
      card: "bg-purple-50 border-purple-200",
      iconWrap: "bg-purple-500",
      icon: "text-white",
      title: "text-purple-700",
    },
    "Higher Studies": {
      card: "bg-indigo-50 border-indigo-200",
      iconWrap: "bg-indigo-500",
      icon: "text-white",
      title: "text-indigo-700",
    },
    "Government Exams": {
      card: "bg-rose-50 border-rose-200",
      iconWrap: "bg-rose-500",
      icon: "text-white",
      title: "text-rose-700",
    },
  };

  return (
    <div className="py-8 max-w-6xl mx-auto animate-fade-in">
      <motion.div
        key="overview"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="mb-8 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.18em] text-primary/80 mb-3">Course Overview</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6">
            {hasJoinedEduRev ? (
              <>
                Master Concepts Inside
                <br />
                And Outside the Classroom
              </>
            ) : (
              <>Master Concepts Inside the Classroom</>
            )}
          </h1>

          <div className="rounded-xl bg-secondary/40 border border-border p-1 mb-7 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((term) => {
              const hasContent = terms.includes(term);
              return (
                <button
                  key={term}
                  onClick={() => setSelectedTerm(term)}
                  className={`h-10 rounded-lg text-sm font-semibold transition-all ${
                    selectedTerm === term
                      ? "bg-primary text-white shadow-sm"
                      : "text-foreground/80 hover:bg-secondary"
                  } ${!hasContent ? "opacity-60" : ""}`}
                >
                  Term {term}
                </button>
              );
            })}
          </div>

          <div className={`grid grid-cols-1 ${hasJoinedEduRev ? "lg:grid-cols-2" : ""} gap-6`}>
            <div className={`rounded-2xl border border-blue-200 bg-blue-50/40 p-5 ${hasJoinedEduRev ? "" : "max-w-3xl"}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-12 h-12 rounded-xl bg-blue-500 text-white inline-flex items-center justify-center shadow-sm">
                  <BookOpen className="w-6 h-6" />
                </span>
                <h2 className="text-4xl font-bold text-foreground leading-none">In Class</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Structured curriculum with comprehensive coverage of core concepts and technologies.
              </p>

              <div className="space-y-3">
                {selectedTermDetails.inClass.slice(0, 3).map((course) => (
                  <div key={course.code} className="rounded-xl border border-blue-100 bg-card p-4">
                    <p className="text-base font-bold text-foreground">{course.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      {course.code} • {termYearLabel} • {course.credits} Credits
                    </p>
                  </div>
                ))}
                {selectedTermDetails.inClass.length === 0 && (
                  <div className="rounded-xl border border-dashed border-blue-200 bg-card/70 p-4 text-sm text-muted-foreground">
                    No selected in-class courses yet.
                  </div>
                )}
              </div>

              {selectedTermDetails.inClass.length > 3 && (
                <p className="text-sm font-semibold text-muted-foreground text-center mt-4">
                  +{selectedTermDetails.inClass.length - 3} more courses
                </p>
              )}
            </div>

            {hasJoinedEduRev && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-12 h-12 rounded-xl bg-emerald-500 text-white inline-flex items-center justify-center shadow-sm">
                    <Lightbulb className="w-6 h-6" />
                  </span>
                  <h2 className="text-4xl font-bold text-foreground leading-none">Outside Class</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Experiential learning through real-world projects, certifications, and professional opportunities.
                </p>
                {effectivePathway && (
                  <div className="mb-4 space-y-1">
                    <p className="text-xs font-semibold text-primary">
                      Showing initiatives for: {pathwayLabelMap[effectivePathway]}
                    </p>
                    {effectiveTier && (
                      <p className="text-xs font-semibold text-primary/80">
                        Selected salary track: {tierLabelMap[effectiveTier]}
                      </p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {groupedOutClassEntries.map(([category, items]) => {
                    const preview = items[0];
                    const Icon = preview.icon;
                    const theme = outClassTheme[category] || {
                      card: "bg-slate-50 border-slate-200",
                      iconWrap: "bg-slate-500",
                      icon: "text-white",
                      title: "text-slate-700",
                    };

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setActiveOutClassCategory(category)}
                        className={`rounded-xl border p-4 text-left ${theme.card} hover:shadow-sm transition-shadow`}
                      >
                        <span className={`w-8 h-8 rounded-lg inline-flex items-center justify-center mb-3 ${theme.iconWrap}`}>
                          <Icon className={`w-4 h-4 ${theme.icon}`} />
                        </span>
                        <p className={`text-lg font-bold ${theme.title}`}>{category}</p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{preview.description}</p>
                        <p className="text-xs font-semibold text-primary mt-2">
                          View details ({items.length})
                        </p>
                      </button>
                    );
                  })}

                  {groupedOutClassEntries.length === 0 && (
                    <div className="col-span-full rounded-xl border border-dashed border-emerald-200 bg-card/70 p-4 text-sm text-muted-foreground">
                      No outside-class initiatives available for this term yet.
                    </div>
                  )}
                </div>

                <Dialog open={!!activeOutClassCategory} onOpenChange={(isOpen) => !isOpen && setActiveOutClassCategory(null)}>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{activeOutClassCategory} Initiatives</DialogTitle>
                    </DialogHeader>

                    <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1">
                      {activeOutClassItems.map((item, index) => (
                        <div key={`${item.title}-${index}`} className="rounded-lg border border-border bg-secondary/20 p-3">
                          <p className="text-sm font-semibold text-foreground">{item.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/60 px-5 py-4">
            <p className="text-2xl font-bold text-foreground">Ready to Choose Your Benefits?</p>
            <p className="text-base text-muted-foreground mt-1">
              You&apos;ll now select specific Edu Rev benefits for each of your courses. Choose options that align with your learning goals and career aspirations.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-center justify-center">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => navigate("/review")}
            className="w-full max-w-2xl h-14 px-8 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 text-white text-lg font-bold hover:shadow-lg hover:from-teal-700 hover:to-teal-800 transition-all"
          >
            View Your Selected Curriculum
          </motion.button>

          <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-border bg-card text-foreground text-sm font-semibold hover:bg-secondary/70 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Curriculum PDF
            </button>

            <button
              onClick={handleDownloadExcel}
              className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-border bg-card text-foreground text-sm font-semibold hover:bg-secondary/70 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Download Curriculum Excel
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default EduRevOverview;
