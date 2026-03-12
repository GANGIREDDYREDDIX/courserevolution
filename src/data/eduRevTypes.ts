export type EduRevOptionType = 
  | "revenue_generation"
  | "projects"
  | "social_media"
  | "rpl"
  | "nptel_moocs"
  | "grade_upgrade"
  | "internship"
  | "cocurricular"
  | "community_service";

export interface Achievement {
  title: string;
  description: string;
  documentFile: string | null; // base64 encoded file data
  documentName: string; // original file name
  uploadedAt: string; // ISO timestamp
}

export interface EduRevSelection {
  courseId: string;
  categoryId: string;
  optionType: EduRevOptionType | null;
  achievement: Achievement | null;
  status: "draft" | "finalized";
  createdAt: string;
  updatedAt: string;
}

/**
 * EduRev options allowed for courses from completed terms.
 * Only these benefits can be applied when a student selects a course
 * they have already completed in a prior term.
 */
export const COMPLETED_TERM_ALLOWED_OPTIONS: EduRevOptionType[] = [
  "grade_upgrade",
  "rpl",
  "nptel_moocs",
];

export const EDU_REV_OPTIONS: Record<EduRevOptionType, { label: string; description: string; icon: string }> = {
  revenue_generation: {
    label: "Revenue Generation",
    description: "Earning income during studies through various activities like Open Projects, Free Lancing, Start Ups, etc.",
    icon: "💰",
  },
  projects: {
    label: "Projects",
    description: "Various projects from standardized sources that students can take up for getting hands on experience.",
    icon: "🔧",
  },
  social_media: {
    label: "Social Media Presence",
    description: "Using social media strategically to enhance academic visibility, share learning experiences, and connect with communities.",
    icon: "📱",
  },
  rpl: {
    label: "Recognition of Prior Learning (RPL)",
    description: "Extension of course exemptions to students based on prior knowledge attained by student through various means.",
    icon: "🎓",
  },
  nptel_moocs: {
    label: "NPTEL/MOOCs",
    description: "Online learning platforms that offer free or low-cost, high-quality courses from top institutions, accessible to all.",
    icon: "📋",
  },
  grade_upgrade: {
    label: "Grade Upgradation (Core/Non Core)",
    description: "Provision of improving a previously earned grade through approved academic activities like technical projects.",
    icon: "📈",
  },
  internship: {
    label: "Internship Beyond the Curriculum",
    description: "A practical work opportunity taken outside regular academic requirements, where students apply their skills.",
    icon: "💼",
  },
  cocurricular: {
    label: "Co-curricular/Extra curricular activities",
    description: "Activities outside regular academics that help build professional or academic skills such as technical workshops.",
    icon: "🤝",
  },
  community_service: {
    label: "Community Service",
    description: "Socially meaningful activities where students help communities or address social issues like education and health.",
    icon: "🏆",
  },
};
