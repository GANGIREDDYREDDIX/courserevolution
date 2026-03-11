export interface Student {
  id: string;
  name: string;
  firstName: string;
  school: string;
  program: string;
  year: number;
  term: number;
  enrollmentId: string;
}

export const mockStudent: Student = {
  id: "STU-2024-0891",
  name: "Adaeze Okonkwo",
  firstName: "Adaeze",
  school: "Faculty of Computing & Informatics",
  program: "B.Sc Computer Science",
  year: 3,
  term: 2,
  enrollmentId: "CSC/2021/0891",
};
