export interface Course {
  id: string;
  categoryId: string;
  name: string;
  courseCode: string;
  credits: number;
  term: number;       // 1–8 (academic term across all years)
  yearLabel: string;  // e.g. "Year 1 Sem 1"
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
}

function getTermLabel(term: number): string {
  const year = Math.ceil(term / 2);
  const sem = term % 2 === 1 ? 1 : 2;
  return `Year ${year} Sem ${sem}`;
}

const c = (id: string, catId: string, name: string, code: string, cr: number, term: number, L: number, T: number, P: number): Course => ({
  id, categoryId: catId, name, courseCode: code, credits: cr, term, yearLabel: getTermLabel(term), L, T, P,
});

export const mockCategories: Category[] = [
  {
    id: "cat-1", name: "Core Computing", code: "CC", colorKey: "purple", maxCredits: 18,
    courses: [
      c("cc-1","cat-1","Computer Programming","CSC 101",4,1,3,0,2),
      c("cc-2","cat-1","Data Structures & Algorithms","CSC 201",4,3,3,1,2),
      c("cc-3","cat-1","Operating Systems","CSC 303",3,4,3,0,1),
      c("cc-4","cat-1","Computer Networks","CSC 305",3,5,2,1,1),
      c("cc-5","cat-1","Software Engineering","CSC 309",3,6,2,1,1),
      c("cc-6","cat-1","Compiler Design","CSC 311",3,7,2,1,1),
    ],
  },
  {
    id: "cat-2", name: "Mathematics & Logic", code: "ML", colorKey: "charcoal", maxCredits: 12,
    courses: [
      c("ml-1","cat-2","Calculus & Linear Algebra","MTH 101",3,1,3,1,0),
      c("ml-2","cat-2","Discrete Mathematics","MTH 201",3,2,3,1,0),
      c("ml-3","cat-2","Numerical Methods","MTH 301",3,3,2,1,0),
      c("ml-4","cat-2","Probability & Statistics","MTH 401",3,5,2,1,0),
    ],
  },
  {
    id: "cat-3", name: "Systems & Architecture", code: "SA", colorKey: "blue", maxCredits: 12,
    courses: [
      c("sa-1","cat-3","Digital Logic Design","CSC 121",3,2,2,0,2),
      c("sa-2","cat-3","Microprocessor Systems","CSC 321",3,4,2,0,2),
      c("sa-3","cat-3","Embedded Systems","CSC 323",3,5,2,0,2),
      c("sa-4","cat-3","Cloud Computing","CSC 327",3,7,2,0,2),
    ],
  },
  {
    id: "cat-4", name: "AI & Machine Learning", code: "AI", colorKey: "orange", maxCredits: 12,
    courses: [
      c("ai-1","cat-4","Intro to AI","CSC 241",3,3,2,1,1),
      c("ai-2","cat-4","Machine Learning","CSC 343",4,6,2,1,2),
      c("ai-3","cat-4","Natural Language Processing","CSC 345",3,7,2,0,2),
      c("ai-4","cat-4","Computer Vision","CSC 347",3,8,2,0,2),
    ],
  },
  {
    id: "cat-5", name: "Cybersecurity", code: "CS", colorKey: "red", maxCredits: 9,
    courses: [
      c("cs-1","cat-5","Information Security","CSC 351",3,5,2,1,1),
      c("cs-2","cat-5","Cryptography","CSC 353",3,6,2,1,0),
      c("cs-3","cat-5","Ethical Hacking","CSC 355",3,7,1,0,3),
    ],
  },
  {
    id: "cat-6", name: "Web & Mobile Dev", code: "WM", colorKey: "yellow", maxCredits: 9,
    courses: [
      c("wm-1","cat-6","Web Development Fundamentals","CSC 161",3,2,1,0,3),
      c("wm-2","cat-6","Advanced Web Development","CSC 361",3,4,1,0,3),
      c("wm-3","cat-6","Mobile App Development","CSC 363",3,6,1,0,3),
    ],
  },
  {
    id: "cat-7", name: "Research & Innovation", code: "RI", colorKey: "navy", maxCredits: 12,
    courses: [
      c("ri-1","cat-7","Research Methodology","CSC 371",3,5,3,1,0),
      c("ri-2","cat-7","Technical Writing","CSC 373",2,6,2,0,0),
      c("ri-3","cat-7","Final Year Project I","CSC 375",4,7,0,0,6),
      c("ri-4","cat-7","Seminar","CSC 377",2,8,0,2,0),
    ],
  },
  {
    id: "cat-8", name: "Electives — Computing", code: "EC", colorKey: "green", maxCredits: 9,
    courses: [
      c("ec-1","cat-8","Game Development","CSC 381",3,4,1,0,3),
      c("ec-2","cat-8","IoT Systems","CSC 383",3,5,2,0,2),
      c("ec-3","cat-8","Blockchain Technology","CSC 385",3,6,2,0,2),
      c("ec-4","cat-8","Quantum Computing Intro","CSC 387",3,8,3,0,0),
    ],
  },
  {
    id: "cat-9", name: "Electives — General", code: "EG", colorKey: "teal", maxCredits: 6,
    courses: [
      c("eg-1","cat-9","Entrepreneurship","GNS 101",2,1,2,0,0),
      c("eg-2","cat-9","Communication Skills II","GNS 201",2,2,2,0,0),
      c("eg-3","cat-9","Peace & Conflict Studies","GNS 301",2,3,2,0,0),
    ],
  },
  {
    id: "cat-10", name: "Industrial Training", code: "IT", colorKey: "gold", maxCredits: 6,
    courses: [
      c("it-1","cat-10","SIWES I","CSC 291",3,4,0,0,6),
      c("it-2","cat-10","SIWES II","CSC 391",3,6,0,0,6),
    ],
  },
  {
    id: "cat-11", name: "Data Science", code: "DS", colorKey: "cyan", maxCredits: 9,
    courses: [
      c("ds-1","cat-11","Data Mining","CSC 401",3,5,2,0,2),
      c("ds-2","cat-11","Data Visualization","CSC 403",3,6,1,1,2),
      c("ds-3","cat-11","Big Data Analytics","CSC 405",3,7,2,0,2),
    ],
  },
  {
    id: "cat-12", name: "Professional Practice", code: "PP", colorKey: "slate", maxCredits: 6,
    courses: [
      c("pp-1","cat-12","IT Law & Ethics","CSC 411",2,7,2,0,0),
      c("pp-2","cat-12","Project Management","CSC 413",2,8,2,0,0),
      c("pp-3","cat-12","Career Development","CSC 415",2,8,1,1,0),
    ],
  },
];
