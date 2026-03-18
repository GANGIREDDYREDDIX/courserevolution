import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStudent } from "@/context/StudentContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
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
  },
  {
    id: "higher_studies",
    title: "Higher Studies",
    description: "Prepare for advanced degrees and research opportunities",
    icon: "📚",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200"
  },
  {
    id: "govt_exams",
    title: "Government Exams",
    description: "Prepare for competitive government examinations",
    icon: "🎯",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
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
  salary: "₹50 LPA Track" | "₹30 LPA Track" | "₹20 LPA Track";
  role: string;
  dataFocus: string;
  certifications: string[];
};

const salaryToTierId: Record<TierPlan["salary"], EduRevTierId> = {
  "₹50 LPA Track": "tier_50",
  "₹30 LPA Track": "tier_30",
  "₹20 LPA Track": "tier_20",
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
        salary: "₹50 LPA Track",
        role: "Senior Cloud Platform Engineer",
        dataFocus: "Distributed systems design, multi-cloud architecture, Kubernetes platform engineering",
        certifications: ["AWS Solutions Architect Professional", "CKA", "Google Professional Cloud Architect"],
      },
      {
        salary: "₹30 LPA Track",
        role: "Cloud DevOps Engineer",
        dataFocus: "CI/CD optimization, observability pipelines, IaC with Terraform",
        certifications: ["AWS DevOps Engineer Professional", "Terraform Associate", "CKAD"],
      },
      {
        salary: "₹20 LPA Track",
        role: "Cloud Support / SRE Associate",
        dataFocus: "Monitoring dashboards, incident response metrics, Linux + networking operations",
        certifications: ["AWS Solutions Architect Associate", "Azure Administrator", "Docker Certified Associate"],
      },
    ],
    entrepreneurship: [
      {
        salary: "₹50 LPA Track",
        role: "B2B Cloud SaaS Founder",
        dataFocus: "Usage analytics, infra cost forecasting, enterprise onboarding data",
        certifications: ["FinOps Certified Practitioner", "AWS SaaS Factory Foundation", "CKA"],
      },
      {
        salary: "₹30 LPA Track",
        role: "Cloud Automation Product Builder",
        dataFocus: "Developer productivity metrics, API telemetry, release quality data",
        certifications: ["AWS Developer Associate", "Azure Developer Associate", "Terraform Associate"],
      },
      {
        salary: "₹20 LPA Track",
        role: "Freelance Cloud Consultant",
        dataFocus: "Migration reports, backup/security audit data, client infrastructure baselines",
        certifications: ["AWS Cloud Practitioner", "Microsoft Azure Fundamentals", "Google Associate Cloud Engineer"],
      },
    ],
    revenue_generation: [
      {
        salary: "₹50 LPA Track",
        role: "Premium Cloud Architect Consultant",
        dataFocus: "Enterprise modernization datasets, scalability benchmarks, cost-to-performance analytics",
        certifications: ["AWS SAP", "Google PCA", "CKS"],
      },
      {
        salary: "₹30 LPA Track",
        role: "Cloud Freelance DevOps Specialist",
        dataFocus: "Pipeline metrics, deployment throughput, reliability data trends",
        certifications: ["AWS DevOps Pro", "CKAD", "HashiCorp Terraform Associate"],
      },
      {
        salary: "₹20 LPA Track",
        role: "Cloud Operations Freelancer",
        dataFocus: "System uptime data, ticket resolution dashboards, security compliance checks",
        certifications: ["AWS SAA", "Azure Admin", "CompTIA Cloud+"],
      },
    ],
    higher_studies: [
      {
        salary: "₹50 LPA Track",
        role: "MS/Research in Cloud & Distributed Systems",
        dataFocus: "Research datasets on scheduling, cloud security, autoscaling optimization",
        certifications: ["AWS SAP", "Google PCA", "TOGAF Foundation"],
      },
      {
        salary: "₹30 LPA Track",
        role: "Applied Cloud Systems Graduate",
        dataFocus: "Workload profiling data, architecture comparison studies",
        certifications: ["AWS SAA", "CKA", "Azure Solutions Architect Expert"],
      },
      {
        salary: "₹20 LPA Track",
        role: "PG Diploma + Cloud Engineer",
        dataFocus: "Case-study datasets, cloud migration reports and operations data",
        certifications: ["AWS CCP", "Azure Fundamentals", "Linux Foundation KCNA"],
      },
    ],
    govt_exams: [
      {
        salary: "₹50 LPA Track",
        role: "Technical Specialist (PSU/High-end public tech roles)",
        dataFocus: "Secure cloud infra for e-governance, scale planning, compliance data",
        certifications: ["NIELIT Cloud Computing", "AWS Security Specialty", "ISO 27001 Lead Implementer"],
      },
      {
        salary: "₹30 LPA Track",
        role: "System/Network Officer",
        dataFocus: "Public service workload metrics, backup and disaster recovery datasets",
        certifications: ["RHCSA", "Azure Admin", "CompTIA Security+"],
      },
      {
        salary: "₹20 LPA Track",
        role: "IT Officer / Junior Technical Executive",
        dataFocus: "Ticketing data, infra health logs, department resource reports",
        certifications: ["CCNA", "AWS CCP", "NPTEL Cloud Computing"],
      },
    ],
  },
  cyber: {
    placements: [
      {
        salary: "₹50 LPA Track",
        role: "Senior Security Engineer / SOC Lead",
        dataFocus: "Threat intelligence feeds, SIEM correlation, zero-trust telemetry",
        certifications: ["CISSP", "OSCP", "GIAC GSEC"],
      },
      {
        salary: "₹30 LPA Track",
        role: "Security Analyst / Pentester",
        dataFocus: "Vulnerability scan data, penetration testing reports, incident response metrics",
        certifications: ["CEH", "CompTIA Security+", "eJPT"],
      },
      {
        salary: "₹20 LPA Track",
        role: "SOC Analyst / Security Associate",
        dataFocus: "Log analysis dashboards, phishing detection patterns, endpoint alerts",
        certifications: ["Google Cybersecurity Certificate", "CompTIA CySA+", "CC (ISC2)"],
      },
    ],
    entrepreneurship: [
      {
        salary: "₹50 LPA Track",
        role: "Cybersecurity Product Founder",
        dataFocus: "Threat detection models, customer risk score datasets, compliance evidence automation",
        certifications: ["CISSP", "ISO 27001 LA", "CCSP"],
      },
      {
        salary: "₹30 LPA Track",
        role: "Security Consulting Startup",
        dataFocus: "Audit findings data, risk heat maps, client maturity benchmarks",
        certifications: ["CEH", "CISA", "CompTIA PenTest+"],
      },
      {
        salary: "₹20 LPA Track",
        role: "Freelance Security Auditor",
        dataFocus: "Web/mobile security reports, bug bounty submissions, remediation datasets",
        certifications: ["eJPT", "Security+", "NPTEL Ethical Hacking"],
      },
    ],
    revenue_generation: [
      {
        salary: "₹50 LPA Track",
        role: "Premium VAPT Specialist",
        dataFocus: "Enterprise pentest evidence sets, cloud security baselines, exploit simulation outputs",
        certifications: ["OSCP", "CISSP", "CRTP"],
      },
      {
        salary: "₹30 LPA Track",
        role: "Security Freelance Consultant",
        dataFocus: "OWASP risk scoring data, API security reports, SOC KPI analytics",
        certifications: ["CEH", "CompTIA PenTest+", "eCPPT"],
      },
      {
        salary: "₹20 LPA Track",
        role: "Junior Cyber Freelancer",
        dataFocus: "Small-business risk assessments, endpoint hardening data, patch compliance stats",
        certifications: ["Security+", "CC (ISC2)", "Google Cybersecurity"],
      },
    ],
    higher_studies: [
      {
        salary: "₹50 LPA Track",
        role: "MS in Cybersecurity / Digital Forensics",
        dataFocus: "Malware datasets, anomaly detection research, cryptography implementation studies",
        certifications: ["CISSP", "CCSP", "GIAC GCIH"],
      },
      {
        salary: "₹30 LPA Track",
        role: "Applied Security Research Track",
        dataFocus: "Network intrusion datasets, endpoint behavior analytics",
        certifications: ["CEH", "CySA+", "OSDA"],
      },
      {
        salary: "₹20 LPA Track",
        role: "PG Program + Security Engineer",
        dataFocus: "Security operations datasets, forensic evidence lifecycle data",
        certifications: ["CC", "Security+", "NPTEL Cyber Security"],
      },
    ],
    govt_exams: [
      {
        salary: "₹50 LPA Track",
        role: "Cyber Cell / National Security Technical Roles",
        dataFocus: "Digital forensics datasets, threat intelligence for critical infra",
        certifications: ["CHFI", "CISSP", "ISO 27001 LA"],
      },
      {
        salary: "₹30 LPA Track",
        role: "Cyber Security Officer (Govt/PSU)",
        dataFocus: "Incident response reports, compliance metrics, vulnerability trends",
        certifications: ["CEH", "Security+", "CISA"],
      },
      {
        salary: "₹20 LPA Track",
        role: "IT Security Executive",
        dataFocus: "SOC ticket analytics, audit observations, endpoint health data",
        certifications: ["CC", "CySA+", "NPTEL Information Security"],
      },
    ],
  },
  generic: {
    placements: [
      {
        salary: "₹50 LPA Track",
        role: "Top Product/Platform Role",
        dataFocus: "Advanced DSA + system design interview data, domain project metrics",
        certifications: ["AWS/Azure Architect (domain specific)", "Advanced domain certification", "LeetCode top-percentile profile"],
      },
      {
        salary: "₹30 LPA Track",
        role: "Core Engineer Role",
        dataFocus: "Hands-on project data, performance benchmarking, coding assessment progress",
        certifications: ["Associate-level cloud/security/domain certification", "NPTEL Elite certificate"],
      },
      {
        salary: "₹20 LPA Track",
        role: "Entry Engineer Role",
        dataFocus: "Portfolio outcomes, internship data, coding/problem-solving consistency",
        certifications: ["Foundation certification", "NPTEL/MOOC completion certificates"],
      },
    ],
    entrepreneurship: [
      {
        salary: "₹50 LPA Track",
        role: "Scalable Startup Builder",
        dataFocus: "Unit economics, growth analytics, retention dashboards",
        certifications: ["Startup India learning tracks", "Product management certification", "Cloud architecture certification"],
      },
      {
        salary: "₹30 LPA Track",
        role: "Niche Product Founder",
        dataFocus: "Problem-validation datasets, acquisition funnel analytics",
        certifications: ["Digital marketing analytics", "Agile/Scrum certification"],
      },
      {
        salary: "₹20 LPA Track",
        role: "Freelance-to-Startup Path",
        dataFocus: "Client success data, proposal conversion metrics, project profitability",
        certifications: ["Freelancing and business basics", "Domain foundation courses"],
      },
    ],
    revenue_generation: [
      {
        salary: "₹50 LPA Track",
        role: "High-ticket Consultant",
        dataFocus: "Outcome-driven case studies, ROI analytics, enterprise delivery metrics",
        certifications: ["Advanced domain certificate", "Consulting frameworks certification"],
      },
      {
        salary: "₹30 LPA Track",
        role: "Professional Freelancer",
        dataFocus: "Project throughput, quality scores, client retention stats",
        certifications: ["Intermediate domain certification", "Client communication certification"],
      },
      {
        salary: "₹20 LPA Track",
        role: "Entry Freelance Contributor",
        dataFocus: "Portfolio consistency, delivery timelines, project quality checklists",
        certifications: ["Foundation domain certification", "NPTEL/MOOC certificates"],
      },
    ],
    higher_studies: [
      {
        salary: "₹50 LPA Track",
        role: "Top University MS/Research Route",
        dataFocus: "Research papers, publication datasets, GRE/IELTS score trend data",
        certifications: ["Advanced research methods", "Domain-specialized certificates"],
      },
      {
        salary: "₹30 LPA Track",
        role: "Applied Masters Route",
        dataFocus: "Capstone project outcomes, applied research data",
        certifications: ["Domain intermediate certificates", "Academic writing certification"],
      },
      {
        salary: "₹20 LPA Track",
        role: "PG Diploma + Industry Role",
        dataFocus: "Practical project evidence, internship and upskilling datasets",
        certifications: ["Foundation certificates", "MOOC/NPTEL stack"],
      },
    ],
    govt_exams: [
      {
        salary: "₹50 LPA Track",
        role: "Senior Technical Public Sector Roles",
        dataFocus: "Exam score analytics, domain exam prep datasets, mock test benchmarks",
        certifications: ["Relevant PSU/technical exam prep credentials", "Advanced domain cert"],
      },
      {
        salary: "₹30 LPA Track",
        role: "Officer Level Technical Roles",
        dataFocus: "Topic mastery tracking, revision analytics, interview readiness metrics",
        certifications: ["Domain intermediate certification", "Aptitude and reasoning certifications"],
      },
      {
        salary: "₹20 LPA Track",
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
  const navigate = useNavigate();
  const location = useLocation();
  const { selections, setSelectedEduRevPathway, setSelectedEduRevTier } = useStudent();
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
    if (selectedPathway && selectedTier) {
      setSelectedEduRevPathway(selectedPathway);
      setSelectedEduRevTier(selectedTier);
      navigate("/edurev-overview", { state: { pathway: selectedPathway, tier: selectedTier } });
    }
  };

  return (
    <div className="py-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-semibold">Go Back</span>
        </button>

        <h1 className="text-4xl font-bold text-foreground mb-3">Choose Your Pathway</h1>
        <p className="text-lg text-muted-foreground">
          Select the pathway that best aligns with your career goals and aspirations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {pathways.map((pathway) => (
          <motion.button
            key={pathway.id}
            onClick={() => {
              if (selectedPathway !== pathway.id) {
                setSelectedTier(null);
                setSelectedEduRevTier(null);
              }
              setSelectedPathway(pathway.id);
              setSelectedEduRevPathway(pathway.id);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`text-left rounded-2xl border-2 p-6 transition-all ${
              selectedPathway === pathway.id
                ? `${pathway.borderColor} ${pathway.bgColor} ring-2 ring-primary shadow-lg`
                : `border-gray-200 bg-card hover:border-gray-300 hover:shadow-md`
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl">{pathway.icon}</span>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-foreground">{pathway.title}</h2>
                <p className="text-sm text-muted-foreground mt-2">{pathway.description}</p>
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

      {selectedPathwayMeta && (
        <div className="mb-8 rounded-2xl border border-border bg-card p-5 md:p-6">
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
            <div className="mb-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
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
                  setSelectedTier(nextTier);
                  setSelectedEduRevTier(nextTier);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    const nextTier = salaryToTierId[tier.salary];
                    setSelectedTier(nextTier);
                    setSelectedEduRevTier(nextTier);
                  }
                }}
                className={`rounded-xl border p-4 text-left transition-all hover:shadow-md cursor-pointer ${
                  selectedTier === salaryToTierId[tier.salary]
                    ? "border-primary ring-2 ring-primary/25 bg-primary/5"
                    : "border-border bg-secondary/20 hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-bold text-primary">{tier.salary}</p>
                  {selectedTier === salaryToTierId[tier.salary] && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary text-white">Selected</span>
                  )}
                </div>
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
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    const nextTier = salaryToTierId[tier.salary];
                    setSelectedTier(nextTier);
                    setSelectedEduRevTier(nextTier);
                    handleOpenTierDetail(tier);
                  }}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80"
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
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border border-border text-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <Button
          onClick={handleContinue}
          disabled={!selectedPathway || !selectedTier}
          className="inline-flex items-center gap-2 h-10 px-6 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Course Overview
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default EduRevPathway;
