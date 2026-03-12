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
}

export const mockStudent: Student = {
  id: "STU-2024-0891",
  name: "Gangireddy Vishnu Vardhan Reddy",
  firstName: "Vishnu",
  school: "School of Computer Science & Engineering",
  program: "B.Tech CSE — Cloud Computing / Engineering Minor (P132)",
  year: 4,
  term: 1,
  enrollmentId: "CSE/2022/0891",
  avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=GangireddyVishnuVardhanReddy&backgroundColor=ff6b35&textColor=ffffff",
};
