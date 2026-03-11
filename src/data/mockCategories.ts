export interface Course {
  id: string;
  categoryId: string;
  name: string;
  courseCode: string;
  credits: number;
  year: number;
  term: number;
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

const c = (id: string, catId: string, name: string, code: string, cr: number, y: number, t: number, L: number, T: number, P: number): Course => ({
  id, categoryId: catId, name, courseCode: code, credits: cr, year: y, term: t, L, T, P,
});

export const mockCategories: Category[] = [
  {
    id: "cat-1", name: "Core Computing", code: "CC", colorKey: "purple", maxCredits: 18,
    courses: [
      c("cc-1","cat-1","Data Structures & Algorithms","CSC 301",4,3,1,3,1,2),
      c("cc-2","cat-1","Operating Systems","CSC 303",3,3,1,3,0,1),
      c("cc-3","cat-1","Computer Networks","CSC 305",3,3,1,2,1,1),
      c("cc-4","cat-1","Database Systems II","CSC 307",4,3,2,3,0,2),
      c("cc-5","cat-1","Software Engineering","CSC 309",3,3,2,2,1,1),
      c("cc-6","cat-1","Compiler Design","CSC 311",3,3,2,2,1,1),
    ],
  },
  {
    id: "cat-2", name: "Mathematics & Logic", code: "ML", colorKey: "charcoal", maxCredits: 12,
    courses: [
      c("ml-1","cat-2","Numerical Methods","MTH 301",3,3,1,2,1,0),
      c("ml-2","cat-2","Discrete Mathematics II","MTH 303",3,3,1,3,1,0),
      c("ml-3","cat-2","Linear Algebra II","MTH 305",3,3,2,3,0,0),
      c("ml-4","cat-2","Probability & Statistics","MTH 307",3,3,2,2,1,0),
    ],
  },
  {
    id: "cat-3", name: "Systems & Architecture", code: "SA", colorKey: "blue", maxCredits: 12,
    courses: [
      c("sa-1","cat-3","Microprocessor Systems","CSC 321",3,3,1,2,0,2),
      c("sa-2","cat-3","Embedded Systems","CSC 323",3,3,1,2,0,2),
      c("sa-3","cat-3","Distributed Systems","CSC 325",3,3,2,2,1,1),
      c("sa-4","cat-3","Cloud Computing","CSC 327",3,3,2,2,0,2),
    ],
  },
  {
    id: "cat-4", name: "AI & Machine Learning", code: "AI", colorKey: "orange", maxCredits: 12,
    courses: [
      c("ai-1","cat-4","Artificial Intelligence","CSC 341",3,3,1,2,1,1),
      c("ai-2","cat-4","Machine Learning","CSC 343",4,3,2,2,1,2),
      c("ai-3","cat-4","Natural Language Processing","CSC 345",3,3,2,2,0,2),
      c("ai-4","cat-4","Computer Vision","CSC 347",3,3,2,2,0,2),
    ],
  },
  {
    id: "cat-5", name: "Cybersecurity", code: "CS", colorKey: "red", maxCredits: 9,
    courses: [
      c("cs-1","cat-5","Information Security","CSC 351",3,3,1,2,1,1),
      c("cs-2","cat-5","Cryptography","CSC 353",3,3,1,2,1,0),
      c("cs-3","cat-5","Ethical Hacking","CSC 355",3,3,2,1,0,3),
    ],
  },
  {
    id: "cat-6", name: "Web & Mobile Dev", code: "WM", colorKey: "yellow", maxCredits: 9,
    courses: [
      c("wm-1","cat-6","Advanced Web Development","CSC 361",3,3,1,1,0,3),
      c("wm-2","cat-6","Mobile App Development","CSC 363",3,3,2,1,0,3),
      c("wm-3","cat-6","UI/UX Design","CSC 365",3,3,2,2,0,2),
    ],
  },
  {
    id: "cat-7", name: "Research & Innovation", code: "RI", colorKey: "navy", maxCredits: 12,
    courses: [
      c("ri-1","cat-7","Research Methodology","CSC 371",3,3,1,3,1,0),
      c("ri-2","cat-7","Technical Writing","CSC 373",2,3,1,2,0,0),
      c("ri-3","cat-7","Final Year Project I","CSC 375",4,3,2,0,0,6),
      c("ri-4","cat-7","Seminar","CSC 377",2,3,2,0,2,0),
    ],
  },
  {
    id: "cat-8", name: "Electives — Computing", code: "EC", colorKey: "green", maxCredits: 9,
    courses: [
      c("ec-1","cat-8","Game Development","CSC 381",3,3,1,1,0,3),
      c("ec-2","cat-8","Blockchain Technology","CSC 383",3,3,2,2,0,2),
      c("ec-3","cat-8","IoT Systems","CSC 385",3,3,2,2,0,2),
      c("ec-4","cat-8","Quantum Computing Intro","CSC 387",3,3,2,3,0,0),
    ],
  },
  {
    id: "cat-9", name: "Electives — General", code: "EG", colorKey: "teal", maxCredits: 6,
    courses: [
      c("eg-1","cat-9","Entrepreneurship","GNS 301",2,3,1,2,0,0),
      c("eg-2","cat-9","Communication Skills II","GNS 303",2,3,1,2,0,0),
      c("eg-3","cat-9","Peace & Conflict Studies","GNS 305",2,3,2,2,0,0),
    ],
  },
  {
    id: "cat-10", name: "Industrial Training", code: "IT", colorKey: "gold", maxCredits: 6,
    courses: [
      c("it-1","cat-10","SIWES I","CSC 391",3,3,1,0,0,6),
      c("it-2","cat-10","SIWES II","CSC 393",3,3,2,0,0,6),
    ],
  },
  {
    id: "cat-11", name: "Data Science", code: "DS", colorKey: "cyan", maxCredits: 9,
    courses: [
      c("ds-1","cat-11","Data Mining","CSC 401",3,3,1,2,0,2),
      c("ds-2","cat-11","Big Data Analytics","CSC 403",3,3,2,2,0,2),
      c("ds-3","cat-11","Data Visualization","CSC 405",3,3,2,1,1,2),
    ],
  },
  {
    id: "cat-12", name: "Professional Practice", code: "PP", colorKey: "slate", maxCredits: 6,
    courses: [
      c("pp-1","cat-12","IT Law & Ethics","CSC 411",2,3,1,2,0,0),
      c("pp-2","cat-12","Project Management","CSC 413",2,3,2,2,0,0),
      c("pp-3","cat-12","Career Development","CSC 415",2,3,2,1,1,0),
    ],
  },
];
