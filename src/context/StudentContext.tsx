import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { mockStudent, type Student } from "@/data/mockStudent";
import { mockCategories, type Category } from "@/data/mockCategories";

export type SelectionStatus = "not_started" | "draft" | "finalized";

export interface CategorySelection {
  selectedCourseIds: string[];
  status: SelectionStatus;
}

interface StudentContextValue {
  student: Student;
  categories: Category[];
  selections: Record<string, CategorySelection>;
  toggleCourse: (categoryId: string, courseId: string) => void;
  getCreditsUsed: (categoryId: string) => number;
  finalizeCategory: (categoryId: string) => void;
  getStatus: (categoryId: string) => SelectionStatus;
}

const StudentContext = createContext<StudentContextValue | null>(null);

const STORAGE_KEY = "course-mapper-selections";

function loadSelections(): Record<string, CategorySelection> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selections, setSelections] = useState<Record<string, CategorySelection>>(loadSelections);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
  }, [selections]);

  const getSelection = (catId: string): CategorySelection =>
    selections[catId] || { selectedCourseIds: [], status: "not_started" };

  const getCreditsUsed = useCallback((categoryId: string) => {
    const sel = selections[categoryId];
    if (!sel) return 0;
    const cat = mockCategories.find((c) => c.id === categoryId);
    if (!cat) return 0;
    return cat.courses
      .filter((c) => sel.selectedCourseIds.includes(c.id))
      .reduce((sum, c) => sum + c.credits, 0);
  }, [selections]);

  const toggleCourse = (categoryId: string, courseId: string) => {
    setSelections((prev) => {
      const current = prev[categoryId] || { selectedCourseIds: [], status: "not_started" };
      if (current.status === "finalized") return prev;

      const ids = current.selectedCourseIds.includes(courseId)
        ? current.selectedCourseIds.filter((id) => id !== courseId)
        : [...current.selectedCourseIds, courseId];

      return {
        ...prev,
        [categoryId]: { selectedCourseIds: ids, status: ids.length > 0 ? "draft" : "not_started" },
      };
    });
  };

  const finalizeCategory = (categoryId: string) => {
    setSelections((prev) => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], status: "finalized" },
    }));
  };

  const getStatus = (categoryId: string): SelectionStatus => getSelection(categoryId).status;

  return (
    <StudentContext.Provider
      value={{ student: mockStudent, categories: mockCategories, selections, toggleCourse, getCreditsUsed, finalizeCategory, getStatus }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useStudent must be used within StudentProvider");
  return ctx;
};
