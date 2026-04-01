import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Target, Award, Briefcase, ExternalLink, CalendarClock, BarChart3 } from "lucide-react";
import type { EduRevPathwayId, EduRevTierId } from "@/context/StudentContext";

type TierPlan = {
  salary: "Above ₹25 LPA Track" | "₹10-25 LPA Track" | "Up to ₹10 LPA Track";
  role: string;
  dataFocus: string;
  certifications: string[];
};

type PathwayId = EduRevPathwayId;

type TierDetailState = {
  pathwayId: PathwayId;
  selectedTier: EduRevTierId;
  pathwayTitle: string;
  minorLabel: string;
  tier: TierPlan;
  overview: string;
  parameters: string[];
  outcomes: string[];
};

const certificationLinkMap: Record<string, string> = {
  "AWS Solutions Architect Professional": "https://aws.amazon.com/certification/certified-solutions-architect-professional/",
  "AWS DevOps Engineer Professional": "https://aws.amazon.com/certification/certified-devops-engineer-professional/",
  "AWS Solutions Architect Associate": "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
  "AWS Cloud Practitioner": "https://aws.amazon.com/certification/certified-cloud-practitioner/",
  "Google Professional Cloud Architect": "https://cloud.google.com/learn/certification/cloud-architect",
  "Google Associate Cloud Engineer": "https://cloud.google.com/learn/certification/cloud-engineer",
  "Azure Administrator": "https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/",
  "Microsoft Azure Fundamentals": "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/",
  "Azure Solutions Architect Expert": "https://learn.microsoft.com/en-us/credentials/certifications/azure-solutions-architect/",
  "CKA": "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/",
  "CKAD": "https://training.linuxfoundation.org/certification/certified-kubernetes-application-developer-ckad/",
  "CKS": "https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/",
  "Docker Certified Associate": "https://www.docker.com/certification/",
  "Terraform Associate": "https://developer.hashicorp.com/certifications/terraform-associate",
  "CompTIA Security+": "https://www.comptia.org/certifications/security",
  "CompTIA CySA+": "https://www.comptia.org/certifications/cybersecurity-analyst",
  "CompTIA PenTest+": "https://www.comptia.org/certifications/pentest",
  "CISSP": "https://www.isc2.org/certifications/cissp",
  "CCSP": "https://www.isc2.org/certifications/ccsp",
  "CC (ISC2)": "https://www.isc2.org/certifications/cc",
  "CEH": "https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/",
  "OSCP": "https://www.offsec.com/courses/pen-200/",
  "CHFI": "https://www.eccouncil.org/train-certify/computer-hacking-forensic-investigator-chfi/",
  "CISA": "https://www.isaca.org/credentialing/cisa",
  "CCNA": "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccna/index.html",
  "RHCSA": "https://www.redhat.com/en/services/certification/rhcsa",
  "NPTEL Cloud Computing": "https://nptel.ac.in/",
  "NPTEL Information Security": "https://nptel.ac.in/",
  "NPTEL Cyber Security": "https://nptel.ac.in/",
  "NPTEL Ethical Hacking": "https://nptel.ac.in/",
  "TOGAF Foundation": "https://www.opengroup.org/certifications/togaf",
  "Google Cybersecurity Certificate": "https://grow.google/certificates/cybersecurity/",
};

const getCertificationUrl = (cert: string) => {
  if (certificationLinkMap[cert]) return certificationLinkMap[cert];
  return `https://www.google.com/search?q=${encodeURIComponent(`${cert} official certification`)}`;
};

const EduRevTierDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || null) as TierDetailState | null;

  if (!state) {
    return (
      <div className="py-20 max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Detailed plan not found</h1>
        <p className="text-muted-foreground mb-5">
          Please select a pathway and click a salary track card to open its detailed plan.
        </p>
        <button
          onClick={() => navigate("/edurev-pathway")}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Back to Pathway Selection
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-5xl mx-auto animate-fade-in">
      <button
        onClick={() => navigate("/edurev-pathway", { state: { selectedPathway: state.pathwayId, selectedTier: state.selectedTier } })}
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-semibold">Go Back</span>
      </button>

      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">Detailed Pathway Plan</p>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {state.pathwayTitle} • {state.tier.salary}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Minor: {state.minorLabel}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Plan Overview
            </p>
            <p className="text-sm text-muted-foreground">{state.overview}</p>
          </div>

          <div className="rounded-xl border border-border bg-secondary/20 p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Target Role
            </p>
            <p className="text-xl font-bold text-foreground">{state.tier.role}</p>
            <p className="text-sm text-muted-foreground mt-2">
              <span className="font-semibold text-foreground">Data Focus:</span> {state.tier.dataFocus}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <CalendarClock className="w-4 h-4 text-primary" />
              Suggested Timeline
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>• Month 1-2: Foundation + concept depth + baseline projects</li>
              <li>• Month 3-4: Certification preparation + mock assessments</li>
              <li>• Month 5-6: Portfolio polishing + applications/interviews</li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              KPI Checklist
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>• Weekly study consistency: 12-15 focused hours</li>
              <li>• Monthly measurable outcomes: projects/tests/cert milestones</li>
              <li>• Quarterly readiness review against your selected salary track</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <Target className="w-4 h-4 text-primary" />
              Key Parameters
            </p>
            <ul className="space-y-1.5">
              {state.parameters.map((item) => (
                <li key={item} className="text-sm text-muted-foreground">• {item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <Award className="w-4 h-4 text-primary" />
              Recommended Certifications
            </p>
            <ul className="space-y-1.5">
              {state.tier.certifications.map((item) => (
                <li key={item}>
                  <a
                    href={getCertificationUrl(item)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    {item}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <Target className="w-4 h-4 text-primary" />
              Expected Outcomes
            </p>
            <ul className="space-y-1.5">
              {state.outcomes.map((item) => (
                <li key={item} className="text-sm text-muted-foreground">• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EduRevTierDetail;
