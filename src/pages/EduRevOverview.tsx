import { useEffect, useMemo, useState } from "react";
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useStudent } from "@/context/StudentContext";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { buildOutClassBenefitRows } from "@/data/outClassBenefits";
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
  Target,
  Eye,
  ChevronDown,
  ChevronUp,
  Terminal,
  Cpu,
  TestTube,
  Calculator,
  Database,
  Zap,
  Shield,
  BarChart2,
  PieChart as PieChartIcon
} from "lucide-react";
import type { EduRevPathwayId, EduRevTierId } from "@/context/StudentContext";

const PROFILE_STORAGE_KEY = "course-navigator-profile-inputs";
const MIN_OUT_CLASS_RATIO = 0.5;

const loadSavedProfileInputs = () => {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return { github: "", portfolio: "", cvFileName: "" };
    const parsed = JSON.parse(raw) as { github?: string; portfolio?: string; cvFileName?: string };
    return {
      github: typeof parsed.github === "string" ? parsed.github : "",
      portfolio: typeof parsed.portfolio === "string" ? parsed.portfolio : "",
      cvFileName: typeof parsed.cvFileName === "string" ? parsed.cvFileName : "",
    };
  } catch {
    return { github: "", portfolio: "", cvFileName: "" };
  }
};

const isValidUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const getCourseTheme = (courseCode: string) => {
  const code = courseCode.toUpperCase();
  if (code.startsWith("CSE") || code.startsWith("INT")) {
    return {
      card: "bg-blue-50/60 border-blue-200 hover:border-blue-300 hover:shadow-blue-100",
      iconWrap: "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/20 text-white",
      icon: Terminal,
      title: "text-blue-950",
      accent: "text-blue-600",
    };
  }
  if (code.startsWith("CHE") || code.startsWith("PHY")) {
    return {
      card: "bg-emerald-50/60 border-emerald-200 hover:border-emerald-300 hover:shadow-emerald-100",
      iconWrap: "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20 text-white",
      icon: TestTube,
      title: "text-emerald-950",
      accent: "text-emerald-700",
    };
  }
  if (code.startsWith("MTH") || code.startsWith("MAT")) {
    return {
      card: "bg-rose-50/60 border-rose-200 hover:border-rose-300 hover:shadow-rose-100",
      iconWrap: "bg-gradient-to-br from-rose-500 to-pink-600 shadow-md shadow-rose-500/20 text-white",
      icon: Calculator,
      title: "text-rose-950",
      accent: "text-rose-600",
    };
  }
  if (code.startsWith("ECE") || code.startsWith("EEE")) {
    return {
      card: "bg-amber-50/60 border-amber-200 hover:border-amber-300 hover:shadow-amber-100",
      iconWrap: "bg-gradient-to-br from-amber-500 to-orange-600 shadow-md shadow-amber-500/20 text-white",
      icon: Cpu,
      title: "text-amber-950",
      accent: "text-amber-700",
    };
  }
  
  const palettes = [
    {
      card: "bg-purple-50/60 border-purple-200 hover:border-purple-300 hover:shadow-purple-100",
      iconWrap: "bg-gradient-to-br from-purple-500 to-fuchsia-600 shadow-md shadow-purple-500/20 text-white",
      icon: Database,
      title: "text-purple-950",
      accent: "text-purple-600",
    },
    {
      card: "bg-cyan-50/60 border-cyan-200 hover:border-cyan-300 hover:shadow-cyan-100",
      iconWrap: "bg-gradient-to-br from-cyan-500 to-sky-600 shadow-md shadow-cyan-500/20 text-white",
      icon: Zap,
      title: "text-cyan-950",
      accent: "text-cyan-700",
    },
    {
      card: "bg-indigo-50/60 border-indigo-200 hover:border-indigo-300 hover:shadow-indigo-100",
      iconWrap: "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20 text-white",
      icon: Shield,
      title: "text-indigo-950",
      accent: "text-indigo-600",
    }
  ];
  const hash = Array.from(code).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return palettes[hash % palettes.length];
};

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

type OutClassCategoryType = "Projects" | "Certifications" | "Internship";

type FacultyInitiative = {
  id: string;
  title: string;
  description: string;
  expectedOutcome: string;
  credits?: number;
};

const facultyInitiativesByCourseCode: Record<string, Partial<Record<OutClassCategoryType, FacultyInitiative[]>>> = {
  CSE111: {
    Projects: [
      {
        id: "cse111-proj-1",
        title: "Linux Setup & Git Portfolio",
        description: "Set up Linux environment, create a GitHub repo strategy, and publish a personal portfolio page.",
        expectedOutcome: "Portfolio URL + Git workflow evidence",
      },
      {
        id: "cse111-proj-2",
        title: "Mini CLI Utility",
        description: "Build a Python command-line utility with argument handling and README documentation.",
        expectedOutcome: "Working CLI project with demo video",
      },
    ],
    Certifications: [
      {
        id: "cse111-cert-1",
        title: "PCEP - Python Institute",
        description: "Complete Python basics modules and attempt the PCEP practice assessments.",
        expectedOutcome: "Practice score report + completion proof",
      },
    ],
    Internship: [
      {
        id: "cse111-int-1",
        title: "Internship Readiness Sprint",
        description: "Prepare resume, LinkedIn, and 20 coding questions targeted for first internship applications.",
        expectedOutcome: "Ready profile + application tracker",
      },
    ],
  },
  CHE110: {
    Projects: [
      {
        id: "che110-proj-1",
        title: "Materials & Corrosion Case Study",
        description: "Create a mini engineering case study on corrosion prevention for real-world systems.",
        expectedOutcome: "Case report + presentation deck",
      },
    ],
    Certifications: [
      {
        id: "che110-cert-1",
        title: "Engineering Chemistry Micro-Credential",
        description: "Complete module on applied chemistry in manufacturing and lab safety workflows.",
        expectedOutcome: "Certificate + quiz report",
      },
    ],
  },
  INT306: {
    Projects: [
      {
        id: "int306-proj-1",
        title: "SQL Performance Dashboard",
        description: "Design schema, write optimized queries, and build a DB insights dashboard.",
        expectedOutcome: "SQL scripts + performance summary",
      },
    ],
    Internship: [
      {
        id: "int306-int-1",
        title: "Database Internship Task Pack",
        description: "Hands-on assignment pack with data cleaning, normalization, and reporting tasks.",
        expectedOutcome: "Task completion sheet + mentor review",
      },
    ],
  },
  INT335: {
    Projects: [
      {
        id: "int335-proj-1",
        title: "Cloud Deployment Project",
        description: "Deploy a containerized app on AWS/Azure with basic CI/CD automation.",
        expectedOutcome: "Live deployment + architecture document",
      },
    ],
    Certifications: [
      {
        id: "int335-cert-1",
        title: "Cloud Fundamentals Certification",
        description: "Faculty-curated prep track for beginner cloud certification milestones.",
        expectedOutcome: "Mock test score + completion badge",
      },
    ],
  },
};

// Demo data: items marked complete only after faculty verification.
const facultyVerifiedInitiatives: Record<string, string[]> = {
  "Projects::CSE111": ["cse111-proj-1"],
  "Certifications::INT335": ["int335-cert-1"],
};

const buildFallbackFacultyInitiatives = (
  courseCode: string,
  category: OutClassCategoryType,
  courseTitle?: string
): FacultyInitiative[] => {
  const displayName = courseTitle || `Course ${courseCode}`;

  if (category === "Projects") {
    return [
      {
        id: `${courseCode.toLowerCase()}-proj-demo-1`,
        title: `${courseCode} Applied Mini Project`,
        description: `Build an applied mini project aligned to ${displayName} outcomes with implementation notes and screenshots.`,
        expectedOutcome: "Project repository + short demo video",
        credits: 2,
      },
      {
        id: `${courseCode.toLowerCase()}-proj-demo-2`,
        title: `${courseCode} Portfolio Artifact`,
        description: `Create a portfolio-ready artifact demonstrating problem statement, approach, and measurable results for ${displayName}.`,
        expectedOutcome: "Portfolio entry + impact summary",
        credits: 2,
      },
    ];
  }

  if (category === "Certifications") {
    return [
      {
        id: `${courseCode.toLowerCase()}-cert-demo-1`,
        title: `${courseCode} Domain Certification Track`,
        description: `Faculty-curated certification prep modules mapped to ${displayName} fundamentals and assessment pattern.`,
        expectedOutcome: "Mock test scorecard + completion certificate",
        credits: 1,
      },
      {
        id: `${courseCode.toLowerCase()}-cert-demo-2`,
        title: `${courseCode} Skill Validation Quiz Pack`,
        description: `Complete supervised quiz pack and practical checkpoints to validate core skills from ${displayName}.`,
        expectedOutcome: "Validated skill report",
        credits: 1,
      },
    ];
  }

  return [
    {
      id: `${courseCode.toLowerCase()}-int-demo-1`,
      title: `${courseCode} Internship Task Simulation`,
      description: `Solve mentor-reviewed internship-style tasks based on ${displayName} and submit weekly progress logs.`,
      expectedOutcome: "Task sheet + mentor feedback",
      credits: 2,
    },
    {
      id: `${courseCode.toLowerCase()}-int-demo-2`,
      title: `${courseCode} Industry Readiness Sprint`,
      description: `Complete resume-proof work samples and interview-ready documentation linked to ${displayName}.`,
      expectedOutcome: "Readiness dossier + submission evidence",
      credits: 2,
    },
  ];
};

const EduRevOverview = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    categories,
    selections,
    selectedDemoProfileId,
    areAllCategoriesSelected,
    getUnselectedCategoryNames,
    hasJoinedEduRev,
    selectedEduRevPathway,
    selectedEduRevTier,
    setSelectedEduRevPathway,
    setSelectedEduRevTier,
    student,
  } = useStudent();

  // Eligibility logic (adjust as needed)
  const isEligible = (student?.cgpa ?? 0) >= 8 || (student?.marks ?? 0) >= 75;
  const showEduRevExperience = hasJoinedEduRev || isEligible;
  const [selectedTerm, setSelectedTerm] = useState<number>(1);
  const [activeOutClassCategory, setActiveOutClassCategory] = useState<string | null>(null);
  const [outClassCategoryCourseSelection, setOutClassCategoryCourseSelection] = useState<Record<string, string[]>>({});
  const [activeOutClassCourseCode, setActiveOutClassCourseCode] = useState<string | null>(null);
  const [selectedInitiatives, setSelectedInitiatives] = useState<Record<string, string[]>>({});
  const [submittedInitiatives, setSubmittedInitiatives] = useState<Record<string, string[]>>({});
  const [showInClassSection, setShowInClassSection] = useState(false);
  const [showOutClassSection, setShowOutClassSection] = useState(false);
  const [progressTrackerOpen, setProgressTrackerOpen] = useState(false);
  const [proofUploads, setProofUploads] = useState<Record<string, { fileName: string; uploadedAt: string }>>({});
  const [submitDisclaimerOpen, setSubmitDisclaimerOpen] = useState(false);
  const [pendingSubmitContext, setPendingSubmitContext] = useState<{ category: string } | null>(null);
  const [benefitsTableOpen, setBenefitsTableOpen] = useState(false);
  const [profileInputs, setProfileInputs] = useState(loadSavedProfileInputs);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showPieChart, setShowPieChart] = useState(false);
  const [demoFacultyVerifiedInitiatives, setDemoFacultyVerifiedInitiatives] = useState<Record<string, string[]>>({});

  const updateProfileInput = (key: "github" | "portfolio" | "cvFileName", value: string) => {
    const next = { ...profileInputs, [key]: value };
    setProfileInputs(next);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
  };

  const githubTrimmed = profileInputs.github.trim();
  const portfolioTrimmed = profileInputs.portfolio.trim();
  const hasCvFile = profileInputs.cvFileName.trim().length > 0;
  const hasGithub = githubTrimmed.length > 0;
  const hasPortfolio = portfolioTrimmed.length > 0;
  const githubValid = !hasGithub || isValidUrl(githubTrimmed);
  const portfolioValid = !hasPortfolio || isValidUrl(portfolioTrimmed);
  const hasAtLeastOneProfileInput = hasCvFile || hasGithub || hasPortfolio;

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
    tier_50: "Above ₹25 LPA Track",
    tier_30: "₹10-25 LPA Track",
    tier_20: "Up to ₹10 LPA Track",
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
  const activeTermSelectedCourses = coursesByTerm[selectedTerm] || [];
  const activeTermCourseCodes = activeTermSelectedCourses.map((course) => course.courseCode);
  const courseNameByCode = selectedCourses.reduce((acc, course) => {
    acc[course.courseCode] = course.name;
    return acc;
  }, {} as Record<string, string>);
  const termYearLabel = `Year ${Math.ceil(selectedTerm / 2)} Sem ${selectedTerm % 2 === 1 ? 1 : 2}`;
  const activeTermBenefitsRows = buildOutClassBenefitRows(activeTermSelectedCourses);

  // Modal state management simplified


  const getCourseCategoryKey = (category: string, courseCode: string) => `${category}::${courseCode}`;

  const previewOutClassCourseCode = (courseCode: string) => {
    setActiveOutClassCourseCode(courseCode);
  };

  const toggleOutClassCourseSelection = (category: string, courseCode: string) => {
    setOutClassCategoryCourseSelection((prev) => {
      const existing = prev[category] || [];
      const next = existing.includes(courseCode)
        ? existing.filter((code) => code !== courseCode)
        : [...existing, courseCode];
      return { ...prev, [category]: next };
    });
  };

  const activeFacultyCategory =
    activeOutClassCategory === "Projects" || activeOutClassCategory === "Certifications" || activeOutClassCategory === "Internship"
      ? (activeOutClassCategory as OutClassCategoryType)
      : null;

  const getCategoryTypeIfTrackable = (category: string): OutClassCategoryType | null => {
    if (category === "Projects" || category === "Certifications" || category === "Internship") {
      return category;
    }
    return null;
  };

  const getInitiativesForCourseAndCategory = (courseCode: string, category: OutClassCategoryType) => {
    return (
      facultyInitiativesByCourseCode[courseCode]?.[category] ||
      buildFallbackFacultyInitiatives(courseCode, category, courseNameByCode[courseCode])
    );
  };

  useEffect(() => {
    if (selectedDemoProfileId !== "showcase_demo") {
      if (Object.keys(demoFacultyVerifiedInitiatives).length > 0) {
        setDemoFacultyVerifiedInitiatives({});
      }
      return;
    }

    if (Object.keys(submittedInitiatives).length > 0 || activeTermSelectedCourses.length === 0) {
      return;
    }

    const categoryOrder: OutClassCategoryType[] = ["Projects", "Certifications", "Internship"];
    const nextSubmitted: Record<string, string[]> = {};
    const nextVerified: Record<string, string[]> = {};
    const nextProofs: Record<string, { fileName: string; uploadedAt: string }> = {};
    const now = new Date().toLocaleString();

    activeTermSelectedCourses.slice(0, 3).forEach((course, index) => {
      const category = categoryOrder[index % categoryOrder.length];
      const key = `${category}::${course.courseCode}`;
      const initiatives = getInitiativesForCourseAndCategory(course.courseCode, category);
      const picked = initiatives.slice(0, 2).map((item) => item.id);

      if (picked.length === 0) return;

      nextSubmitted[key] = picked;
      nextVerified[key] = picked.slice(0, 1);

      picked.forEach((initiativeId) => {
        nextProofs[`${key}::${initiativeId}`] = {
          fileName: `${course.courseCode}-${initiativeId}-proof.pdf`,
          uploadedAt: now,
        };
      });
    });

    if (Object.keys(nextSubmitted).length === 0) return;

    setSubmittedInitiatives(nextSubmitted);
    setDemoFacultyVerifiedInitiatives(nextVerified);
    setProofUploads(nextProofs);
  }, [
    activeTermSelectedCourses,
    demoFacultyVerifiedInitiatives,
    selectedDemoProfileId,
    submittedInitiatives,
  ]);

  const effectiveFacultyVerifiedInitiatives = useMemo(
    () => ({ ...facultyVerifiedInitiatives, ...demoFacultyVerifiedInitiatives }),
    [demoFacultyVerifiedInitiatives]
  );

  const getInitiativeCredits = (initiative: FacultyInitiative | undefined, category: OutClassCategoryType) => {
    if (!initiative) return category === "Projects" || category === "Internship" ? 2 : 1;
    if (typeof initiative.credits === "number") return initiative.credits;
    return category === "Projects" || category === "Internship" ? 2 : 1;
  };

  const activeFacultyInitiatives =
    activeFacultyCategory && activeOutClassCourseCode
      ? getInitiativesForCourseAndCategory(activeOutClassCourseCode, activeFacultyCategory)
      : [];

  const toggleInitiativeSelection = (category: string, courseCode: string, initiativeId: string) => {
    const key = getCourseCategoryKey(category, courseCode);
    setSelectedInitiatives((prev) => {
      const existing = prev[key] || [];
      const next = existing.includes(initiativeId)
        ? existing.filter((id) => id !== initiativeId)
        : [...existing, initiativeId];
      return { ...prev, [key]: next };
    });
  };

  const getSelectedInitiativeCountForCategory = (category: string) => {
    const selectedCodes = outClassCategoryCourseSelection[category] || [];
    const fallbackCodes = selectedCodes.length > 0 ? selectedCodes : activeOutClassCourseCode ? [activeOutClassCourseCode] : [];

    return fallbackCodes.reduce((sum, code) => {
      const key = getCourseCategoryKey(category, code);
      return sum + (selectedInitiatives[key] || []).length;
    }, 0);
  };

  const submitSelectedInitiativesForCategory = (category: string) => {
    const selectedCodes = outClassCategoryCourseSelection[category] || [];
    const targetCodes = selectedCodes.length > 0 ? selectedCodes : activeOutClassCourseCode ? [activeOutClassCourseCode] : [];

    if (targetCodes.length === 0) {
      toast.error("Select at least one course code before submitting");
      return;
    }

    const totalPicked = targetCodes.reduce((sum, code) => {
      const key = getCourseCategoryKey(category, code);
      return sum + (selectedInitiatives[key] || []).length;
    }, 0);

    if (totalPicked === 0) {
      toast.error("Select at least one initiative before submitting");
      return;
    }

    setSubmittedInitiatives((prev) => {
      const next = { ...prev };
      targetCodes.forEach((code) => {
        const key = getCourseCategoryKey(category, code);
        const picked = selectedInitiatives[key] || [];
        if (picked.length === 0) return;
        const existing = next[key] || [];
        next[key] = Array.from(new Set([...existing, ...picked]));
      });
      return next;
    });

    setSelectedInitiatives((prev) => {
      const next = { ...prev };
      targetCodes.forEach((code) => {
        const key = getCourseCategoryKey(category, code);
        next[key] = [];
      });
      return next;
    });

    toast.success(`Submitted ${totalPicked} initiative(s) across ${targetCodes.length} course code(s) for faculty verification`);
  };

  const openSubmitDisclaimer = (category: string) => {
    const totalPicked = getSelectedInitiativeCountForCategory(category);
    if (totalPicked === 0) {
      toast.error("Select at least one initiative before submitting");
      return;
    }
    setPendingSubmitContext({ category });
    setSubmitDisclaimerOpen(true);
  };

  const confirmSubmitWithDisclaimer = () => {
    if (!pendingSubmitContext) return;
    submitSelectedInitiativesForCategory(pendingSubmitContext.category);
    setSubmitDisclaimerOpen(false);
    setPendingSubmitContext(null);
  };

  const handleProofUpload = (
    category: string,
    courseCode: string,
    initiativeId: string,
    file: File | null
  ) => {
    if (!file) return;
    const key = `${getCourseCategoryKey(category, courseCode)}::${initiativeId}`;
    setProofUploads((prev) => ({
      ...prev,
      [key]: {
        fileName: file.name,
        uploadedAt: new Date().toLocaleString(),
      },
    }));
    toast.success("Proof uploaded successfully");
  };

  const selectedOutClassCodes = Array.from(new Set(Object.values(outClassCategoryCourseSelection).flat()));
  const termTotalCredits = activeTermSelectedCourses.reduce((sum, course) => sum + course.credits, 0);
  const activeTermCourseCodeSet = new Set(activeTermSelectedCourses.map((course) => course.courseCode));
  const courseCreditsByCode = activeTermSelectedCourses.reduce((acc, course) => {
    acc[course.courseCode] = course.credits;
    return acc;
  }, {} as Record<string, number>);
  const committedInitiativeRefs = new Set<string>();

  [selectedInitiatives, submittedInitiatives].forEach((source) => {
    Object.entries(source).forEach(([categoryCourseKey, initiativeIds]) => {
      const [category, courseCode] = categoryCourseKey.split("::");
      const categoryType = getCategoryTypeIfTrackable(category);
      if (!categoryType || !activeTermCourseCodeSet.has(courseCode)) return;

      initiativeIds.forEach((initiativeId) => {
        committedInitiativeRefs.add(`${categoryCourseKey}::${initiativeId}`);
      });
    });
  });

  const committedCreditsByCourse = Array.from(committedInitiativeRefs).reduce((acc, ref) => {
    const [category, courseCode, initiativeId] = ref.split("::");
    const categoryType = getCategoryTypeIfTrackable(category);
    if (!categoryType) return acc;

    const initiative = getInitiativesForCourseAndCategory(courseCode, categoryType).find((item) => item.id === initiativeId);
    const initiativeCredits = getInitiativeCredits(initiative, categoryType);
    acc[courseCode] = (acc[courseCode] || 0) + initiativeCredits;
    return acc;
  }, {} as Record<string, number>);

  const outClassCommittedCredits = Math.min(
    termTotalCredits,
    Object.entries(committedCreditsByCourse).reduce((sum, [courseCode, credits]) => {
      const maxForCourse = courseCreditsByCode[courseCode] || 0;
      return sum + Math.min(credits, maxForCourse);
    }, 0)
  );
  const inClassRequiredCredits = termTotalCredits - outClassCommittedCredits;

  const trackerRows = Object.entries(submittedInitiatives).flatMap(([categoryCourseKey, initiativeIds]) => {
    const [category, courseCode] = categoryCourseKey.split("::");
    const categoryType = getCategoryTypeIfTrackable(category);
    if (!categoryType || !activeTermCourseCodeSet.has(courseCode)) return [];

    const allInitiatives = getInitiativesForCourseAndCategory(courseCode, categoryType);
    return initiativeIds.map((initiativeId) => {
      const initiative = allInitiatives.find((item) => item.id === initiativeId);
      return {
        category,
        courseCode,
        initiativeId,
        initiativeTitle: initiative?.title || initiativeId,
        initiativeCredits: getInitiativeCredits(initiative, categoryType),
        verified: (effectiveFacultyVerifiedInitiatives[categoryCourseKey] || []).includes(initiativeId),
        proof: proofUploads[`${categoryCourseKey}::${initiativeId}`],
      };
    });
  });
  const verifiedCount = trackerRows.filter((row) => row.verified).length;
  const completedRows = trackerRows.filter((row) => row.verified);
  const pendingRows = trackerRows.filter((row) => !row.verified);
  const completedCredits = completedRows.reduce((sum, row) => sum + row.initiativeCredits, 0);
  const pendingCredits = pendingRows.reduce((sum, row) => sum + row.initiativeCredits, 0);

  const requiredMinOutClass = Math.ceil(termTotalCredits * MIN_OUT_CLASS_RATIO);

  const pendingButNotSubmitted = Math.max(0, outClassCommittedCredits - completedCredits - pendingCredits);
  const completedPct = termTotalCredits > 0 ? (completedCredits / termTotalCredits) * 100 : 0;
  const pendingPct = termTotalCredits > 0 ? (pendingCredits / termTotalCredits) * 100 : 0;
  const unsubmittedPct = termTotalCredits > 0 ? (pendingButNotSubmitted / termTotalCredits) * 100 : 0;
  const minRequiredPct = termTotalCredits > 0 ? (requiredMinOutClass / termTotalCredits) * 100 : 0;

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

  const handleDownloadProgressPdf = () => {
    const doc = new jsPDF({ orientation: "portrait" });
    const title = `Target vs Achievement - ${termYearLabel}`;
    const generatedAt = `Generated: ${new Date().toLocaleString()}`;

    doc.setFontSize(16);
    doc.text(title, 14, 14);
    doc.setFontSize(10);
    doc.text(generatedAt, 14, 20);

    autoTable(doc, {
      startY: 26,
      head: [["Metric", "Value"]],
      body: [
        ["Total Credits (Term)", String(termTotalCredits)],
        ["Out-Class Committed Credits", String(outClassCommittedCredits)],
        ["In-Class Required Credits", String(inClassRequiredCredits)],
        ["Completed Items", `${completedRows.length} (${completedCredits} credits)`],
        ["Needs to be done", `${pendingRows.length} (${pendingCredits} credits)`],
        ["Faculty Verified", `${verifiedCount}/${trackerRows.length}`],
      ],
      styles: { fontSize: 9, cellPadding: 2.5 },
      headStyles: { fillColor: [249, 115, 22] },
      theme: "grid",
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 8,
      head: [["Initiative", "Category", "Course Code", "Credits", "Status", "Proof"]],
      body: trackerRows.length
        ? trackerRows.map((row) => [
            row.initiativeTitle,
            row.category,
            row.courseCode,
            String(row.initiativeCredits),
            row.verified ? "Completed (Faculty Verified)" : "Submitted, pending faculty verification",
            row.proof?.fileName || "Not uploaded",
          ])
        : [["No submitted initiatives yet", "-", "-", "-", "-", "-"]],
      styles: { fontSize: 8.5, cellPadding: 2.2 },
      headStyles: { fillColor: [59, 130, 246] },
      theme: "grid",
    });

    doc.save(`progress-tracker-${selectedTerm}.pdf`);
    toast.success("Target vs Achievement PDF downloaded");
  };

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
            {showEduRevExperience ? (
              <>
                Master Concepts Inside
                <br />
                And Outside the Classroom
              </>
            ) : (
              <>Master Concepts Inside the Classroom</>
            )}
          </h1>

          {showEduRevExperience && (
            <div className="mb-4 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setProgressTrackerOpen(true)}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-primary/30 bg-primary/10 text-primary text-sm font-bold hover:bg-primary/15 transition-colors"
              >
                <Target className="w-5 h-5 stroke-[2.5]" />
                Target vs Achievement
              </button>
            </div>
          )}



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

          <div className={`grid grid-cols-1 ${showEduRevExperience ? "lg:grid-cols-2" : ""} gap-6`}>
            <div className={`rounded-2xl border border-blue-200 bg-blue-50/40 p-5 ${showEduRevExperience ? "" : "max-w-3xl"}`}>
              <button 
                type="button" 
                onClick={() => setShowInClassSection(!showInClassSection)}
                className="w-full flex items-start justify-between text-left group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-12 h-12 rounded-xl bg-blue-500 text-white inline-flex items-center justify-center shadow-sm">
                      <BookOpen className="w-6 h-6" />
                    </span>
                    <h2 className="text-4xl font-bold text-foreground leading-none">In Class</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Structured curriculum with comprehensive coverage of core concepts and technologies.
                  </p>
                </div>
                <div className="mt-2 shrink-0 w-8 h-8 rounded-full bg-blue-100/50 flex items-center justify-center text-blue-700 transition-colors group-hover:bg-blue-200">
                  {showInClassSection ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {showInClassSection && (
                <div className="mt-5 animate-fade-in">
                  <div className="mb-5 inline-flex flex-wrap items-center gap-2 rounded-lg border border-blue-200 bg-blue-100/30 px-3 py-2 text-sm">
                    <span className="font-semibold text-blue-700">In-Class Credits Requirement:</span>
                    <span className="inline-flex h-6 items-center justify-center rounded-md bg-blue-100 px-2 font-bold text-blue-800">
                      {inClassRequiredCredits} / {termTotalCredits} Total
                    </span>
                  </div>

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
              )}
            </div>

            {showEduRevExperience && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
                <button 
                  type="button" 
                  onClick={() => setShowOutClassSection(!showOutClassSection)}
                  className="w-full flex items-start justify-between text-left group"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-12 h-12 rounded-xl bg-emerald-500 text-white inline-flex items-center justify-center shadow-sm">
                        <Lightbulb className="w-6 h-6" />
                      </span>
                      <h2 className="text-4xl font-bold text-foreground leading-none">Outside Class</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Experiential learning through real-world projects, certifications, and professional opportunities.
                    </p>
                  </div>
                  <div className="mt-2 shrink-0 w-8 h-8 rounded-full bg-emerald-100/50 flex items-center justify-center text-emerald-700 transition-colors group-hover:bg-emerald-200">
                    {showOutClassSection ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {showOutClassSection && (
                  <div className="mt-5 animate-fade-in">
                    <div className="mb-5 inline-flex flex-wrap items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-100/30 px-3 py-2 text-sm">
                      <span className="font-semibold text-emerald-700">Out-Class Credits Committed:</span>
                      <span className="inline-flex h-6 items-center justify-center rounded-md bg-emerald-100 px-2 font-bold text-emerald-800">
                        {outClassCommittedCredits}
                      </span>
                    </div>
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

                    <div className="mb-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setBenefitsTableOpen(true)}
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-primary/30 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Benefits Table
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeTermSelectedCourses.map((course) => {
                        const theme = getCourseTheme(course.courseCode);
                        const Icon = theme.icon;
                        return (
                          <button
                            key={course.id}
                            type="button"
                            onClick={() => {
                              setActiveOutClassCourseCode(course.courseCode);
                              setActiveOutClassCategory(groupedOutClassEntries[0]?.[0] || null);
                            }}
                            className={`rounded-xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${theme.card}`}
                          >
                            <span className={`w-10 h-10 rounded-xl inline-flex items-center justify-center mb-4 ${theme.iconWrap}`}>
                              <Icon className="w-5 h-5" />
                            </span>
                            <p className={`text-lg font-bold ${theme.title}`}>{course.courseCode}</p>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2 min-h-10 leading-relaxed">{course.name}</p>
                            <div className="mt-3 flex items-center justify-between">
                              <p className={`text-xs font-semibold ${theme.accent}`}>
                                View initiatives
                              </p>
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center bg-white/50 text-current opacity-60`}>
                                →
                              </span>
                            </div>
                          </button>
                        );
                      })}

                      {activeTermSelectedCourses.length === 0 && (
                        <div className="col-span-full rounded-xl border border-dashed border-emerald-200 bg-card/70 p-4 text-sm text-muted-foreground">
                          No courses available for this term yet.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Dialog
                  open={!!activeOutClassCourseCode && !!activeOutClassCategory}
                  onOpenChange={(isOpen) => {
                    if (!isOpen) {
                      setActiveOutClassCourseCode(null);
                      setActiveOutClassCategory(null);
                    }
                  }}
                >
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Initiatives for {activeOutClassCourseCode}</DialogTitle>
                    </DialogHeader>

                    <div className="rounded-lg border border-border bg-secondary/20 p-3">
                      <p className="text-xs font-semibold text-foreground mb-2">
                        Select category for this course ({termYearLabel})
                      </p>

                      {activeOutClassCourseCode && groupedOutClassEntries.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {groupedOutClassEntries.map(([category]) => {
                            const isSelected = (outClassCategoryCourseSelection[category] || []).includes(activeOutClassCourseCode);
                            return (
                              <button
                                key={category}
                                type="button"
                                onClick={() => setActiveOutClassCategory(category)}
                                className={`h-8 px-3 rounded-full text-xs font-semibold border transition-colors ${
                                  activeOutClassCategory === category
                                    ? "border-primary bg-primary text-white"
                                    : isSelected
                                      ? "border-primary bg-primary/10 text-primary"
                                    : "border-border bg-card text-foreground hover:bg-secondary"
                                }`}
                              >
                                {category}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">No categories found for this term.</p>
                      )}

                      {activeOutClassCategory && activeOutClassCourseCode && (
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <p className="text-[11px] text-muted-foreground">
                            Clicked code is in preview mode. Use button to add/remove selection.
                          </p>
                          <button
                            type="button"
                            onClick={() => toggleOutClassCourseSelection(activeOutClassCategory, activeOutClassCourseCode)}
                            className={`h-8 px-3 rounded-md text-xs font-semibold border transition-colors ${
                              (outClassCategoryCourseSelection[activeOutClassCategory] || []).includes(activeOutClassCourseCode)
                                ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                                : "border-primary bg-primary text-white hover:bg-primary/90"
                            }`}
                          >
                            {(outClassCategoryCourseSelection[activeOutClassCategory] || []).includes(activeOutClassCourseCode)
                              ? `Remove ${activeOutClassCourseCode}`
                              : `Select ${activeOutClassCourseCode}`}
                          </button>
                        </div>
                      )}

                      {activeOutClassCategory && !!outClassCategoryCourseSelection[activeOutClassCategory]?.length && (
                        <p className="text-[11px] text-muted-foreground mt-2">
                          Selected: {outClassCategoryCourseSelection[activeOutClassCategory].join(", ")}
                        </p>
                      )}
                    </div>

                    {activeOutClassCategory && activeOutClassCourseCode && (
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                        <p className="text-xs font-semibold text-foreground">
                          Faculty uploaded {activeOutClassCategory} for <span className="text-primary">{activeOutClassCourseCode}</span>
                        </p>

                        {activeFacultyInitiatives.length > 0 ? (
                          <div className="mt-3 space-y-3">
                            {activeFacultyInitiatives.map((initiative) => {
                              const key = getCourseCategoryKey(activeOutClassCategory, activeOutClassCourseCode);
                              const isPicked = (selectedInitiatives[key] || []).includes(initiative.id);
                              const isSubmitted = (submittedInitiatives[key] || []).includes(initiative.id);
                              const isDone = (effectiveFacultyVerifiedInitiatives[key] || []).includes(initiative.id);

                              return (
                                <div key={initiative.id} className="rounded-lg border border-border bg-card p-3">
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <p className="text-sm font-semibold text-foreground">{initiative.title}</p>
                                      <p className="text-xs text-muted-foreground mt-1">{initiative.description}</p>
                                      <p className="text-[11px] text-foreground/80 mt-2">
                                        Expected Outcome: {initiative.expectedOutcome}
                                      </p>
                                      <p className="text-[11px] font-semibold text-primary mt-1">
                                        Out-Class Credits: {getInitiativeCredits(initiative, activeFacultyCategory)}
                                      </p>

                                      {isDone ? (
                                        <p className="text-[11px] font-semibold text-emerald-700 mt-2">
                                          Status: Completed (Faculty Verified)
                                        </p>
                                      ) : isSubmitted ? (
                                        <p className="text-[11px] font-semibold text-blue-700 mt-2">
                                          Status: Submitted, awaiting faculty verification
                                        </p>
                                      ) : null}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          toggleInitiativeSelection(activeOutClassCategory, activeOutClassCourseCode, initiative.id)
                                        }
                                        disabled={isSubmitted || isDone}
                                        className={`h-8 px-3 rounded-md text-xs font-semibold border transition-colors ${
                                          isDone
                                            ? "border-emerald-600 bg-emerald-600 text-white cursor-not-allowed"
                                            : isSubmitted
                                              ? "border-blue-600 bg-blue-600 text-white cursor-not-allowed"
                                            : isPicked
                                            ? "border-primary bg-primary text-white"
                                            : "border-border bg-card text-foreground hover:bg-secondary"
                                        }`}
                                      >
                                        {isDone ? "Completed" : isSubmitted ? "Submitted" : isPicked ? "Selected" : "Select"}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            {(() => {
                              const pickedCount = getSelectedInitiativeCountForCategory(activeOutClassCategory);
                              return (
                                <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 p-3">
                                  <p className="text-xs text-muted-foreground">
                                    {pickedCount > 0
                                      ? `${pickedCount} initiative(s) ready to submit`
                                      : "Select initiatives and submit for faculty verification"}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => openSubmitDisclaimer(activeOutClassCategory)}
                                    disabled={pickedCount === 0}
                                    className="h-8 px-3 rounded-md text-xs font-semibold border border-primary bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Submit Selection
                                  </button>
                                </div>
                              );
                            })()}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground mt-2">
                            No faculty-uploaded {activeOutClassCategory.toLowerCase()} found for {activeOutClassCourseCode} yet.
                          </p>
                        )}
                      </div>
                    )}

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

                <Dialog open={benefitsTableOpen} onOpenChange={setBenefitsTableOpen}>
                  <DialogContent className="sm:max-w-6xl">
                    <DialogHeader>
                      <DialogTitle>Out Class Benefits by Course Code ({termYearLabel})</DialogTitle>
                    </DialogHeader>

                    {activeTermBenefitsRows.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-[980px] w-full border-collapse text-xs">
                          <thead>
                            <tr className="bg-emerald-100/70 text-foreground">
                              <th className="border border-emerald-200 px-2 py-1.5 text-left">Course</th>
                              <th className="border border-emerald-200 px-2 py-1.5 text-left">Project Title</th>
                              <th className="border border-emerald-200 px-2 py-1.5 text-left">Certification</th>
                              <th className="border border-emerald-200 px-2 py-1.5 text-left">Technical Competition / Hackathon</th>
                              <th className="border border-emerald-200 px-2 py-1.5 text-left">Internship (Stipend)</th>
                              <th className="border border-emerald-200 px-2 py-1.5 text-left">Revenue Opportunity</th>
                              <th className="border border-emerald-200 px-2 py-1.5 text-left">Academic Equivalence</th>
                              <th className="border border-emerald-200 px-2 py-1.5 text-left">Portfolio</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeTermBenefitsRows.map((row) => (
                              <tr key={`benefits-dialog-${row.courseCode}`} className="odd:bg-card even:bg-secondary/20 align-top">
                                <td className="border border-emerald-100 px-2 py-1.5">
                                  <p className="font-semibold text-foreground">{row.courseCode}</p>
                                  <p className="text-[11px] text-muted-foreground">{row.courseName}</p>
                                </td>
                                <td className="border border-emerald-100 px-2 py-1.5">{row.projectTitle}</td>
                                <td className="border border-emerald-100 px-2 py-1.5">{row.certification}</td>
                                <td className="border border-emerald-100 px-2 py-1.5">{row.technicalCompetition}</td>
                                <td className="border border-emerald-100 px-2 py-1.5">{row.internship}</td>
                                <td className="border border-emerald-100 px-2 py-1.5">{row.revenueOpportunity}</td>
                                <td className="border border-emerald-100 px-2 py-1.5">{row.academicEquivalence}</td>
                                <td className="border border-emerald-100 px-2 py-1.5">{row.portfolio}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No selected course codes found for this term.</p>
                    )}
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={submitDisclaimerOpen}
                  onOpenChange={(isOpen) => {
                    setSubmitDisclaimerOpen(isOpen);
                    if (!isOpen) setPendingSubmitContext(null);
                  }}
                >
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Submission Disclaimer</DialogTitle>
                    </DialogHeader>

                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
                      <p className="text-sm font-semibold text-foreground">Please confirm before submission</p>
                      <p className="text-xs text-muted-foreground">
                        After submission, your selected initiatives will be sent to faculty for verification.
                        Completion status will be updated only after faculty review and approval.
                      </p>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitDisclaimerOpen(false);
                          setPendingSubmitContext(null);
                        }}
                        className="h-9 px-3 rounded-md border border-border bg-card text-sm font-semibold text-foreground hover:bg-secondary/60 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={confirmSubmitWithDisclaimer}
                        className="h-9 px-3 rounded-md border border-primary bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                      >
                        I Understand, Submit
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={progressTrackerOpen} onOpenChange={setProgressTrackerOpen}>
                  <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <div className="flex items-center justify-between gap-3">
                        <DialogTitle>Target vs Achievement — {termYearLabel}</DialogTitle>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowProfileForm(!showProfileForm)}
                            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-primary/30 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                          >
                            <Lightbulb className="w-3.5 h-3.5" />
                            Update your profile
                          </button>
                          <button
                            type="button"
                            onClick={handleDownloadProgressPdf}
                            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-card text-foreground text-xs font-semibold hover:bg-secondary/60 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download PDF
                          </button>
                        </div>
                      </div>
                    </DialogHeader>

                    {showProfileForm && (
                      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mt-2">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-sm font-bold text-foreground">Profile & Portfolio Details</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Maintain active links for track eligibility and faculty verification.</p>
                          </div>
                          {!hasAtLeastOneProfileInput && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">Action Needed</span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-foreground">GitHub Link</label>
                            <input
                              type="url"
                              value={profileInputs.github}
                              onChange={(e) => updateProfileInput("github", e.target.value)}
                              className="mt-1 w-full h-9 rounded border border-border bg-background px-3 text-xs outline-none focus:ring-1 focus:ring-primary"
                              placeholder="https://github.com/..."
                            />
                            {hasGithub && !githubValid && <p className="text-[10px] text-rose-600 mt-1">Invalid URL</p>}
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-foreground">Portfolio Link</label>
                            <input
                              type="url"
                              value={profileInputs.portfolio}
                              onChange={(e) => updateProfileInput("portfolio", e.target.value)}
                              className="mt-1 w-full h-9 rounded border border-border bg-background px-3 text-xs outline-none focus:ring-1 focus:ring-primary"
                              placeholder="https://..."
                            />
                            {hasPortfolio && !portfolioValid && <p className="text-[10px] text-rose-600 mt-1">Invalid URL</p>}
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-xs font-semibold text-foreground">Upload CV (PDF/DOC)</label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                updateProfileInput("cvFileName", file?.name || "");
                              }}
                              className="mt-1 block w-full text-xs text-muted-foreground file:mr-3 file:h-8 file:px-3 file:rounded file:border file:border-border file:bg-background file:text-foreground hover:file:bg-secondary"
                            />
                            {hasCvFile && (
                              <p className="text-[11px] text-emerald-700 mt-1">Uploaded: {profileInputs.cvFileName}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="rounded-lg border border-border bg-secondary/20 p-2 mt-2">
                      <p className="text-[11px] font-semibold text-muted-foreground px-2 py-1">Term-wise tracker view</p>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((term) => {
                          const hasContent = terms.includes(term);
                          return (
                            <button
                              key={`tracker-term-${term}`}
                              type="button"
                              onClick={() => setSelectedTerm(term)}
                              className={`h-8 rounded-md text-xs font-semibold transition-all ${
                                selectedTerm === term
                                  ? "bg-primary text-white"
                                  : "bg-card text-foreground/80 hover:bg-secondary"
                              } ${!hasContent ? "opacity-60" : ""}`}
                            >
                              Term {term}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-secondary/20 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="rounded-lg border border-border bg-card p-3">
                          <p className="text-xs text-muted-foreground">Total Credits (Term)</p>
                          <p className="text-xl font-bold text-foreground">{termTotalCredits}</p>
                        </div>
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                          <p className="text-xs text-emerald-700">Out-Class Committed Credits</p>
                          <p className="text-xl font-bold text-emerald-700">{outClassCommittedCredits}</p>
                        </div>
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                          <p className="text-xs text-blue-700">In-Class Required Credits</p>
                          <p className="text-xl font-bold text-blue-700">{inClassRequiredCredits}</p>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <p className="text-sm font-semibold text-emerald-800">Completed</p>
                            <p className="text-xs font-semibold text-emerald-700">
                              {completedRows.length} items • {completedCredits} credits
                            </p>
                          </div>

                          {completedRows.length > 0 ? (
                            <ul className="space-y-1.5">
                              {completedRows.map((row) => (
                                <li key={`completed-${row.category}-${row.courseCode}-${row.initiativeId}`} className="text-xs text-emerald-800">
                                  • {row.initiativeTitle} ({row.courseCode})
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-emerald-700/80">No faculty-verified completed items yet.</p>
                          )}
                        </div>

                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <p className="text-sm font-semibold text-amber-800">Needs to be done</p>
                            <p className="text-xs font-semibold text-amber-700">
                              {pendingRows.length} items • {pendingCredits} credits
                            </p>
                          </div>

                          {pendingRows.length > 0 ? (
                            <ul className="space-y-1.5">
                              {pendingRows.map((row) => (
                                <li key={`pending-${row.category}-${row.courseCode}-${row.initiativeId}`} className="text-xs text-amber-800">
                                  • {row.initiativeTitle} ({row.courseCode})
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-amber-700/80">All submitted initiatives are verified.</p>
                          )}
                        </div>
                      </div>

                    </div>

                    <div className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-foreground">Submitted Initiatives</p>
                        <p className="text-xs font-semibold text-primary">
                          Faculty Verified: {verifiedCount}/{trackerRows.length}
                        </p>
                      </div>

                      {trackerRows.length > 0 ? (
                        <div className="max-h-[46vh] overflow-y-auto space-y-3 pr-1">
                          {trackerRows.map((row) => (
                            <div key={`${row.category}-${row.courseCode}-${row.initiativeId}`} className="rounded-lg border border-border bg-secondary/20 p-3">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold text-foreground">{row.initiativeTitle}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {row.category} • {row.courseCode}
                                  </p>
                                  <p className="text-[11px] text-primary mt-1 font-semibold">
                                    Credits: {row.initiativeCredits}
                                  </p>
                                  <p className={`text-[11px] font-semibold mt-2 ${row.verified ? "text-emerald-700" : "text-blue-700"}`}>
                                    {row.verified
                                      ? "Completed (Faculty Verified)"
                                      : "Submitted, pending faculty verification"}
                                  </p>
                                  {row.proof && (
                                    <p className="text-[11px] text-muted-foreground mt-1">
                                      Proof: {row.proof.fileName} ({row.proof.uploadedAt})
                                    </p>
                                  )}
                                </div>

                                <div className="shrink-0">
                                  <label className="inline-flex items-center justify-center h-8 px-3 rounded-md border border-primary/30 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 cursor-pointer">
                                    Upload Proof
                                    <input
                                      type="file"
                                      className="hidden"
                                      onChange={(event) =>
                                        handleProofUpload(
                                          row.category,
                                          row.courseCode,
                                          row.initiativeId,
                                          event.target.files?.[0] || null
                                        )
                                      }
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No submitted initiatives yet. Select and submit initiatives first.
                        </p>
                      )}
                    </div>

                    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/50 p-4">
                      <div className="flex items-start gap-2.5">
                        <Target className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-amber-900">
                            Track Requirement: {effectiveTier ? tierLabelMap[effectiveTier] : "EduRev Track"}
                          </p>
                          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                            For Term {selectedTerm}, you need to complete all <strong className="text-amber-900 bg-amber-200/50 px-1 rounded">{termTotalCredits} credits</strong> out of which minimum <strong className="text-amber-900 bg-amber-200/50 px-1 rounded">{requiredMinOutClass} credits</strong> must be earned outside the classroom activity to maintain your standing in the {effectiveTier ? tierLabelMap[effectiveTier] : "selected track"}.
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-amber-200/50">
                        <div className="flex items-center justify-between text-xs mb-8 font-semibold">
                          <span className="text-amber-900">Out-Class Progress vs Target</span>
                          <span className="text-amber-700">{completedCredits} / {requiredMinOutClass} Verified Credits</span>
                        </div>
                        
                        <div className="relative h-3 w-full bg-slate-200/80 rounded-full flex mb-4 shadow-inner">
                          <div className="h-full bg-emerald-500 rounded-l-full transition-all" style={{ width: `${completedPct}%` }} title={`Completed: ${completedCredits}`} />
                          <div className="h-full bg-blue-400 transition-all" style={{ width: `${pendingPct}%` }} title={`Pending Verification: ${pendingCredits}`} />
                          <div className="h-full bg-amber-400/90 transition-all" style={{ width: `${unsubmittedPct}%` }} title={`Draft / Unsubmitted: ${pendingButNotSubmitted}`} />
                          
                          {minRequiredPct > 0 && (
                            <div 
                              className="absolute top-0 bottom-0 w-[3px] bg-rose-600 z-10 shadow-[0_0_4px_rgba(225,29,72,0.8)]" 
                              style={{ left: `${minRequiredPct}%` }} 
                              title={`Minimum Required: ${requiredMinOutClass}`}
                            >
                              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-rose-600 whitespace-nowrap">
                                Target ({requiredMinOutClass})
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-amber-800 font-medium">
                          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shadow-sm"></div>Completed ({completedCredits})</div>
                          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-blue-400 shadow-sm"></div>Pending Review ({pendingCredits})</div>
                          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-amber-400/90 shadow-sm"></div>Draft/Selected ({pendingButNotSubmitted})</div>
                          <div className="flex items-center gap-1.5"><div className="w-[3px] h-3 bg-rose-600 rounded-[1px] shadow-sm"></div>Track Minimum ({requiredMinOutClass})</div>
                        </div>
                      </div>
                    </div>

                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          {showEduRevExperience && (
            <>
              <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Target className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Track Requirements Overview</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                    For Term {selectedTerm}, you need to complete all <span className="font-semibold text-foreground">{termTotalCredits} credits</span> out of which minimum <span className="font-semibold text-foreground bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">{requiredMinOutClass} credits</span> must be earned outside the classroom activity to maintain your standing in the {effectiveTier ? tierLabelMap[effectiveTier] : "selected track"}.
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Outside class credit earned percentage</h3>
                      <p className="text-xs text-amber-600 mt-2 font-medium bg-amber-50 px-3 py-2 rounded-md inline-block border border-amber-200">
                        Note: Only up to 70% of total credits can be earned from outside class activities.
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-secondary/30 border border-border rounded-lg p-1 shrink-0 self-start md:self-end">
                      <button 
                        onClick={() => setShowPieChart(false)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${!showPieChart ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        <BarChart2 className="w-4 h-4" /> Bars
                      </button>
                      <button 
                        onClick={() => setShowPieChart(true)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${showPieChart ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        <PieChartIcon className="w-4 h-4" /> Pie
                      </button>
                    </div>
                  </div>

                  {!showPieChart ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
                      {/* In-Class Credits Status */}
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
                          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">In-Class Credits</span>
                          <span className="text-sm font-bold text-foreground">
                            {inClassRequiredCredits} / {inClassRequiredCredits}
                          </span>
                        </div>
                        <div className="h-3 w-full bg-secondary rounded-full overflow-hidden shadow-inner mb-2 bg-blue-100">
                          <div className="h-full bg-blue-500 rounded-full w-full" />
                        </div>
                        <p className="text-[11px] text-muted-foreground italic">Mandatory core curriculum requirement</p>
                      </div>

                      {/* Out-Class Credits Status */}
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
                          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Out-Class Credits</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${completedCredits >= requiredMinOutClass ? 'bg-emerald-100 text-emerald-700' : 'bg-primary/10 text-primary'}`}>
                              {completedCredits >= requiredMinOutClass ? 'On Track' : 'In Progress'}
                            </span>
                            <span className="text-sm font-bold text-foreground">
                              {completedCredits} / {requiredMinOutClass} minimum credits
                            </span>
                          </div>
                        </div>
                        <div className="h-3 w-full bg-secondary rounded-full overflow-hidden shadow-inner mb-2">
                          <div 
                            className={`h-full rounded-full transition-all ${completedCredits >= requiredMinOutClass ? 'bg-emerald-500' : 'bg-primary'}`}
                            style={{ width: `${Math.min(100, (completedCredits / requiredMinOutClass) * 100 || 0)}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[11px] mt-1">
                          <span className="text-muted-foreground">Minimum credits are {Math.round(minRequiredPct)}% of total term credits</span>
                          <span className="font-bold text-foreground">{Math.min(100, Math.round((completedCredits / requiredMinOutClass) * 100) || 0)}%</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[250px] w-full mt-2 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={[
                              { name: 'In-Class Required', value: inClassRequiredCredits, color: '#3b82f6' },
                              { name: 'Out-Class Earned', value: completedCredits, color: '#10b981' },
                              { name: 'Out-Class Remaining Target', value: Math.max(0, requiredMinOutClass - completedCredits), color: '#cbd5e1' }
                            ].filter(item => item.value > 0)}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={95}
                            paddingAngle={3}
                          >
                            {
                              [
                                { name: 'In-Class Required', value: inClassRequiredCredits, color: '#3b82f6' },
                                { name: 'Out-Class Earned', value: completedCredits, color: '#10b981' },
                                { name: 'Out-Class Remaining Target', value: Math.max(0, requiredMinOutClass - completedCredits), color: '#cbd5e1' }
                              ].filter(item => item.value > 0).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                              ))
                            }
                          </Pie>
                          <RechartsTooltip 
                            formatter={(value: number) => [`${value} Credits`, '']}
                            contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '13px' }}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                      
                      <div className="absolute top-0 right-0 md:top-auto md:bottom-0 md:left-0 flex flex-col gap-2 p-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-xs text-muted-foreground font-medium">In-Class Required</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                          <span className="text-xs text-muted-foreground font-medium">Out-Class Earned</span>
                        </div>
                        {Math.max(0, requiredMinOutClass - completedCredits) > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                            <span className="text-xs text-muted-foreground font-medium">Out-Class Target</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

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
