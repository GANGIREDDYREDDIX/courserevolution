export type OutClassBenefitTemplate = {
  projectTitle?: string;
  certification?: string;
  technicalCompetition?: string;
  internship?: string;
  revenueOpportunity?: string;
  academicEquivalence?: string;
  portfolio?: string;
};

export type OutClassBenefitRow = {
  courseCode: string;
  courseName: string;
  projectTitle: string;
  certification: string;
  technicalCompetition: string;
  internship: string;
  revenueOpportunity: string;
  academicEquivalence: string;
  portfolio: string;
};

const EMPTY = "-";

const benefitTemplates = {
  foundation_programming: {
    projectTitle: "Linux Setup & Git Portfolio",
    certification: "PCEP - Python Institute",
    technicalCompetition: "Campus Coding Sprint / Hackathon",
    internship: "Internship readiness sprint",
    revenueOpportunity: "Freelance scripting ₹3k–₹8k",
    academicEquivalence: "All CAs",
    portfolio: "LinkedIn + GitHub",
  },
  internet_programming: {
    projectTitle: "Personal Website / Portfolio",
    certification: "Meta Front-End Developer (optional)",
    technicalCompetition: "Frontend UI Challenge",
    internship: "Frontend internship shortlist",
    revenueOpportunity: "Freelance website ₹5k–₹10k",
    academicEquivalence: "CA+MTT",
    portfolio: "LinkedIn + Live Website",
  },
  c_prog: {
    projectTitle: "Banking System (Console)",
    certification: "C Programming Skill Badge",
    technicalCompetition: "C Problem-Solving Challenge",
    internship: "Campus coding internship track",
    revenueOpportunity: "Console utility gigs ₹2k–₹5k",
    academicEquivalence: "CA+MTT",
    portfolio: "LinkedIn + GitHub",
  },
  cpp_oop: {
    projectTitle: "OOP Based Student Management",
    certification: "C++ Foundations",
    technicalCompetition: "OOP Design Challenge",
    internship: "C++ dev internship prep",
    revenueOpportunity: "Code support tasks ₹3k–₹6k",
    academicEquivalence: "CA+MTT+ETE",
    portfolio: "LinkedIn + GitHub",
  },
  dsa_core: {
    projectTitle: "DSA Tracker & Problem Analyzer",
    certification: "DSA Interview Prep Certificate",
    technicalCompetition: "LeetCode / CodeChef Contest Track",
    internship: "Problem-solving internship prep",
    revenueOpportunity: "Tutoring / mentoring ₹5k–₹12k",
    academicEquivalence: "CA+MTT+ETE",
    portfolio: "LinkedIn + Coding Profile",
  },
  java_oop: {
    projectTitle: "Java OOP Mini ERP",
    certification: "Oracle Java Foundations",
    technicalCompetition: "Java Coding Sprint",
    internship: "Java backend internship prep",
    revenueOpportunity: "Java mini projects ₹6k–₹15k",
    academicEquivalence: "CA+MTT+ETE",
    portfolio: "LinkedIn + GitHub",
  },
  python_programming: {
    projectTitle: "Python Automation Toolkit",
    certification: "PCAP / Python Skill Certificate",
    technicalCompetition: "Python Hackathon",
    internship: "Automation internship ₹8k–₹15k",
    revenueOpportunity: "Script gigs ₹3k–₹8k",
    academicEquivalence: "CA+MTT+ETE",
    portfolio: "LinkedIn + GitHub",
  },
  software_engineering: {
    projectTitle: "SaaS Requirement Doc + SDLC Artifact",
    certification: "Software Engineering Essentials",
    technicalCompetition: "System Design Challenge",
    internship: "Product engineering internship",
    revenueOpportunity: "Requirement consulting ₹5k–₹12k",
    academicEquivalence: "CA+MTT",
    portfolio: "LinkedIn + Case Study",
  },
  dbms: {
    projectTitle: "SQL Mini ERP",
    certification: "Oracle SQL (education.oracle.com)",
    technicalCompetition: "Database Queryathon",
    internship: "Startup intern ₹8k–₹12k",
    revenueOpportunity: "DB projects ₹10k",
    academicEquivalence: "CA+MTT+ETE",
    portfolio: "LinkedIn + GitHub",
  },
  networks: {
    projectTitle: "Network Monitoring Lab Project",
    certification: "CCNA / Networking Fundamentals",
    technicalCompetition: "Network Security CTF",
    internship: "NOC internship ₹8k–₹14k",
    revenueOpportunity: "Network setup gigs ₹5k–₹20k",
    academicEquivalence: "CA+MTT+ETE",
    portfolio: "LinkedIn + Lab Report",
  },
  theory_comp: {
    projectTitle: "Automata Visualizer",
    certification: "Theory of Computation Micro-Credential",
    technicalCompetition: "Theory Challenge Contest",
    internship: "Core CS prep internship",
    revenueOpportunity: "Academic tutoring ₹4k–₹10k",
    academicEquivalence: "CA+MTT",
    portfolio: "LinkedIn + Notes Repository",
  },
  compiler_design: {
    projectTitle: "Mini Compiler / Lexer Parser",
    certification: "Compiler Design Badge",
    technicalCompetition: "Compiler Buildathon",
    internship: "System software internship",
    revenueOpportunity: "Tooling plugins ₹8k–₹18k",
    academicEquivalence: "CA+MTT+ETE",
    portfolio: "LinkedIn + GitHub",
  },
  cloud_fundamentals: {
    projectTitle: "Cloud Deployment Starter",
    certification: "AWS CCP / Azure Fundamentals",
    technicalCompetition: "Cloud Build Challenge",
    internship: "Cloud intern ₹10k–₹20k",
    revenueOpportunity: "Cloud deployment services ₹10k–₹25k",
    academicEquivalence: "CA+MTT+ETE",
    portfolio: "LinkedIn + Architecture Sheet",
  },
  coa: {
    projectTitle: "CPU Architecture Simulator",
    certification: "Computer Architecture Fundamentals",
    technicalCompetition: "Architecture Design Contest",
    internship: "Embedded / system intern",
    revenueOpportunity: "Academic tutoring ₹4k–₹10k",
    academicEquivalence: "CA+MTT",
    portfolio: "LinkedIn + Project Report",
  },
  operating_systems: {
    projectTitle: "Process Scheduler Visualizer",
    certification: "Operating Systems Fundamentals",
    technicalCompetition: "OS Debugging Challenge",
    internship: "System engineering intern ₹8k–₹16k",
    revenueOpportunity: "Linux support gigs ₹6k–₹15k",
    academicEquivalence: "CA+MTT+ETE",
    portfolio: "LinkedIn + GitHub",
  },
  algorithm_design: {
    projectTitle: "Algorithm Benchmark Dashboard",
    certification: "Algorithmic Thinking Badge",
    technicalCompetition: "Algorithm Contest Track",
    internship: "SDE intern prep",
    revenueOpportunity: "Competitive coding mentorship ₹5k–₹12k",
    academicEquivalence: "CA+MTT+ETE",
    portfolio: "LinkedIn + Coding Profile",
  },
  web_application_dev: {
    projectTitle: "Full-Stack Web Application",
    certification: "Full Stack Developer Certificate",
    technicalCompetition: "Web Build Hackathon",
    internship: "Web dev intern ₹10k–₹18k",
    revenueOpportunity: "Client web apps ₹12k–₹40k",
    academicEquivalence: "CA+MTT+ETE",
    portfolio: "LinkedIn + Live Website",
  },
  machine_learning: {
    projectTitle: "ML Model Development",
    certification: "Google ML / TensorFlow Basics",
    technicalCompetition: "Kaggle / ML Hackathon",
    internship: "Data/ML intern ₹12k–₹25k",
    revenueOpportunity: "Model prototyping ₹15k–₹40k",
    academicEquivalence: "CA+MTT+ETE",
    portfolio: "LinkedIn + Kaggle + GitHub",
  },
  info_security: {
    projectTitle: "Security Audit Checklist Tool",
    certification: "Security+ / ISO 27001 Basics",
    technicalCompetition: "Cyber CTF",
    internship: "Security intern ₹10k–₹20k",
    revenueOpportunity: "Security assessment gigs ₹15k+",
    academicEquivalence: "CA+MTT",
    portfolio: "LinkedIn + Security Report",
  },
  testing_qa: {
    projectTitle: "Automation Test Suite",
    certification: "ISTQB Foundation",
    technicalCompetition: "Bug Bash / QA Challenge",
    internship: "QA intern ₹8k–₹16k",
    revenueOpportunity: "Testing freelance tasks ₹6k–₹15k",
    academicEquivalence: "CA+MTT",
    portfolio: "LinkedIn + Test Artifacts",
  },
  ai_advanced: {
    projectTitle: "AI Capstone Prototype",
    certification: "AI Practitioner Certificate",
    technicalCompetition: "AI Innovation Challenge",
    internship: "AI engineer intern ₹15k–₹30k",
    revenueOpportunity: "AI solution consulting ₹20k+",
    academicEquivalence: "CA+ETE",
    portfolio: "LinkedIn + GitHub",
  },
  industrial_project: {
    projectTitle: "Industry Sponsored Mini Project",
    certification: "Industry Project Completion Badge",
    technicalCompetition: "Industry Demo Day",
    internship: "Industry collaboration track",
    revenueOpportunity: "Project outsourcing ₹20k+",
    academicEquivalence: "CA+ETE",
    portfolio: "LinkedIn + Project Portfolio",
  },
  mathematics: {
    projectTitle: "Quantitative Analysis Mini Project",
    certification: "Mathematics for Computing Badge",
    technicalCompetition: "Math Modelling Challenge",
    internship: "Research assistantship",
    revenueOpportunity: "Quant tutoring ₹3k–₹10k",
    academicEquivalence: "≥ A grade",
    portfolio: "LinkedIn",
  },
  science_core: {
    projectTitle: "Applied Science Lab Artifact",
    certification: "Lab Safety & Scientific Methods",
    technicalCompetition: "Science Innovation Challenge",
    internship: "Research / lab internship",
    revenueOpportunity: "Academic content support ₹2k–₹6k",
    academicEquivalence: "CA+MTT",
    portfolio: "LinkedIn",
  },
  engineering_workshop: {
    projectTitle: "Electrical Workshop Practical Portfolio",
    certification: "Workshop Skills Badge",
    technicalCompetition: "Hardware Build Challenge",
    internship: "Lab / workshop assistantship",
    revenueOpportunity: "Basic hardware service gigs ₹3k–₹8k",
    academicEquivalence: "CA",
    portfolio: "LinkedIn",
  },
  graphics_design: {
    projectTitle: "CAD Design Portfolio",
    certification: "AutoCAD Essentials",
    technicalCompetition: "Design Sprint",
    internship: "Design intern track",
    revenueOpportunity: "CAD drafting gigs ₹5k–₹15k",
    academicEquivalence: "CA+MTT",
    portfolio: "LinkedIn + Behance",
  },
  statistics: {
    projectTitle: "Statistical Dashboard",
    certification: "Data Analytics Foundations",
    technicalCompetition: "Data Storytelling Challenge",
    internship: "Analytics assistantship",
    revenueOpportunity: "Data report projects ₹8k–₹20k",
    academicEquivalence: "CA+MTT",
    portfolio: "LinkedIn + Dashboard",
  },
  discrete_math: {
    projectTitle: "Graph Theory Applications Project",
    certification: "Discrete Math Badge",
    technicalCompetition: "Logic Challenge",
    internship: "Core CS research support",
    revenueOpportunity: "Tutoring ₹3k–₹8k",
    academicEquivalence: "CA+MTT",
    portfolio: "LinkedIn",
  },
  cloud_minor: {
    projectTitle: "Cloud-Native Implementation",
    certification: "AWS/Azure Associate Track",
    technicalCompetition: "Cloud Architecture Hackathon",
    internship: "Cloud intern ₹12k–₹30k",
    revenueOpportunity: "Cloud migration gigs ₹20k+",
    academicEquivalence: "CA+MTT+ETE",
    portfolio: "LinkedIn + Architecture Portfolio",
  },
  cyber_minor: {
    projectTitle: "Security Operations Lab",
    certification: "CEH / Security Analyst Track",
    technicalCompetition: "CTF Competitions",
    internship: "Cyber security intern ₹12k–₹28k",
    revenueOpportunity: "Security audit gigs ₹20k+",
    academicEquivalence: "CA+MTT+ETE",
    portfolio: "LinkedIn + Security Portfolio",
  },
  data_science_minor: {
    projectTitle: "Data Pipeline & BI Project",
    certification: "Google Data Analytics / Power BI",
    technicalCompetition: "Data Hackathon",
    internship: "Data analyst intern ₹12k–₹25k",
    revenueOpportunity: "BI dashboard gigs ₹15k+",
    academicEquivalence: "CA+MTT+ETE",
    portfolio: "LinkedIn + Kaggle + GitHub",
  },
  ml_minor: {
    projectTitle: "Advanced ML Deployment Project",
    certification: "ML Engineer Associate Track",
    technicalCompetition: "ML Modelathon",
    internship: "ML engineer intern ₹15k–₹30k",
    revenueOpportunity: "ML consulting ₹25k+",
    academicEquivalence: "CA+MTT+ETE",
    portfolio: "LinkedIn + GitHub + Kaggle",
  },
  qe_minor: {
    projectTitle: "Automation Framework Suite",
    certification: "ISTQB + Selenium Track",
    technicalCompetition: "QA Automation Challenge",
    internship: "QA automation intern ₹10k–₹20k",
    revenueOpportunity: "Automation setup gigs ₹12k+",
    academicEquivalence: "CA+MTT+ETE",
    portfolio: "LinkedIn + QA Portfolio",
  },
  fsw_minor: {
    projectTitle: "Scalable Full-Stack Product",
    certification: "MERN / Full Stack Track",
    technicalCompetition: "Web Product Hackathon",
    internship: "Full-stack intern ₹12k–₹25k",
    revenueOpportunity: "Client app development ₹20k+",
    academicEquivalence: "CA+MTT+ETE",
    portfolio: "LinkedIn + Live Product",
  },
  communication_language: {
    projectTitle: "Professional Communication Portfolio",
    certification: "Business Communication Certificate",
    technicalCompetition: "Public Speaking / Debate",
    internship: "Client communication support role",
    revenueOpportunity: "Content writing / communication gigs ₹3k–₹12k",
    academicEquivalence: "CA+MTT",
    portfolio: "LinkedIn",
  },
  capstone_project: {
    projectTitle: "Capstone Industry Problem Statement",
    certification: "Capstone Completion Credential",
    technicalCompetition: "Project Expo / Innovation Day",
    internship: "Pre-placement project conversion",
    revenueOpportunity: "Prototype commercialization",
    academicEquivalence: "Major Project Evaluation",
    portfolio: "LinkedIn + Project Portfolio",
  },
  community_project: {
    projectTitle: "Community Impact Solution",
    certification: "Social Innovation Badge",
    technicalCompetition: "Civic Tech Challenge",
    internship: "NGO / social internship",
    revenueOpportunity: "Grant-based implementation",
    academicEquivalence: "Community Impact Credits",
    portfolio: "LinkedIn + Impact Report",
  },
  environmental_science: {
    projectTitle: "Sustainability Audit Mini Project",
    certification: "ESG / Sustainability Basics",
    technicalCompetition: "Green Innovation Challenge",
    internship: "Environment compliance intern",
    revenueOpportunity: "Sustainability consultancy support",
    academicEquivalence: "CA+MTT",
    portfolio: "LinkedIn",
  },
  summer_training: {
    projectTitle: "Summer Industrial Training Report",
    certification: "Industry Training Completion",
    technicalCompetition: "Internship Demo Day",
    internship: "Industrial training (core)",
    revenueOpportunity: "Stipend-based training",
    academicEquivalence: "Training Evaluation",
    portfolio: "LinkedIn + Training Report",
  },
  dept_elective: {
    projectTitle: "Department Elective Application Project",
    certification: "Elective Domain Badge",
    technicalCompetition: "Department Tech Contest",
    internship: "Domain elective internship",
    revenueOpportunity: "Specialized freelance tasks",
    academicEquivalence: "CA+MTT",
    portfolio: "LinkedIn + GitHub",
  },
  seminar: {
    projectTitle: "Technical Seminar Deck + Demo",
    certification: "Technical Presentation Badge",
    technicalCompetition: "Seminar Showcase",
    internship: "Research presentation support",
    revenueOpportunity: "Tech content sessions",
    academicEquivalence: "Seminar Evaluation",
    portfolio: "LinkedIn + Slides",
  },
  aptitude_track: {
    projectTitle: "Aptitude Problem Bank Toolkit",
    certification: "Aptitude Mastery Badge",
    technicalCompetition: "Quant Challenge",
    internship: "Placement prep cohort",
    revenueOpportunity: "Aptitude mentoring ₹4k–₹10k",
    academicEquivalence: "CA+MTT",
    portfolio: "LinkedIn",
  },
  pathway_professional: {
    projectTitle: "Professional Enhancement Plan",
    certification: "Professional Readiness Badge",
    technicalCompetition: "Career Readiness Sprint",
    internship: "Placement readiness internship",
    revenueOpportunity: "Freelance profile optimization",
    academicEquivalence: "CA+MTT",
    portfolio: "LinkedIn + Resume",
  },
  pathway_cloud: {
    projectTitle: "Cloud Architecture Blueprint",
    certification: "Cloud Architect Foundations",
    technicalCompetition: "Cloud Case Challenge",
    internship: "Cloud solution intern",
    revenueOpportunity: "Cloud consulting starter projects",
    academicEquivalence: "CA+MTT+ETE",
    portfolio: "LinkedIn + Architecture Portfolio",
  },
  pathway_devops: {
    projectTitle: "DevOps Toolchain Implementation",
    certification: "Docker/K8s Foundations",
    technicalCompetition: "DevOps Pipeline Challenge",
    internship: "DevOps intern ₹12k–₹24k",
    revenueOpportunity: "CI/CD setup gigs ₹15k+",
    academicEquivalence: "CA+MTT+ETE",
    portfolio: "LinkedIn + GitHub",
  },
  pathway_data_analytics: {
    projectTitle: "Data Analytics Dashboard",
    certification: "Power BI / Data Analytics Track",
    technicalCompetition: "Analytics Hackathon",
    internship: "Data analytics intern ₹12k–₹22k",
    revenueOpportunity: "Dashboard freelancing ₹10k+",
    academicEquivalence: "CA+MTT+ETE",
    portfolio: "LinkedIn + Dashboard Portfolio",
  },
  open_minor: {
    projectTitle: "Open Minor Innovation Task",
    certification: "Minor Domain Certification",
    technicalCompetition: "Open Innovation Challenge",
    internship: "Domain internship opportunity",
    revenueOpportunity: "Domain-specific freelance tasks",
    academicEquivalence: "CA+MTT",
    portfolio: "LinkedIn",
  },
} as const;

type TemplateKey = keyof typeof benefitTemplates;

const courseBenefitTemplateByCode: Record<string, TemplateKey> = {
  CSE111: "foundation_programming",
  CSE326: "internet_programming",
  CSE101: "c_prog",
  CSE121: "cpp_oop",
  CSE202: "dsa_core",
  CSE205: "java_oop",
  CSE310: "python_programming",

  INT108: "foundation_programming",
  CSE320: "software_engineering",
  INT306: "dbms",
  CSE306: "networks",
  CSE307: "theory_comp",
  CSE423: "compiler_design",
  INT335: "cloud_fundamentals",
  CSE211: "coa",
  CSE316: "operating_systems",
  CSE325: "algorithm_design",
  INT428: "web_application_dev",
  CSE333: "machine_learning",
  CSE343: "info_security",
  CSE322: "testing_qa",
  CSE435: "ai_advanced",
  INT411: "industrial_project",

  MTH165: "mathematics",
  CHE110: "science_core",
  ECE249: "science_core",
  ECE279: "engineering_workshop",
  PHY110: "science_core",
  MEC136: "graphics_design",
  MTH166: "mathematics",
  MTH401: "statistics",
  MTH302: "discrete_math",

  INT330: "cloud_minor",
  INT362: "cloud_minor",
  INT363: "cloud_minor",
  INT364: "cloud_minor",
  INT327: "cloud_minor",
  INT328: "cloud_minor",

  CYS301: "cyber_minor",
  CYS322: "cyber_minor",
  CYS333: "cyber_minor",
  CYS344: "cyber_minor",
  CYS355: "cyber_minor",
  CYS366: "cyber_minor",

  DST301: "data_science_minor",
  DST312: "data_science_minor",
  DST323: "data_science_minor",
  DST334: "data_science_minor",
  DST345: "data_science_minor",
  DST356: "data_science_minor",

  ML301: "ml_minor",
  ML312: "ml_minor",
  ML323: "ml_minor",
  ML334: "ml_minor",
  ML345: "ml_minor",
  ML356: "ml_minor",

  QEA301: "qe_minor",
  QEA312: "qe_minor",
  QEA323: "qe_minor",
  QEA334: "qe_minor",
  QEA345: "qe_minor",
  QEA356: "qe_minor",

  FSW301: "fsw_minor",
  FSW312: "fsw_minor",
  FSW323: "fsw_minor",
  FSW334: "fsw_minor",
  FSW345: "fsw_minor",
  FSW356: "fsw_minor",

  FRN601: "communication_language",
  FRN602: "communication_language",

  CSE339: "capstone_project",
  CSE439: "capstone_project",
  GEN231: "community_project",
  PES390: "environmental_science",
  CSE408: "summer_training",
  CSE393: "dept_elective",
  CSE496: "seminar",
  PEA306: "aptitude_track",
  PEA305: "pathway_professional",
  CSE332: "pathway_cloud",
  CSE334: "pathway_devops",
  INT416: "pathway_data_analytics",

  "—": "open_minor",
};

const courseBenefitOverrides: Partial<Record<string, OutClassBenefitTemplate>> = {
  CSE111: {
    projectTitle: "Linux Setup & Git Portfolio",
    revenueOpportunity: "Freelance setup support ₹3k–₹8k",
  },
  INT108: {
    certification: "PCEP - Python Institute",
  },
  INT306: {
    projectTitle: "SQL Mini ERP",
    certification: "Oracle SQL (education.oracle.com)",
    internship: "Startup intern ₹8k–₹12k",
    revenueOpportunity: "DB projects ₹10k",
  },
  CSE408: {
    internship: "Summer industrial training ₹8k–₹20k",
  },
};

const normalize = (value?: string) => value?.trim() || EMPTY;

const inferTemplateByCode = (courseCode: string): TemplateKey => {
  if (courseCode.startsWith("CYS")) return "cyber_minor";
  if (courseCode.startsWith("DST")) return "data_science_minor";
  if (courseCode.startsWith("ML")) return "ml_minor";
  if (courseCode.startsWith("QEA")) return "qe_minor";
  if (courseCode.startsWith("FSW")) return "fsw_minor";
  if (courseCode.startsWith("INT")) return "cloud_fundamentals";
  if (courseCode.startsWith("MTH")) return "mathematics";
  if (courseCode.startsWith("CSE")) return "software_engineering";
  return "open_minor";
};

const buildFallbackBenefits = (courseCode: string): OutClassBenefitTemplate => {
  const template = benefitTemplates[inferTemplateByCode(courseCode)];
  return {
    ...template,
    projectTitle: `${courseCode} Applied Mini Project`,
  };
};

export const resolveOutClassBenefitsForCourse = (courseCode: string, courseName: string): OutClassBenefitRow => {
  const templateKey = courseBenefitTemplateByCode[courseCode] || inferTemplateByCode(courseCode);
  const base = benefitTemplates[templateKey] || buildFallbackBenefits(courseCode);
  const merged = { ...base, ...(courseBenefitOverrides[courseCode] || {}) };

  return {
    courseCode,
    courseName,
    projectTitle: normalize(merged.projectTitle),
    certification: normalize(merged.certification),
    technicalCompetition: normalize(merged.technicalCompetition),
    internship: normalize(merged.internship),
    revenueOpportunity: normalize(merged.revenueOpportunity),
    academicEquivalence: normalize(merged.academicEquivalence),
    portfolio: normalize(merged.portfolio || "LinkedIn"),
  };
};

export const buildOutClassBenefitRows = (
  courses: Array<{ courseCode: string; name: string }>
): OutClassBenefitRow[] => {
  return courses.map((course) => resolveOutClassBenefitsForCourse(course.courseCode, course.name));
};
