export interface Student {
  id: string;
  name: string;
  firstName: string;
  school: string;
  program: string;
  year: number;
  term: number;
  enrollmentId: string;
  avatarUrl?: string;
  cgpa: number;
  marks: number;
}

export type DemoStudentProfileId = "eligible_all" | "eligible_some" | "non_eligible" | "showcase_demo";

export const demoStudents: Record<DemoStudentProfileId, Student> = {
  eligible_all: {
    id: "STU-2024-1011",
    name: "Kavya Reddy",
    firstName: "Kavya",
    school: "School of Computer Science & Engineering",
    program: "B.Tech CSE — Cloud Computing / Engineering Minor (P132)",
    year: 4,
    term: 1,
    enrollmentId: "CSE/2022/1011",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=KavyaReddy&backgroundColor=22c55e&textColor=ffffff",
    cgpa: 9.2,
    marks: 92,
  },
  eligible_some: {
    id: "STU-2024-0891",
    name: "Gangireddy Vishnu Vardhan Reddy",
    firstName: "Vishnu",
    school: "School of Computer Science & Engineering",
    program: "B.Tech CSE — Cloud Computing / Engineering Minor (P132)",
    year: 4,
    term: 1,
    enrollmentId: "CSE/2022/0891",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=GangireddyVishnuVardhanReddy&backgroundColor=ff6b35&textColor=ffffff",
    cgpa: 8.3,
    marks: 78,
  },
  non_eligible: {
    id: "STU-2024-1543",
    name: "Akhil Teja M",
    firstName: "Akhil",
    school: "School of Computer Science & Engineering",
    program: "B.Tech CSE — Engineering Minor (P132)",
    year: 4,
    term: 1,
    enrollmentId: "CSE/2022/1543",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=AkhilTejaM&backgroundColor=64748b&textColor=ffffff",
    cgpa: 6.7,
    marks: 64,
  },
  showcase_demo: {
    id: "STU-2024-2001",
    name: "Ananya Sharma",
    firstName: "Ananya",
    school: "School of Computer Science & Engineering",
    program: "B.Tech CSE — Cloud Computing / Engineering Minor (P132)",
    year: 4,
    term: 1,
    enrollmentId: "CSE/2022/2001",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=AnanyaSharma&backgroundColor=0ea5e9&textColor=ffffff",
    cgpa: 8.9,
    marks: 88,
  },
};

export const mockStudent: Student = demoStudents.eligible_some;

export const getDemoStudentByProfile = (profileId: DemoStudentProfileId): Student => {
  return demoStudents[profileId];
};

export const isValidDemoStudentProfile = (value: string): value is DemoStudentProfileId => {
  return value === "eligible_all" || value === "eligible_some" || value === "non_eligible" || value === "showcase_demo";
};

export const getDemoStudentOptions = () => {
  return [
    {
      id: "eligible_all" as const,
      title: "Eligible (All Packages)",
      subtitle: "Can choose ₹50 / ₹30 / ₹20 tracks",
      cgpa: demoStudents.eligible_all.cgpa,
      marks: demoStudents.eligible_all.marks,
    },
    {
      id: "eligible_some" as const,
      title: "Eligible (Some Packages)",
      subtitle: "Can choose ₹30 / ₹20 tracks",
      cgpa: demoStudents.eligible_some.cgpa,
      marks: demoStudents.eligible_some.marks,
    },
    {
      id: "non_eligible" as const,
      title: "Non-Eligible Student",
      subtitle: "Foundation flow eligible",
      cgpa: demoStudents.non_eligible.cgpa,
      marks: demoStudents.non_eligible.marks,
    },
    {
      id: "showcase_demo" as const,
      title: "Showcase Demo Student",
      subtitle: "Pre-filled progress with faculty-approved outcomes",
      cgpa: demoStudents.showcase_demo.cgpa,
      marks: demoStudents.showcase_demo.marks,
    },
  ];
};
