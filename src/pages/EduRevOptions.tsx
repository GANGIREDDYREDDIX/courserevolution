import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useStudent } from "@/context/StudentContext";
import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import EduRevOptionCard from "@/components/edurev/EduRevOptionCard";
import AchievementForm from "@/components/edurev/AchievementForm";
import UndertakingModal from "@/components/edurev/UndertakingModal";
import ConsentModal from "@/components/preview/ConsentModal";
import { EDU_REV_OPTIONS, COMPLETED_TERM_ALLOWED_OPTIONS, type EduRevOptionType, type Achievement } from "@/data/eduRevTypes";
import { ChevronLeft, ChevronRight, BookOpen, Info } from "lucide-react";
import { toast } from "sonner";

type InitiativeItem = {
  id: string;
  title: string;
  description: string;
  provider: string;
};

const OPTION_BENEFITS: Record<EduRevOptionType, string[]> = {
  revenue_generation: [
    "Eligible for income-linked academic consideration as per policy",
    "Mentorship for freelancing/startup execution",
    "Portfolio validation for client-facing work",
  ],
  projects: [
    "Hands-on project credits/benefit mapping for the course",
    "Faculty-reviewed project milestones",
    "Improved practical readiness and interview portfolio",
  ],
  social_media: [
    "Academic visibility for your technical work",
    "Personal branding guidance for professional platforms",
    "Evidence-based recognition for quality contributions",
  ],
  rpl: [
    "Recognition for prior verified knowledge",
    "Possible exemption path based on evaluation",
    "Faster progression through validated competencies",
  ],
  nptel_moocs: [
    "MOOC/NPTEL completion considered for academic benefit",
    "Mapped learning outcomes to course objectives",
    "Certification-backed skill evidence",
  ],
  grade_upgrade: [
    "Opportunity to improve prior course grade",
    "Structured evaluation via approved tasks",
    "Transparent rubric-based reassessment",
  ],
  internship: [
    "Industry experience recognition beyond curriculum",
    "Experience-to-academics mapping support",
    "Career readiness with practical outcomes",
  ],
  cocurricular: [
    "Recognition for workshops/hackathons/competitions",
    "Skill-building activity mapped to academics",
    "Documented extracurricular impact",
  ],
  community_service: [
    "Credit/benefit linkage for approved service work",
    "Recognition of social impact contributions",
    "Leadership and teamwork evidence in profile",
  ],
};

const OPTION_ACADEMIC_POLICY: Record<EduRevOptionType, { ca: string; midTerm: string; endTerm: string; benefit: string }> = {
  revenue_generation: {
    ca: "Minimum 70% task completion in continuous assessments (CA)",
    midTerm: "Minimum 60% in mid-term aligned evaluation",
    endTerm: "Minimum 60% in end-term outcome verification",
    benefit: "Eligible for academic benefit mapping and partial assessment relaxation as per policy.",
  },
  projects: {
    ca: "Complete project milestones with 75%+ rubric score in CA",
    midTerm: "Pass mid-term project review and viva",
    endTerm: "Demonstrate final implementation with outcome evidence",
    benefit: "Eligible for project-based academic credit and improved evaluation support.",
  },
  social_media: {
    ca: "Submit consistent academic-content activity logs",
    midTerm: "Mid-term quality review of technical contributions",
    endTerm: "End-term impact report with verifiable evidence",
    benefit: "Eligible for recognition-linked academic support where policy permits.",
  },
  rpl: {
    ca: "Clear prior-learning validation in CA cycle",
    midTerm: "Pass competency check in mid-term benchmark",
    endTerm: "Meet end-term standard competency threshold",
    benefit: "Eligible for RPL-based exemption/benefit under approved rules.",
  },
  nptel_moocs: {
    ca: "Submit MOOC/NPTEL progress with verification",
    midTerm: "Mid-term performance aligned to course outcomes",
    endTerm: "Final certificate + score validation in end-term window",
    benefit: "Eligible for certification-based academic benefit mapping.",
  },
  grade_upgrade: {
    ca: "Complete remedial/assigned CA tasks",
    midTerm: "Score improvement in mid-term reassessment",
    endTerm: "Achieve target grade threshold in end-term",
    benefit: "Eligible for grade upgradation under departmental policy.",
  },
  internship: {
    ca: "Submit approved internship tasks as CA evidence",
    midTerm: "Mid-term mentor/faculty review clearance",
    endTerm: "Final internship outcome report and validation",
    benefit: "Eligible for internship-linked academic consideration.",
  },
  cocurricular: {
    ca: "Participation + milestone proof in approved activities",
    midTerm: "Mid-term competency review by faculty",
    endTerm: "End-term performance and reflection validation",
    benefit: "Eligible for co-curricular academic recognition.",
  },
  community_service: {
    ca: "Service log and participation proof in CA",
    midTerm: "Mid-term impact check with documentation",
    endTerm: "Final social impact evidence submission",
    benefit: "Eligible for community-service linked academic benefit where applicable.",
  },
};

const COURSE_INITIATIVE_CATALOG: Partial<Record<string, Partial<Record<EduRevOptionType, InitiativeItem[]>>>> = {
  CSE326: {
    projects: [
      {
        id: "cse326-proj-1",
        title: "Python Automation Toolkit",
        description: "Build reusable scripts for file processing, reporting, and task automation.",
        provider: "Department Lab",
      },
      {
        id: "cse326-proj-2",
        title: "Data Analysis Mini Suite",
        description: "Analyze structured datasets and publish result dashboards.",
        provider: "Course Mentor",
      },
    ],
  },
  CSE408: {
    projects: [
      {
        id: "cse408-proj-1",
        title: "Cloud Deployment Pipeline",
        description: "Create CI/CD flow and deploy application to cloud infrastructure.",
        provider: "Cloud Center",
      },
      {
        id: "cse408-proj-2",
        title: "Monitoring & Alerting Stack",
        description: "Implement observability with logs, metrics, and alert policies.",
        provider: "DevOps Lab",
      },
      {
        id: "cse408-proj-3",
        title: "Container Security Hardening",
        description: "Apply security scanning and remediation workflow for container images.",
        provider: "Security Practice Group",
      },
      {
        id: "cse408-proj-4",
        title: "Infra as Code Blueprint",
        description: "Model complete environment setup using Terraform modules.",
        provider: "Cloud Center",
      },
    ],
    nptel_moocs: [
      {
        id: "cse408-cert-1",
        title: "AWS Cloud Practitioner",
        description: "Foundational cloud certification aligned to deployment concepts.",
        provider: "AWS",
      },
      {
        id: "cse408-cert-2",
        title: "Azure Fundamentals AZ-900",
        description: "Cloud fundamentals and service-model understanding.",
        provider: "Microsoft",
      },
    ],
    internship: [
      {
        id: "cse408-int-1",
        title: "Cloud Ops Internship",
        description: "Support deployment operations and incident workflows.",
        provider: "Partner Startup",
      },
      {
        id: "cse408-int-2",
        title: "DevOps Internship",
        description: "Own CI/CD setup and release automation pipeline.",
        provider: "Industry Partner",
      },
    ],
  },
};

const DEFAULT_OPTION_INITIATIVES: Record<EduRevOptionType, InitiativeItem[]> = {
  projects: [
    { id: "proj-default-1", title: "Mini Capstone", description: "Build a practical mini-solution for the course domain.", provider: "Department" },
    { id: "proj-default-2", title: "Team Application Project", description: "Collaborative implementation with documented milestones.", provider: "Department" },
  ],
  internship: [
    { id: "int-default-1", title: "Domain Internship", description: "Short-term industry internship aligned with course outcomes.", provider: "Industry" },
    { id: "int-default-2", title: "Virtual Internship", description: "Mentored remote internship with deliverable checkpoints.", provider: "Industry" },
  ],
  nptel_moocs: [
    { id: "cert-default-1", title: "NPTEL Course Track", description: "MOOC certification mapped to course objectives.", provider: "NPTEL" },
    { id: "cert-default-2", title: "Industry Certificate", description: "External certification pathway with score validation.", provider: "External Provider" },
  ],
  revenue_generation: [
    { id: "rev-default-1", title: "Freelance Sprint", description: "Complete paid micro-engagements with delivery proof.", provider: "Mentor Network" },
  ],
  social_media: [
    { id: "soc-default-1", title: "Technical Content Series", description: "Publish structured technical learning posts.", provider: "Academic Media Cell" },
  ],
  rpl: [
    { id: "rpl-default-1", title: "Prior Learning Validation", description: "Validation test/interview for prior competency recognition.", provider: "Department" },
  ],
  grade_upgrade: [
    { id: "grade-default-1", title: "Grade Improvement Task Pack", description: "Targeted assignments + viva for grade improvement.", provider: "Department" },
  ],
  cocurricular: [
    { id: "co-default-1", title: "Hackathon Participation", description: "Approved co-curricular challenge with documented outcomes.", provider: "University Club" },
  ],
  community_service: [
    { id: "comm-default-1", title: "Community Tech Drive", description: "Apply technical skills in community outreach activity.", provider: "NSS/NGO Partner" },
  ],
};

const EduRevOptionsPage = () => {
  const { id: categoryId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { categories, selections, getEduRevSelection, setEduRevSelection, finalizeCategory, student } = useStudent();

  const category = categories.find((c) => c.id === categoryId);
  const categorySelection = selections[categoryId];

  const selectedCourseIds = useMemo(
    () => categorySelection?.selectedCourseIds || [],
    [categorySelection?.selectedCourseIds]
  );
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [showUndertaking, setShowUndertaking] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  // Redirect if no courses selected
  useEffect(() => {
    if (!category || selectedCourseIds.length === 0) {
      toast.error("No courses selected", {
        description: "Please select courses before setting up Edu Rev options.",
      });
      navigate("/");
    }
  }, [category, selectedCourseIds, navigate]);

  if (!category || selectedCourseIds.length === 0) return null;

  const currentCourseId = selectedCourseIds[currentCourseIndex];
  const currentCourse = category.courses.find((c) => c.id === currentCourseId);
  const detailsSectionRef = useRef<HTMLDivElement | null>(null);
  const studentCurrentTerm = (student.year - 1) * 2 + student.term;
  const isCompletedTermCourse = currentCourse ? currentCourse.term < studentCurrentTerm : false;
  const suggestedBenefitRaw = searchParams.get("benefit");
  const requestedCourseId = searchParams.get("courseId");
  const isProofUploadMode = searchParams.get("proof") === "1";
  const suggestedBenefit = (Object.keys(EDU_REV_OPTIONS) as EduRevOptionType[])
    .find((type) => type === suggestedBenefitRaw) || null;
  const selectedInitiativeCategory = searchParams.get("initiativeCategory") || "";
  const selectedInitiativeTitle = searchParams.get("initiativeTitle") || "";
  const availableOptionTypes = (Object.keys(EDU_REV_OPTIONS) as EduRevOptionType[])
    .filter((type) => !isCompletedTermCourse || COMPLETED_TERM_ALLOWED_OPTIONS.includes(type));
  const visibleOptionTypes = availableOptionTypes;
  const eduRevData = getEduRevSelection(currentCourseId);

  useEffect(() => {
    if (!requestedCourseId) return;
    const index = selectedCourseIds.indexOf(requestedCourseId);
    if (index >= 0) setCurrentCourseIndex(index);
  }, [requestedCourseId, selectedCourseIds]);

  const optionType = eduRevData?.optionType || null;
  const achievement = eduRevData?.achievement || null;
  const selectedInitiativeId = eduRevData?.initiativeId || null;
  const verificationStatus = eduRevData?.verificationStatus || "not_submitted";

  // If the saved option is not allowed for this course (e.g. completed-term restriction), treat as unset
  const effectiveOptionType =
    optionType && isCompletedTermCourse && !COMPLETED_TERM_ALLOWED_OPTIONS.includes(optionType)
      ? null
      : optionType;

  const suggestedInitiatives = effectiveOptionType
    ? COURSE_INITIATIVE_CATALOG[currentCourse?.courseCode || ""]?.[effectiveOptionType] || DEFAULT_OPTION_INITIATIVES[effectiveOptionType] || []
    : [];

  const isFormComplete: boolean =
    !!(effectiveOptionType &&
    achievement?.title?.trim() &&
    achievement?.description?.trim() &&
    achievement?.documentFile);
  const hasSelectedOption = !!effectiveOptionType;
  const isVerified = verificationStatus === "verified";
  const isSubmitted = verificationStatus === "submitted";

  const handleOptionSelection = (type: EduRevOptionType) => {
    const now = new Date().toISOString();
    setEduRevSelection(currentCourseId, {
      courseId: currentCourseId,
      categoryId: categoryId!,
      optionType: type,
      achievement: achievement || {
        title: "",
        description: "",
        documentFile: null,
        documentName: "",
        uploadedAt: now,
      },
      status: "draft",
      verificationStatus: "not_submitted",
      submittedAt: eduRevData?.submittedAt || null,
      verifiedAt: eduRevData?.verifiedAt || null,
      initiativeId: null,
      initiativeTitle: null,
      initiativeDescription: null,
      createdAt: eduRevData?.createdAt || now,
      updatedAt: now,
    });
  };

  const handleInitiativeSelection = (initiative: InitiativeItem) => {
    const now = new Date().toISOString();
    setEduRevSelection(currentCourseId, {
      courseId: currentCourseId,
      categoryId: categoryId!,
      optionType: effectiveOptionType,
      initiativeId: initiative.id,
      initiativeTitle: initiative.title,
      initiativeDescription: initiative.description,
      achievement: achievement || {
        title: "",
        description: "",
        documentFile: null,
        documentName: "",
        uploadedAt: now,
      },
      status: "draft",
      verificationStatus: "not_submitted",
      submittedAt: null,
      verifiedAt: null,
      createdAt: eduRevData?.createdAt || now,
      updatedAt: now,
    });
  };

  const clearCurrentCourseSelection = () => {
    const now = new Date().toISOString();
    setEduRevSelection(currentCourseId, {
      courseId: currentCourseId,
      categoryId: categoryId!,
      optionType: null,
      initiativeId: null,
      initiativeTitle: null,
      initiativeDescription: null,
      achievement: null,
      status: "draft",
      verificationStatus: "not_submitted",
      submittedAt: null,
      verifiedAt: null,
      createdAt: eduRevData?.createdAt || now,
      updatedAt: now,
    });
  };

  useEffect(() => {
    if (!suggestedBenefit) return;
    if (effectiveOptionType === suggestedBenefit) return;
    handleOptionSelection(suggestedBenefit);
  }, [
    suggestedBenefit,
    effectiveOptionType,
    currentCourseId,
  ]);

  const handleTitleChange = (title: string) => {
    const now = new Date().toISOString();
    setEduRevSelection(currentCourseId, {
      courseId: currentCourseId,
      categoryId: categoryId!,
      optionType,
      achievement: {
        title,
        description: achievement?.description || "",
        documentFile: achievement?.documentFile || null,
        documentName: achievement?.documentName || "",
        uploadedAt: achievement?.uploadedAt || now,
      },
      status: "draft",
      verificationStatus: verificationStatus === "verified" ? "submitted" : verificationStatus,
      submittedAt: eduRevData?.submittedAt || null,
      verifiedAt: null,
      createdAt: eduRevData?.createdAt || now,
      updatedAt: now,
    });
  };

  const handleDescriptionChange = (description: string) => {
    const now = new Date().toISOString();
    setEduRevSelection(currentCourseId, {
      courseId: currentCourseId,
      categoryId: categoryId!,
      optionType,
      achievement: {
        title: achievement?.title || "",
        description,
        documentFile: achievement?.documentFile || null,
        documentName: achievement?.documentName || "",
        uploadedAt: achievement?.uploadedAt || now,
      },
      status: "draft",
      verificationStatus: verificationStatus === "verified" ? "submitted" : verificationStatus,
      submittedAt: eduRevData?.submittedAt || null,
      verifiedAt: null,
      createdAt: eduRevData?.createdAt || now,
      updatedAt: now,
    });
  };

  const handleDocumentUpload = async (file: File) => {
    const fileData = await convertFileToBase64(file);
    const now = new Date().toISOString();
    setEduRevSelection(currentCourseId, {
      courseId: currentCourseId,
      categoryId: categoryId!,
      optionType,
      achievement: {
        title: achievement?.title || "",
        description: achievement?.description || "",
        documentFile: fileData,
        documentName: file.name,
        uploadedAt: now,
      },
      status: "draft",
      verificationStatus: verificationStatus === "verified" ? "submitted" : verificationStatus,
      submittedAt: eduRevData?.submittedAt || null,
      verifiedAt: null,
      createdAt: eduRevData?.createdAt || now,
      updatedAt: now,
    });
  };

  const handleDocumentRemove = () => {
    const now = new Date().toISOString();
    setEduRevSelection(currentCourseId, {
      courseId: currentCourseId,
      categoryId: categoryId!,
      optionType,
      achievement: {
        title: achievement?.title || "",
        description: achievement?.description || "",
        documentFile: null,
        documentName: "",
        uploadedAt: achievement?.uploadedAt || now,
      },
      status: "draft",
      verificationStatus: verificationStatus === "verified" ? "submitted" : verificationStatus,
      submittedAt: eduRevData?.submittedAt || null,
      verifiedAt: null,
      createdAt: eduRevData?.createdAt || now,
      updatedAt: now,
    });
  };

  const handleSubmitForVerification = () => {
    if (!hasSelectedOption) return;
    const now = new Date().toISOString();
    const nextVerificationStatus = isFormComplete ? "verified" : "submitted";

    setEduRevSelection(currentCourseId, {
      courseId: currentCourseId,
      categoryId: categoryId!,
      optionType: effectiveOptionType,
      achievement: achievement || {
        title: "",
        description: "",
        documentFile: null,
        documentName: "",
        uploadedAt: now,
      },
      status: "draft",
      verificationStatus: nextVerificationStatus,
      submittedAt: now,
      verifiedAt: nextVerificationStatus === "verified" ? now : null,
      createdAt: eduRevData?.createdAt || now,
      updatedAt: now,
    });

    if (nextVerificationStatus === "verified") {
      toast.success("Verified and completed", {
        description: "This course benefit is now marked as completed.",
      });
      return;
    }

    toast.success("Submitted", {
      description: "Submitted for verification. Completion will show after verification.",
    });
  };

  const handleNext = () => {
    if (currentCourseIndex < selectedCourseIds.length - 1) {
      setCurrentCourseIndex(currentCourseIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowUndertaking(true);
    }
  };

  const handlePrevious = () => {
    if (currentCourseIndex > 0) {
      setCurrentCourseIndex(currentCourseIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const progress = ((currentCourseIndex + 1) / selectedCourseIds.length) * 100;

  const nextCourseId = selectedCourseIds[currentCourseIndex + 1];
  const nextCourse = nextCourseId ? category.courses.find((c) => c.id === nextCourseId) : null;

  return (
    <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        {/* Progress card */}
        <div className="bg-card rounded-xl border border-border p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-foreground">
              Course {currentCourseIndex + 1} of {selectedCourseIds.length}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-1.5 mb-3" />
          {nextCourse && (
            <p className="text-xs text-muted-foreground">Next: {nextCourse.name}</p>
          )}
          <div className="mt-2">
            <span className={`text-[11px] font-semibold px-2 py-1 rounded-full border ${
              isVerified
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : isSubmitted
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-slate-50 text-slate-600 border-slate-200"
            }`}>
              {isVerified ? "Completed (Verified)" : isSubmitted ? "Submitted • Pending Verification" : "Not Submitted"}
            </span>
          </div>
        </div>

        {/* Current course card */}
        <div className="bg-card rounded-xl border border-border p-5 mb-8 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
            <BookOpen className="w-7 h-7 text-primary" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Current Course</span>
            <h2 className="text-lg font-bold text-foreground mt-0.5">{currentCourse?.name}</h2>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              # {currentCourse?.courseCode} · {currentCourse?.yearLabel}
            </p>
          </div>
        </div>

        {/* Benefit Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-1">
            Select Your Edu Revolution Benefit
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            {isProofUploadMode
              ? "Benefit is already selected. Upload proof and submit from this screen."
              : "Choose the specific advantage first. You can upload proof later from View Progress."}
          </p>
          {!!(suggestedBenefit || selectedInitiativeTitle || selectedInitiativeCategory) && (
            <div className="flex items-start justify-between gap-3 px-4 py-3 rounded-lg bg-primary/5 border border-primary/20 mb-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Selected Outside-Class Initiative</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedInitiativeCategory ? `${selectedInitiativeCategory} • ` : ""}
                  {selectedInitiativeTitle || "Initiative selected from overview"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => detailsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="text-xs font-semibold text-primary hover:text-primary/80"
              >
                View details
              </button>
            </div>
          )}
          {isCompletedTermCourse && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-amber-50 text-amber-800 text-sm border border-amber-200 mb-4">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                {suggestedBenefit
                  ? "This initiative was selected from outside-class overview. Select and continue. Upload proof later from View Progress."
                  : "This course is from a completed term. Only select Edu Rev benefits are available."}
              </span>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(Object.entries(EDU_REV_OPTIONS) as Array<[EduRevOptionType, { label: string; description: string; icon: string }]>)
              .filter(([type]) => visibleOptionTypes.includes(type))
              .map(
              ([type, { label, description, icon }]) => (
                <EduRevOptionCard
                  key={type}
                  type={type}
                  label={label}
                  description={description}
                  icon={icon}
                  isSelected={effectiveOptionType === type}
                  onClick={() => handleOptionSelection(type)}
                />
              )
            )}
          </div>
        </div>

        {effectiveOptionType && (
          <div className="mb-6 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-sm font-bold text-foreground">Select Initiative for {currentCourse?.courseCode}</h3>
              {!isProofUploadMode && (
                <button
                  type="button"
                  onClick={clearCurrentCourseSelection}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Clear selection
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestedInitiatives.map((initiative) => (
                <button
                  key={initiative.id}
                  type="button"
                  onClick={() => handleInitiativeSelection(initiative)}
                  disabled={isProofUploadMode}
                  className={`text-left rounded-lg border p-3 transition-colors ${
                    selectedInitiativeId === initiative.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  } ${isProofUploadMode ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  <p className="text-sm font-semibold text-foreground">{initiative.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{initiative.description}</p>
                  <p className="text-[11px] text-primary mt-2 font-semibold">Provider: {initiative.provider}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Achievement Form */}
        {effectiveOptionType && (
          <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-bold text-foreground">
              Benefits for selected option: {EDU_REV_OPTIONS[effectiveOptionType].label}
            </p>
            <ul className="mt-2 space-y-1">
              {OPTION_BENEFITS[effectiveOptionType].map((benefit) => (
                <li key={benefit} className="text-sm text-muted-foreground">• {benefit}</li>
              ))}
            </ul>

            <div className="mt-3 rounded-lg border border-border bg-card p-3">
              <p className="text-sm font-semibold text-foreground">Academic Benefit Criteria (CA / Mid-term / End-term)</p>
              <ul className="mt-2 space-y-1">
                <li className="text-sm text-muted-foreground">• CA: {OPTION_ACADEMIC_POLICY[effectiveOptionType].ca}</li>
                <li className="text-sm text-muted-foreground">• Mid-term: {OPTION_ACADEMIC_POLICY[effectiveOptionType].midTerm}</li>
                <li className="text-sm text-muted-foreground">• End-term: {OPTION_ACADEMIC_POLICY[effectiveOptionType].endTerm}</li>
              </ul>
              <p className="text-sm font-semibold text-primary mt-2">
                If cleared: {OPTION_ACADEMIC_POLICY[effectiveOptionType].benefit}
              </p>
            </div>
          </div>
        )}

        {effectiveOptionType && isProofUploadMode && (
          <div ref={detailsSectionRef} className="mb-8 bg-card rounded-xl border border-border p-6">
            <h2 className="text-base font-bold text-foreground mb-5">Achievement Details</h2>
            <AchievementForm
              title={achievement?.title || ""}
              description={achievement?.description || ""}
              documentName={achievement?.documentName || null}
              onTitleChange={handleTitleChange}
              onDescriptionChange={handleDescriptionChange}
              onDocumentUpload={handleDocumentUpload}
              onDocumentRemove={handleDocumentRemove}
              isComplete={isFormComplete}
            />

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                Submit for verification after uploading your proof documents.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleSubmitForVerification}
                disabled={!hasSelectedOption || !isFormComplete}
                className="h-9"
              >
                {isVerified ? "Re-submit" : "Submit for Verification"}
              </Button>
            </div>
          </div>
        )}

        {effectiveOptionType && !isProofUploadMode && (
          <div className="mb-8 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Next step: Upload proof from Progress</p>
            <p className="text-xs text-muted-foreground mt-1">
              After selecting benefits for your courses, open View Progress in course overview and use "Open proof details".
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentCourseIndex === 0}
            className="gap-2 h-10 rounded-lg"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={false}
            className="gap-2 h-10 rounded-lg"
          >
            {currentCourseIndex === selectedCourseIds.length - 1 ? (
              <>
                Finalize
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Save & Next Course
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {/* Undertaking Modal */}
        <UndertakingModal
          open={showUndertaking}
          onConfirm={() => {
            setShowUndertaking(false);
            setShowConsent(true);
          }}
          onCancel={() => setShowUndertaking(false)}
        />

        <ConsentModal
          open={showConsent}
          onCancel={() => setShowConsent(false)}
          onConfirm={() => {
            finalizeCategory(categoryId!);
            setShowConsent(false);
            toast.success("Category finalized!", {
              description: "Your course selections and Edu Rev benefits have been locked in.",
            });
            navigate("/");
          }}
        />
      </div>
    </div>
  );
};

// Helper function to convert file to base64
function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default EduRevOptionsPage;
