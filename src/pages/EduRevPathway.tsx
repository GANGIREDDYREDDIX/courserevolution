import { useMemo, useState, useEffect } from "react";
import EduRevDisclaimerModal from "@/components/edurev/EduRevDisclaimerModal";
import { useLocation, useNavigate } from "react-router-dom";
import { useStudent } from "@/context/StudentContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, CircleAlert, Lock } from "lucide-react";
import { motion } from "framer-motion";
import type { EduRevPathwayId, EduRevTierId } from "@/context/StudentContext";

type PathwayId = EduRevPathwayId;
type MinorKey = "cloud" | "cyber" | "generic";

const pathways: Array<{
  id: PathwayId;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = [
  {
    id: "placements",
    title: "Placements",
    description: "Prepare for campus placements and secure your dream job",
    icon: "💼",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship",
    description: "Start your own venture and build innovative solutions",
    icon: "🚀",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  }
];

const minorPrefixMap: Array<{ prefix: string; key: Exclude<MinorKey, "generic">; label: string }> = [
  { prefix: "em-cloud-", key: "cloud", label: "Cloud Computing" },
  { prefix: "em-cyber-", key: "cyber", label: "Cyber Security" },
];

const defaultMinorLabelMap: Record<string, string> = {
  "em-data-": "Data Science",
  "em-ml-": "Machine Learning",
  "em-qe-": "Quality Engineering & Test Automation",
  "em-fullstack-": "Full Stack Web Development",
};

type TierPlan = {
  salary: "Above ₹25 LPA Track" | "₹10-25 LPA Track" | "Up to ₹10 LPA Track";
  role: string;
  dataFocus: string;
  certifications: string[];
};

const salaryToTierId: Record<TierPlan["salary"], EduRevTierId> = {
  "Above ₹25 LPA Track": "tier_50",
  "₹10-25 LPA Track": "tier_30",
  "Up to ₹10 LPA Track": "tier_20",
};

const TIER_RULES: Record<EduRevTierId, { label: string; check: (readinessScore: number) => boolean }> = {
  tier_50: {
    label: "Unlocked when readiness score is above 70",
    check: (readinessScore) => readinessScore > 70,
  },
  tier_30: {
    label: "Unlocked when readiness score is between 50 and 70",
    check: (readinessScore) => readinessScore >= 50 && readinessScore <= 70,
  },
  tier_20: {
    label: "Unlocked when readiness score is below 50",
    check: (readinessScore) => readinessScore < 50,
  },
};

type PathwayDetails = {
  overview: string;
  parameters: string[];
  outcomes: string[];
};

const PLANS: Record<MinorKey, Record<PathwayId, TierPlan[]>> = {
  cloud: {
    placements: [
      {
        salary: "Above ₹25 LPA Track",
        role: "Senior Cloud Platform Engineer",
        dataFocus: "Distributed systems design, multi-cloud architecture, Kubernetes platform engineering",
        certifications: ["AWS Solutions Architect Professional", "CKA", "Google Professional Cloud Architect"],
      },
      {
        salary: "₹10-25 LPA Track",
        role: "Cloud DevOps Engineer",
        dataFocus: "CI/CD optimization, observability pipelines, IaC with Terraform",
        certifications: ["AWS DevOps Engineer Professional", "Terraform Associate", "CKAD"],
      },
      {
        salary: "Up to ₹10 LPA Track",
        role: "Cloud Support / SRE Associate",
        dataFocus: "Monitoring dashboards, incident response metrics, Linux + networking operations",
        certifications: ["AWS Solutions Architect Associate", "Azure Administrator", "Docker Certified Associate"],
      },
    ],
    entrepreneurship: [
      {
        salary: "Above ₹25 LPA Track",
        role: "B2B Cloud SaaS Founder",
        dataFocus: "Usage analytics, infra cost forecasting, enterprise onboarding data",
        certifications: ["FinOps Certified Practitioner", "AWS SaaS Factory Foundation", "CKA"],
      },
      {
        salary: "₹10-25 LPA Track",
        role: "Cloud Automation Product Builder",
        dataFocus: "Developer productivity metrics, API telemetry, release quality data",
        certifications: ["AWS Developer Associate", "Azure Developer Associate", "Terraform Associate"],
      },
      {
        salary: "Up to ₹10 LPA Track",
        role: "Freelance Cloud Consultant",
        dataFocus: "Migration reports, backup/security audit data, client infrastructure baselines",
        certifications: ["AWS Cloud Practitioner", "Microsoft Azure Fundamentals", "Google Associate Cloud Engineer"],
      },
    ],
    revenue_generation: [
      {
        salary: "Above ₹25 LPA Track",
        role: "Premium Cloud Architect Consultant",
        dataFocus: "Enterprise modernization datasets, scalability benchmarks, cost-to-performance analytics",
        certifications: ["AWS SAP", "Google PCA", "CKS"],
      },
      {
        salary: "₹10-25 LPA Track",
        role: "Cloud Freelance DevOps Specialist",
        dataFocus: "Pipeline metrics, deployment throughput, reliability data trends",
        certifications: ["AWS DevOps Pro", "CKAD", "HashiCorp Terraform Associate"],
      },
      {
        salary: "Up to ₹10 LPA Track",
        role: "Cloud Operations Freelancer",
        dataFocus: "System uptime data, ticket resolution dashboards, security compliance checks",
        certifications: ["AWS SAA", "Azure Admin", "CompTIA Cloud+"],
      },
    ],
    higher_studies: [
      {
        salary: "Above ₹25 LPA Track",
        role: "MS/Research in Cloud & Distributed Systems",
        dataFocus: "Research datasets on scheduling, cloud security, autoscaling optimization",
        certifications: ["AWS SAP", "Google PCA", "TOGAF Foundation"],
      },
      {
        salary: "₹10-25 LPA Track",
        role: "Applied Cloud Systems Graduate",
        dataFocus: "Workload profiling data, architecture comparison studies",
        certifications: ["AWS SAA", "CKA", "Azure Solutions Architect Expert"],
      },
      {
        salary: "Up to ₹10 LPA Track",
        role: "PG Diploma + Cloud Engineer",
        dataFocus: "Case-study datasets, cloud migration reports and operations data",
        certifications: ["AWS CCP", "Azure Fundamentals", "Linux Foundation KCNA"],
      },
    ],
    govt_exams: [
      {
        salary: "Above ₹25 LPA Track",
        role: "Technical Specialist (PSU/High-end public tech roles)",
        dataFocus: "Secure cloud infra for e-governance, scale planning, compliance data",
        certifications: ["NIELIT Cloud Computing", "AWS Security Specialty", "ISO 27001 Lead Implementer"],
      },
      {
        salary: "₹10-25 LPA Track",
        role: "System/Network Officer",
        dataFocus: "Public service workload metrics, backup and disaster recovery datasets",
        certifications: ["RHCSA", "Azure Admin", "CompTIA Security+"],
      },
      {
        salary: "Up to ₹10 LPA Track",
        role: "IT Officer / Junior Technical Executive",
        dataFocus: "Ticketing data, infra health logs, department resource reports",
        certifications: ["CCNA", "AWS CCP", "NPTEL Cloud Computing"],
      },
    ],
  },
  cyber: {
    placements: [
      {
        salary: "Above ₹25 LPA Track",
        role: "Senior Security Engineer / SOC Lead",
        dataFocus: "Threat intelligence feeds, SIEM correlation, zero-trust telemetry",
        certifications: ["CISSP", "OSCP", "GIAC GSEC"],
      },
      {
        salary: "₹10-25 LPA Track",
        role: "Security Analyst / Pentester",
        dataFocus: "Vulnerability scan data, penetration testing reports, incident response metrics",
        certifications: ["CEH", "CompTIA Security+", "eJPT"],
      },
      {
        salary: "Up to ₹10 LPA Track",
        role: "SOC Analyst / Security Associate",
        dataFocus: "Log analysis dashboards, phishing detection patterns, endpoint alerts",
        certifications: ["Google Cybersecurity Certificate", "CompTIA CySA+", "CC (ISC2)"],
      },
    ],
    entrepreneurship: [
      {
        salary: "Above ₹25 LPA Track",
        role: "Cybersecurity Product Founder",
        dataFocus: "Threat detection models, customer risk score datasets, compliance evidence automation",
        certifications: ["CISSP", "ISO 27001 LA", "CCSP"],
      },
      {
        salary: "₹10-25 LPA Track",
        role: "Security Consulting Startup",
        dataFocus: "Audit findings data, risk heat maps, client maturity benchmarks",
        certifications: ["CEH", "CISA", "CompTIA PenTest+"],
      },
      {
        salary: "Up to ₹10 LPA Track",
        role: "Freelance Security Auditor",
        dataFocus: "Web/mobile security reports, bug bounty submissions, remediation datasets",
        certifications: ["eJPT", "Security+", "NPTEL Ethical Hacking"],
      },
    ],
    revenue_generation: [
      {
        salary: "Above ₹25 LPA Track",
        role: "Premium VAPT Specialist",
        dataFocus: "Enterprise pentest evidence sets, cloud security baselines, exploit simulation outputs",
        certifications: ["OSCP", "CISSP", "CRTP"],
      },
      {
        salary: "₹10-25 LPA Track",
        role: "Security Freelance Consultant",
        dataFocus: "OWASP risk scoring data, API security reports, SOC KPI analytics",
        certifications: ["CEH", "CompTIA PenTest+", "eCPPT"],
      },
      {
        salary: "Up to ₹10 LPA Track",
        role: "Junior Cyber Freelancer",
        dataFocus: "Small-business risk assessments, endpoint hardening data, patch compliance stats",
        certifications: ["Security+", "CC (ISC2)", "Google Cybersecurity"],
      },
    ],
    higher_studies: [
      {
        salary: "Above ₹25 LPA Track",
        role: "MS in Cybersecurity / Digital Forensics",
        dataFocus: "Malware datasets, anomaly detection research, cryptography implementation studies",
        certifications: ["CISSP", "CCSP", "GIAC GCIH"],
      },
      {
        salary: "₹10-25 LPA Track",
        role: "Applied Security Research Track",
        dataFocus: "Network intrusion datasets, endpoint behavior analytics",
        certifications: ["CEH", "CySA+", "OSDA"],
      },
      {
        salary: "Up to ₹10 LPA Track",
        role: "PG Program + Security Engineer",
        dataFocus: "Security operations datasets, forensic evidence lifecycle data",
        certifications: ["CC", "Security+", "NPTEL Cyber Security"],
      },
    ],
    govt_exams: [
      {
        salary: "Above ₹25 LPA Track",
        role: "Cyber Cell / National Security Technical Roles",
        dataFocus: "Digital forensics datasets, threat intelligence for critical infra",
        certifications: ["CHFI", "CISSP", "ISO 27001 LA"],
      },
      {
        salary: "₹10-25 LPA Track",
        role: "Cyber Security Officer (Govt/PSU)",
        dataFocus: "Incident response reports, compliance metrics, vulnerability trends",
        certifications: ["CEH", "Security+", "CISA"],
      },
      {
        salary: "Up to ₹10 LPA Track",
        role: "IT Security Executive",
        dataFocus: "SOC ticket analytics, audit observations, endpoint health data",
        certifications: ["CC", "CySA+", "NPTEL Information Security"],
      },
    ],
  },
  generic: {
    placements: [
      {
        salary: "Above ₹25 LPA Track",
        role: "Top Product/Platform Role",
        dataFocus: "Advanced DSA + system design interview data, domain project metrics",
        certifications: ["AWS/Azure Architect (domain specific)", "Advanced domain certification", "LeetCode top-percentile profile"],
      },
      {
        salary: "₹10-25 LPA Track",
        role: "Core Engineer Role",
        dataFocus: "Hands-on project data, performance benchmarking, coding assessment progress",
        certifications: ["Associate-level cloud/security/domain certification", "NPTEL Elite certificate"],
      },
      {
        salary: "Up to ₹10 LPA Track",
        role: "Entry Engineer Role",
        dataFocus: "Portfolio outcomes, internship data, coding/problem-solving consistency",
        certifications: ["Foundation certification", "NPTEL/MOOC completion certificates"],
      },
    ],
    entrepreneurship: [
      {
        salary: "Above ₹25 LPA Track",
        role: "Scalable Startup Builder",
        dataFocus: "Unit economics, growth analytics, retention dashboards",
        certifications: ["Startup India learning tracks", "Product management certification", "Cloud architecture certification"],
      },
      {
        salary: "₹10-25 LPA Track",
        role: "Niche Product Founder",
        dataFocus: "Problem-validation datasets, acquisition funnel analytics",
        certifications: ["Digital marketing analytics", "Agile/Scrum certification"],
      },
      {
        salary: "Up to ₹10 LPA Track",
        role: "Freelance-to-Startup Path",
        dataFocus: "Client success data, proposal conversion metrics, project profitability",
        certifications: ["Freelancing and business basics", "Domain foundation courses"],
      },
    ],
    revenue_generation: [
      {
        salary: "Above ₹25 LPA Track",
        role: "High-ticket Consultant",
        dataFocus: "Outcome-driven case studies, ROI analytics, enterprise delivery metrics",
        certifications: ["Advanced domain certificate", "Consulting frameworks certification"],
      },
      {
        salary: "₹10-25 LPA Track",
        role: "Professional Freelancer",
        dataFocus: "Project throughput, quality scores, client retention stats",
        certifications: ["Intermediate domain certification", "Client communication certification"],
      },
      {
        salary: "Up to ₹10 LPA Track",
        role: "Entry Freelance Contributor",
        dataFocus: "Portfolio consistency, delivery timelines, project quality checklists",
        certifications: ["Foundation domain certification", "NPTEL/MOOC certificates"],
      },
    ],
    higher_studies: [
      {
        salary: "Above ₹25 LPA Track",
        role: "Top University MS/Research Route",
        dataFocus: "Research papers, publication datasets, GRE/IELTS score trend data",
        certifications: ["Advanced research methods", "Domain-specialized certificates"],
      },
      {
        salary: "₹10-25 LPA Track",
        role: "Applied Masters Route",
        dataFocus: "Capstone project outcomes, applied research data",
        certifications: ["Domain intermediate certificates", "Academic writing certification"],
      },
      {
        salary: "Up to ₹10 LPA Track",
        role: "PG Diploma + Industry Role",
        dataFocus: "Practical project evidence, internship and upskilling datasets",
        certifications: ["Foundation certificates", "MOOC/NPTEL stack"],
      },
    ],
    govt_exams: [
      {
        salary: "Above ₹25 LPA Track",
        role: "Senior Technical Public Sector Roles",
        dataFocus: "Exam score analytics, domain exam prep datasets, mock test benchmarks",
        certifications: ["Relevant PSU/technical exam prep credentials", "Advanced domain cert"],
      },
      {
        salary: "₹10-25 LPA Track",
        role: "Officer Level Technical Roles",
        dataFocus: "Topic mastery tracking, revision analytics, interview readiness metrics",
        certifications: ["Domain intermediate certification", "Aptitude and reasoning certifications"],
      },
      {
        salary: "Up to ₹10 LPA Track",
        role: "Junior Technical Govt Roles",
        dataFocus: "Subject-wise mock trends, consistency and completion stats",
        certifications: ["Foundation domain cert", "NIELIT/NPTEL equivalent certifications"],
      },
    ],
  },
};

const buildPathwayDetails = (minorLabel: string): Record<PathwayId, PathwayDetails> => ({
  placements: {
    overview: `Placement roadmap tuned for ${minorLabel} with role depth, interview readiness, and offer quality benchmarks.`,
    parameters: [
      "Target companies list: Product MNCs, top startups, and domain-focused recruiters",
      "Coding benchmark: 400+ DSA problems + 20+ timed contest rounds",
      "Interview targets: 3 mock technical + 2 mock system design interviews per month",
      "Project target: 2 production-grade projects aligned to your minor specialization",
      "Offer KPI: target CTC bands ₹20L / ₹30L / ₹50L with quarterly readiness reviews",
    ],
    outcomes: [
      "High-quality resume mapped to role clusters",
      "Interview-ready portfolio with measurable impact",
      "Tiered offer strategy for dream/reach/safe roles",
    ],
  },
  entrepreneurship: {
    overview: `Startup-focused path for ${minorLabel} with market validation, product execution, and growth metrics.`,
    parameters: [
      "Problem validation: 30+ user interviews and 3 validated pain points",
      "MVP launch target: v1 in <= 10 weeks with active usage tracking",
      "Business KPI: CAC, LTV, retention (D30), and monthly recurring revenue",
      "Go-to-market target: 2 acquisition channels with weekly funnel monitoring",
      "Funding readiness: pitch deck + traction dashboard + unit economics sheet",
    ],
    outcomes: [
      "Execution-ready startup operating model",
      "Data-backed product growth decisions",
      "Investor and accelerator submission readiness",
    ],
  },
  revenue_generation: {
    overview: `Income-generation strategy for ${minorLabel} through freelancing, consulting, and monetizable assets.`,
    parameters: [
      "Monthly revenue targets: ₹50K -> ₹1.5L -> ₹3L progressive tiers",
      "Client pipeline KPI: 20 qualified leads / month and 20% close rate",
      "Delivery metric: 95% on-time milestone completion with quality score tracking",
      "Personal brand KPI: proof-of-work portfolio + testimonials + niche authority posts",
      "Margin target: maintain >40% gross margin on billable engagements",
    ],
    outcomes: [
      "Predictable freelance/consulting income",
      "Niche domain positioning and repeat clients",
      "Scalable service-to-product transition path",
    ],
  },
  higher_studies: {
    overview: `Higher studies roadmap for ${minorLabel} with elite university targeting and research profile building.`,
    parameters: [
      "University targets: Ivy League + top global schools (MIT, Stanford, CMU, UC Berkeley)",
      "Academic KPI: CGPA target >= 8.5 with strong core-subject performance",
      "Exam targets: GRE 325+ and TOEFL 105+ / IELTS 7.5+",
      "Research profile: 1-2 publications or strong research/internship output",
      "Application stack: SOP, 3 strong LORs, and impact-led CV with project depth",
    ],
    outcomes: [
      "Shortlist-ready profile for top global programs",
      "Strong admit probability through data-driven application planning",
      "Balanced strategy across dream/target/safe universities",
    ],
  },
  govt_exams: {
    overview: `Government exam track for ${minorLabel} with structured preparation, mock analysis, and role-fit planning.`,
    parameters: [
      "Exam targets: GATE / ESE / PSU technical exams / relevant government technical roles",
      "Preparation KPI: 25+ quality mock tests with error log and topic-wise analytics",
      "Accuracy benchmark: >70% in mocks with progressive cut-off beating trend",
      "Revision framework: 3-cycle revision plan with formula and concept retention checks",
      "Selection readiness: interview/documentation checklist and timeline tracker",
    ],
    outcomes: [
      "Consistent score improvement with measurable readiness",
      "Cutoff-focused preparation strategy",
      "End-to-end exam-to-selection pipeline",
    ],
  },
});

const EduRevPathway = () => {
    // ...existing code...

  const navigate = useNavigate();
  const location = useLocation();
  const { student, selections, setSelectedEduRevPathway, setSelectedEduRevTier } = useStudent();
  const flowState = location.state as {
    cgpa?: number;
    marks?: number;
    psychometricTest?: number;
    problemSolvingSkill?: number;
  } | null;
  const academicCgpa = typeof flowState?.cgpa === "number" && Number.isFinite(flowState?.cgpa) ? flowState.cgpa : student.cgpa;
  const academicMarks = typeof flowState?.marks === "number" && Number.isFinite(flowState?.marks) ? flowState.marks : student.marks;
  const psychometricTestScore =
    typeof flowState?.psychometricTest === "number" && Number.isFinite(flowState?.psychometricTest)
      ? Math.max(0, Math.min(100, Math.round(flowState.psychometricTest)))
      : Math.max(0, Math.min(100, Math.round((academicCgpa / 10) * 50 + (academicMarks / 100) * 50)));
  const problemSolvingSkillScore =
    typeof flowState?.problemSolvingSkill === "number" && Number.isFinite(flowState?.problemSolvingSkill)
      ? Math.max(0, Math.min(100, Math.round(flowState.problemSolvingSkill)))
      : Math.max(0, Math.min(100, Math.round((academicCgpa / 10) * 60 + (academicMarks / 100) * 40)));

  const readinessScore = Math.min(100, Math.round((academicCgpa / 10) * 55 + (academicMarks / 100) * 45));
  const readinessLabel = readinessScore > 70 ? "Excellent" : readinessScore >= 50 ? "Strong" : "Growing";

  const tierEligibility = useMemo(() => {
    return {
      tier_50: TIER_RULES.tier_50.check(readinessScore),
      tier_30: TIER_RULES.tier_30.check(readinessScore),
      tier_20: TIER_RULES.tier_20.check(readinessScore),
    };
  }, [readinessScore]);
  const eligibleTierCount = Object.values(tierEligibility).filter(Boolean).length;

  // If student is not eligible for any tier, redirect to https://edurev.vercel.app/
  useEffect(() => {
    // Only redirect if still on /edurev-pathway (prevents redirect after navigation)
    if (
      eligibleTierCount === 0 &&
      window.location.pathname === "/edurev-pathway"
    ) {
      window.location.replace("https://edurev.vercel.app/");
    }
  }, [eligibleTierCount]);

  const initialPathway = useMemo<PathwayId | null>(() => {
    const candidate = (location.state as { selectedPathway?: PathwayId } | null)?.selectedPathway;
    return pathways.some((pathway) => pathway.id === candidate) ? (candidate as PathwayId) : null;
  }, [location.state]);
  const initialTier = useMemo<EduRevTierId | null>(() => {
    const candidate = (location.state as { selectedTier?: EduRevTierId } | null)?.selectedTier;
    if (candidate === "tier_50" || candidate === "tier_30" || candidate === "tier_20") return candidate;
    return null;
  }, [location.state]);
  const [selectedPathway, setSelectedPathway] = useState<PathwayId | null>(initialPathway);
  const [selectedTier, setSelectedTier] = useState<EduRevTierId | null>(initialTier);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [pendingPathway, setPendingPathway] = useState<PathwayId | null>(null);




  // ...existing code...



  // If student is not eligible for any tier, redirect to https://edurev.vercel.app/
  useEffect(() => {
    if (eligibleTierCount === 0) {
      window.location.replace("https://edurev.vercel.app/");
    }
  }, [eligibleTierCount]);

  const { selectedMinorKey, selectedMinorLabel } = useMemo(() => {
    const minorIds = selections["cat-4"]?.selectedCourseIds || [];

    for (const minor of minorPrefixMap) {
      if (minorIds.some((id) => id.startsWith(minor.prefix))) {
        return { selectedMinorKey: minor.key as MinorKey, selectedMinorLabel: minor.label };
      }
    }

    for (const [prefix, label] of Object.entries(defaultMinorLabelMap)) {
      if (minorIds.some((id) => id.startsWith(prefix))) {
        return { selectedMinorKey: "generic" as MinorKey, selectedMinorLabel: label };
      }
    }

    return { selectedMinorKey: "generic" as MinorKey, selectedMinorLabel: "Your Selected Minor" };
  }, [selections]);

  const selectedPathwayMeta = pathways.find((pathway) => pathway.id === selectedPathway) || null;
  const tierPlans = selectedPathway ? PLANS[selectedMinorKey][selectedPathway] : [];
  const pathwayDetailsMap = useMemo(() => buildPathwayDetails(selectedMinorLabel), [selectedMinorLabel]);
  const selectedPathwayDetails = selectedPathway ? pathwayDetailsMap[selectedPathway] : null;

  // If student is not eligible for any tier, redirect to https://edurev.vercel.app/
  useEffect(() => {
    if (eligibleTierCount === 0) {
      window.location.replace("https://edurev.vercel.app/");
    }
  }, [eligibleTierCount]);

  const handleOpenTierDetail = (tier: TierPlan) => {
    if (!selectedPathwayMeta || !selectedPathwayDetails) return;

    navigate("/edurev-pathway/tier-detail", {
      state: {
        pathwayId: selectedPathway,
        selectedTier: salaryToTierId[tier.salary],
        pathwayTitle: selectedPathwayMeta.title,
        minorLabel: selectedMinorLabel,
        tier,
        overview: selectedPathwayDetails.overview,
        parameters: selectedPathwayDetails.parameters,
        outcomes: selectedPathwayDetails.outcomes,
      },
    });
  };



  const handleContinue = () => {
    if (selectedPathway && selectedTier && tierEligibility[selectedTier]) {
      setSelectedEduRevPathway(selectedPathway);
      setSelectedEduRevTier(selectedTier);
      navigate("/edurev-overview", { state: { pathway: selectedPathway, tier: selectedTier } });
    }
  };

  return (
    <>
      <div className="py-8 max-w-5xl mx-auto animate-fade-in">
        <EduRevDisclaimerModal
          open={showDisclaimer}
          isHighPerformanceFlow={true}
          onConfirm={() => {
            setHasAgreed(true);
            setShowDisclaimer(false);
            if (pendingPathway) {
              if (selectedPathway !== pendingPathway) {
                setSelectedTier(null);
                setSelectedEduRevTier(null);
              }
              setSelectedPathway(pendingPathway);
              setSelectedEduRevPathway(pendingPathway);
              setPendingPathway(null);
            }
          }}
          onCancel={() => {
            setShowDisclaimer(false);
            setPendingPathway(null);
          }}
        />
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-semibold">Go Back</span>
        </button>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-2">
          EDU-Revolution: Learning by Doing
        </h1>
        <p className="text-base md:text-lg text-muted-foreground">
          Select the pathway that best aligns with your career goals and aspirations.
        </p>

              </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Choose Pathway</h2>
        <p className="text-xs text-muted-foreground">Step 1 of 2</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {pathways.map((pathway) => (
          <motion.button
            key={pathway.id}
            onClick={() => {
              if (!hasAgreed) {
                setPendingPathway(pathway.id);
                setShowDisclaimer(true);
              } else {
                if (selectedPathway !== pathway.id) {
                  setSelectedTier(null);
                  setSelectedEduRevTier(null);
                }
                setSelectedPathway(pathway.id);
                setSelectedEduRevPathway(pathway.id);
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`group text-left rounded-2xl border p-5 transition-all ${
              selectedPathway === pathway.id
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-card hover:border-primary/40 hover:shadow-sm"
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="grid place-items-center w-12 h-12 rounded-lg bg-secondary border border-border text-2xl transition-transform group-hover:scale-105">
                {pathway.icon}
              </span>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-foreground">{pathway.title}</h2>
                <p className="text-sm text-muted-foreground mt-1.5">{pathway.description}</p>
              </div>
              {selectedPathway === pathway.id && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

{hasAgreed && (
        <div className="mb-6 rounded-2xl border border-border bg-card shadow-sm p-4 md:p-5">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Student Eligibility Snapshot</p>
              <h2 className="text-xl font-bold text-foreground mt-1 truncate">{student.name}</h2>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{student.program}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Enrollment ID: <span className="font-semibold text-foreground">{student.enrollmentId}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 w-full lg:w-auto">
              <div className="rounded-lg border border-border/70 bg-background/80 px-3 py-2">
                <p className="text-[11px] font-semibold text-muted-foreground">CGPA</p>
                <p className="text-sm font-extrabold text-foreground">{academicCgpa.toFixed(1)}</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/80 px-3 py-2">
                <p className="text-[11px] font-semibold text-muted-foreground">Marks</p>
                <p className="text-sm font-extrabold text-foreground">{academicMarks}%</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/80 px-3 py-2">
                <p className="text-[11px] font-semibold text-muted-foreground">Year</p>
                <p className="text-sm font-extrabold text-foreground">{student.year}</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/80 px-3 py-2">
                <p className="text-[11px] font-semibold text-muted-foreground">Semester</p>
                <p className="text-sm font-extrabold text-foreground">{student.term}</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/80 px-3 py-2">
                <p className="text-[11px] font-semibold text-muted-foreground">Psychometric Test</p>
                <p className="text-sm font-extrabold text-foreground">{psychometricTestScore}%</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/80 px-3 py-2">
                <p className="text-[11px] font-semibold text-muted-foreground">Problem Solving Skill</p>
                <p className="text-sm font-extrabold text-foreground">{problemSolvingSkillScore}%</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-border bg-secondary/20 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-foreground">Readiness Score</p>
              <p className="text-xs font-bold text-primary">{readinessScore}% · {readinessLabel}</p>
            </div>
            <div className="mt-2 h-2.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Eligible tracks unlocked: <span className="font-semibold text-foreground">{eligibleTierCount}/3</span>
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
            {(Object.keys(TIER_RULES) as EduRevTierId[]).map((tierId) => {
              const isEligible = tierEligibility[tierId];
              return (
                <div
                  key={tierId}
                  className={`rounded-lg border-l-4 border px-3 py-2 ${isEligible ? "border-l-emerald-500 border-emerald-200 bg-emerald-50" : "border-l-amber-500 border-amber-200 bg-amber-50"}`}
                >
                  <p className="text-xs font-bold text-foreground">
                    {tierId === "tier_50" ? "Above ₹25 LPA" : tierId === "tier_30" ? "₹10-25 LPA" : "Up to ₹10 LPA"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{TIER_RULES[tierId].label}</p>
                  <p className={`mt-1 inline-flex items-center gap-1 text-[11px] font-semibold ${isEligible ? "text-emerald-700" : "text-amber-700"}`}>
                    {isEligible ? <CheckCircle2 className="w-3.5 h-3.5" /> : <CircleAlert className="w-3.5 h-3.5" />}
                    {isEligible ? "Unlocked" : "Locked"}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            Eligibility logic: tracks unlock directly from your readiness score band.
          </p>
        </div>
        )}

      {selectedPathwayMeta && (
          <div className="mb-8 rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            {selectedPathwayMeta.title} Plan for {selectedMinorLabel}
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Based on your selected elective minor, here is a salary-tier roadmap with role focus, data focus, and certifications.
          </p>
          <p className="text-xs font-semibold text-primary mb-4">
            Select one salary track to continue.
          </p>

          {selectedPathwayDetails && (
            <div className="mb-5 rounded-xl border border-border bg-secondary/20 p-4">
              <p className="text-sm font-semibold text-foreground mb-2">Category Details & Parameters</p>
              <p className="text-sm text-muted-foreground mb-3">{selectedPathwayDetails.overview}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">Key Parameters</p>
                  <ul className="space-y-1">
                    {selectedPathwayDetails.parameters.map((item) => (
                      <li key={item} className="text-xs text-muted-foreground">• {item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">Expected Outcomes</p>
                  <ul className="space-y-1">
                    {selectedPathwayDetails.outcomes.map((item) => (
                      <li key={item} className="text-xs text-muted-foreground">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tierPlans.map((tier) => (
              <div
                key={tier.salary}
                onClick={() => {
                  const nextTier = salaryToTierId[tier.salary];
                  if (!tierEligibility[nextTier]) return;
                  setSelectedTier(nextTier);
                  setSelectedEduRevTier(nextTier);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    const nextTier = salaryToTierId[tier.salary];
                    if (!tierEligibility[nextTier]) return;
                    setSelectedTier(nextTier);
                    setSelectedEduRevTier(nextTier);
                  }
                }}
                className={`rounded-xl border p-4 text-left transition-all ${
                  !tierEligibility[salaryToTierId[tier.salary]]
                    ? "border-amber-200 bg-amber-50 opacity-80 cursor-not-allowed"
                    : selectedTier === salaryToTierId[tier.salary]
                      ? "border-primary ring-2 ring-primary/25 bg-primary/5 shadow-md cursor-pointer"
                      : "border-border bg-card hover:border-primary/40 hover:shadow-sm cursor-pointer"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-bold text-primary">{tier.salary}</p>
                  {!tierEligibility[salaryToTierId[tier.salary]] ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      <Lock className="w-3 h-3" />
                      Locked
                    </span>
                  ) : selectedTier === salaryToTierId[tier.salary] ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary text-white">Selected</span>
                  ) : null}
                </div>
                <p className="text-[11px] text-muted-foreground mb-2">{TIER_RULES[salaryToTierId[tier.salary]].label}</p>
                <p className="text-base font-semibold text-foreground mb-2">{tier.role}</p>
                <p className="text-xs text-muted-foreground mb-3">
                  <span className="font-semibold text-foreground">Data Focus:</span> {tier.dataFocus}
                </p>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">Recommended Certifications</p>
                  <ul className="space-y-1">
                    {tier.certifications.map((cert) => (
                      <li key={cert} className="text-xs text-muted-foreground">• {cert}</li>
                    ))}
                  </ul>
                </div>

                {!tierEligibility[salaryToTierId[tier.salary]] && (
                  <p className="mt-3 text-[11px] font-semibold text-amber-700 bg-amber-100/70 rounded-md px-2 py-1">
                    Improve your readiness score to unlock this track.
                  </p>
                )}

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    const nextTier = salaryToTierId[tier.salary];
                    if (!tierEligibility[nextTier]) return;
                    setSelectedTier(nextTier);
                    setSelectedEduRevTier(nextTier);
                    handleOpenTierDetail(tier);
                  }}
                  disabled={!tierEligibility[salaryToTierId[tier.salary]]}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 disabled:text-muted-foreground disabled:cursor-not-allowed"
                >
                  Open detailed plan
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border border-border bg-card text-foreground text-sm font-semibold hover:bg-secondary/60 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Only show the button if at least one tier is eligible */}
        {eligibleTierCount > 0 && (
          <Button
            onClick={handleContinue}
            disabled={!selectedPathway || !selectedTier || !tierEligibility[selectedTier]}
            className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-primary hover:bg-primary/90 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Course Overview
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
    </>
  );
};

export default EduRevPathway;
