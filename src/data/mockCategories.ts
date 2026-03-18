export interface Course {
  id: string;
  categoryId: string;
  name: string;
  courseCode: string;   // "—" for open-minor placeholder slots
  credits: number;
  term: number;         // 1–8 (academic term across all years)
  yearLabel: string;    // e.g. "Year 1 Sem 1"
  L: number;
  T: number;
  P: number;
}

export interface Category {
  id: string;
  name: string;
  code: string;
  colorKey: string;
  maxCredits: number;
  courses: Course[];
  isElective?: boolean;
}

function getTermLabel(term: number): string {
  const year = Math.ceil(term / 2);
  const sem = term % 2 === 1 ? 1 : 2;
  return `Year ${year} Sem ${sem}`;
}

const c = (id: string, catId: string, name: string, code: string, cr: number, term: number, L: number, T: number, P: number): Course => ({
  id, categoryId: catId, name, courseCode: code, credits: cr, term, yearLabel: getTermLabel(term), L, T, P,
});

/* ── P132 · B.Tech CSE — Cloud Computing / Engineering Minor ── */

export const mockCategories: Category[] = [
  /* ── 1. Programming Courses (PROG) ── 7 courses · 26 credits ── */
  {
    id: "cat-1", name: "Programming Courses", code: "PROG", colorKey: "purple", maxCredits: 26,
    courses: [
      c("prog-1","cat-1","Computer Programming","CSE111",4,1,3,0,2),
      c("prog-2","cat-1","Internet Programming","CSE326",3,1,2,0,2),
      c("prog-3","cat-1","Problem Solving with C","CSE101",4,2,3,0,2),
      c("prog-4","cat-1","Object-Oriented Programming with C++","CSE121",4,2,3,0,2),
      c("prog-5","cat-1","Data Structures & Algorithms","CSE202",4,3,3,0,2),
      c("prog-6","cat-1","Object-Oriented Programming with Java","CSE205",4,3,3,0,2),
      c("prog-7","cat-1","Programming in Python","CSE310",3,4,2,0,2),
    ],
  },

  /* ── 2. Technology Courses (TECH) ── 16 courses · 43 credits ── */
  {
    id: "cat-2", name: "Technology Courses", code: "TECH", colorKey: "blue", maxCredits: 43,
    courses: [
      c("tech-1", "cat-2","Introduction to Computer Science & IT","INT108",3,1,2,0,2),
      c("tech-2", "cat-2","Software Engineering","CSE320",3,2,2,0,2),
      c("tech-3", "cat-2","Database Management Systems","INT306",3,2,2,0,2),
      c("tech-4", "cat-2","Computer Networks","CSE306",3,3,2,0,2),
      c("tech-5", "cat-2","Theory of Computation","CSE307",2,3,2,0,0),
      c("tech-6", "cat-2","Compiler Design","CSE423",3,3,2,0,2),
      c("tech-7", "cat-2","Cloud Computing Fundamentals","INT335",3,3,2,0,2),
      c("tech-8", "cat-2","Computer Organization & Architecture","CSE211",3,4,2,0,2),
      c("tech-9", "cat-2","Operating Systems","CSE316",3,4,2,0,2),
      c("tech-10","cat-2","Algorithm Design & Analysis","CSE325",3,4,2,0,2),
      c("tech-11","cat-2","Web Application Development","INT428",3,4,2,0,2),
      c("tech-12","cat-2","Machine Learning","CSE333",3,5,2,0,2),
      c("tech-13","cat-2","Information Security","CSE343",2,5,2,0,0),
      c("tech-14","cat-2","Software Testing & Quality Assurance","CSE322",2,6,2,0,0),
      c("tech-15","cat-2","Artificial Intelligence","CSE435",2,8,2,0,0),
      c("tech-16","cat-2","Industrial Project","INT411",2,8,0,0,4),
    ],
  },

  /* ── 3. Basic Science (BSC) ── 9 courses · 25 credits ── */
  {
    id: "cat-3", name: "Basic Science", code: "BSC", colorKey: "charcoal", maxCredits: 25,
    courses: [
      c("bsc-1","cat-3","Mathematics I — Calculus & Differential Equations","MTH165",3,1,3,1,0),
      c("bsc-2","cat-3","Applied Chemistry","CHE110",3,1,2,0,2),
      c("bsc-3","cat-3","Basic Electrical Engineering","ECE249",3,1,2,0,2),
      c("bsc-4","cat-3","Electrical Workshop Practice","ECE279",2,1,0,0,4),
      c("bsc-5","cat-3","Applied Physics","PHY110",3,2,2,0,2),
      c("bsc-6","cat-3","Engineering Graphics & Design","MEC136",3,2,1,0,4),
      c("bsc-7","cat-3","Mathematics II — Linear Algebra & Complex Analysis","MTH166",3,2,3,1,0),
      c("bsc-8","cat-3","Probability & Statistics","MTH401",3,3,3,0,0),
      c("bsc-9","cat-3","Discrete Mathematics","MTH302",2,4,2,0,0),
    ],
  },

  /* ── 4. Engineering Minor — Multiple Pathways (EM) ── Select one pathway · 18 credits ── */
  {
    id: "cat-4", name: "Engineering Minor", code: "EM", colorKey: "orange", maxCredits: 18, isElective: true,
    courses: [
      // Cloud Computing pathway
      c("em-cloud-1","cat-4","Cloud Infrastructure & Services","INT330",3,4,2,0,2),
      c("em-cloud-2","cat-4","Cloud-Native Application Development","INT362",3,5,2,0,2),
      c("em-cloud-3","cat-4","Virtualization & Container Technology","INT363",3,5,2,0,2),
      c("em-cloud-4","cat-4","DevOps Engineering","INT364",3,6,2,0,2),
      c("em-cloud-5","cat-4","Cloud Security & Governance","INT327",3,6,2,0,2),
      c("em-cloud-6","cat-4","Cloud Architecture & Design Patterns","INT328",3,7,2,0,2),

      // Cyber Security pathway
      c("em-cyber-1","cat-4","Cyber Security Fundamentals","CYS301",3,4,2,0,2),
      c("em-cyber-2","cat-4","Ethical Hacking & Penetration Testing","CYS322",3,5,2,0,2),
      c("em-cyber-3","cat-4","Network Security Engineering","CYS333",3,5,2,0,2),
      c("em-cyber-4","cat-4","Application Security","CYS344",3,6,2,0,2),
      c("em-cyber-5","cat-4","Digital Forensics","CYS355",3,6,2,0,2),
      c("em-cyber-6","cat-4","Security Operations & Incident Response","CYS366",3,7,2,0,2),

      // Data Science pathway
      c("em-data-1","cat-4","Data Science Foundations","DST301",3,4,2,0,2),
      c("em-data-2","cat-4","Data Wrangling & Visualization","DST312",3,5,2,0,2),
      c("em-data-3","cat-4","Statistical Learning","DST323",3,5,2,0,2),
      c("em-data-4","cat-4","Big Data Technologies","DST334",3,6,2,0,2),
      c("em-data-5","cat-4","Data Mining","DST345",3,6,2,0,2),
      c("em-data-6","cat-4","Business Analytics & Decision Science","DST356",3,7,2,0,2),

      // Machine Learning pathway
      c("em-ml-1","cat-4","Machine Learning Fundamentals","ML301",3,4,2,0,2),
      c("em-ml-2","cat-4","Supervised Learning Techniques","ML312",3,5,2,0,2),
      c("em-ml-3","cat-4","Deep Learning","ML323",3,5,2,0,2),
      c("em-ml-4","cat-4","Natural Language Processing","ML334",3,6,2,0,2),
      c("em-ml-5","cat-4","Computer Vision","ML345",3,6,2,0,2),
      c("em-ml-6","cat-4","MLOps & Model Deployment","ML356",3,7,2,0,2),

      // Quality Engineering and Test Automation pathway
      c("em-qe-1","cat-4","Software Quality Engineering","QEA301",3,4,2,0,2),
      c("em-qe-2","cat-4","Test Design Techniques","QEA312",3,5,2,0,2),
      c("em-qe-3","cat-4","Automation Testing with Selenium","QEA323",3,5,2,0,2),
      c("em-qe-4","cat-4","API Testing & Performance Testing","QEA334",3,6,2,0,2),
      c("em-qe-5","cat-4","CI/CD for Test Automation","QEA345",3,6,2,0,2),
      c("em-qe-6","cat-4","Quality Metrics & Process Improvement","QEA356",3,7,2,0,2),

      // Full Stack Web Development pathway
      c("em-fullstack-1","cat-4","Front-End Engineering","FSW301",3,4,2,0,2),
      c("em-fullstack-2","cat-4","Back-End Development","FSW312",3,5,2,0,2),
      c("em-fullstack-3","cat-4","Database Design for Web Apps","FSW323",3,5,2,0,2),
      c("em-fullstack-4","cat-4","REST & GraphQL APIs","FSW334",3,6,2,0,2),
      c("em-fullstack-5","cat-4","Web Security & Authentication","FSW345",3,6,2,0,2),
      c("em-fullstack-6","cat-4","Scalable Full Stack Project","FSW356",3,7,2,0,2),
    ],
  },

  /* ── 5. Open Minor (OEM) ── 4 courses · 9 credits ── */
  {
    id: "cat-5", name: "Open Minor", code: "OEM", colorKey: "teal", maxCredits: 9, isElective: true,
    courses: [
      c("oem-1","cat-5","Open Minor Elective I","—",2,5,2,0,0),
      c("oem-2","cat-5","Open Minor Elective II","—",2,6,2,0,0),
      c("oem-3","cat-5","Open Minor Elective III","—",2,7,2,0,0),
      c("oem-4","cat-5","Open Minor Elective IV","—",3,8,2,0,2),
    ],
  },

  /* ── 6. Language Courses (LCS) ── 2 courses · 6 credits ── */
  {
    id: "cat-6", name: "Language Courses", code: "LCS", colorKey: "navy", maxCredits: 6,
    courses: [
      c("lcs-1","cat-6","Communication English","FRN601",3,2,3,0,0),
      c("lcs-2","cat-6","Advanced English Communication","FRN602",3,3,3,0,0),
    ],
  },

  /* ── 7. Capstone Project (PRJ) ── 2 courses · 10 credits ── */
  {
    id: "cat-7", name: "Capstone Project", code: "PRJ", colorKey: "red", maxCredits: 10,
    courses: [
      c("prj-1","cat-7","Capstone Project I","CSE339",2,7,0,0,4),
      c("prj-2","cat-7","Capstone Project II","CSE439",8,8,0,0,16),
    ],
  },

  /* ── 8. Community Project (PRC) ── 1 course · 2 credits ── */
  {
    id: "cat-8", name: "Community Project", code: "PRC", colorKey: "green", maxCredits: 2,
    courses: [
      c("prc-1","cat-8","Community Development Project","GEN231",2,3,0,0,4),
    ],
  },

  /* ── 9. Engineering Science (ESC) ── 1 course · 3 credits ── */
  {
    id: "cat-9", name: "Engineering Science", code: "ESC", colorKey: "cyan", maxCredits: 3,
    courses: [
      c("esc-1","cat-9","Environmental Science & Engineering","PES390",3,6,3,0,0),
    ],
  },

  /* ── 10. Summer Training (ICS) ── 1 course · 3 credits ── */
  {
    id: "cat-10", name: "Summer Training", code: "ICS", colorKey: "gold", maxCredits: 3,
    courses: [
      c("tcs-1","cat-10","Summer Industrial Training","CSE408",3,5,0,0,6),
    ],
  },

  /* ── 11. Department Elective (DE) ── 1 course · 2 credits ── */
  {
    id: "cat-11", name: "Department Elective", code: "DE", colorKey: "slate", maxCredits: 2, isElective: true,
    courses: [
      c("de-1","cat-11","Department Elective","CSE393",2,7,2,0,0),
    ],
  },

  /* ── 12. Seminar (SMN) ── 1 course · 1 credit ── */
  {
    id: "cat-12", name: "Seminar", code: "SMN", colorKey: "yellow", maxCredits: 1,
    courses: [
      c("smn-1","cat-12","Technical Seminar","CSE496",1,7,0,0,2),
    ],
  },

  /* ── 13. Aptitude Elective (EEA) ── 1 course · 3 credits ── */
  {
    id: "cat-13", name: "Aptitude Elective", code: "EEA", colorKey: "rose", maxCredits: 3, isElective: true,
    courses: [
      c("eea-1","cat-13","Quantitative Aptitude & Reasoning","PEA306",3,5,3,0,0),
    ],
  },

  /* ── 14. Pathway Courses (PWE) ── 4 courses · 13 credits ── */
  {
    id: "cat-14", name: "Pathway Courses", code: "PWE", colorKey: "lime", maxCredits: 13, isElective: true,
    courses: [
      c("pwe-1","cat-14","Professional Enhancement Programme","PEA305",3,4,3,0,0),
      c("pwe-2","cat-14","Pathway Elective I — Cloud Architecture","CSE332",3,5,2,0,2),
      c("pwe-3","cat-14","Pathway Elective II — DevOps Tools","CSE334",4,6,3,0,2),
      c("pwe-4","cat-14","Pathway Elective III — Data Analytics","INT416",3,8,2,0,2),
    ],
  },
];
