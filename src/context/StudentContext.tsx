import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { mockStudent, type Student } from "@/data/mockStudent";
import { mockCategories, type Category } from "@/data/mockCategories";
import type { EduRevSelection } from "@/data/eduRevTypes";

export type SelectionStatus = "not_started" | "draft" | "finalized";

export interface CategorySelection {
  selectedCourseIds: string[];
  status: SelectionStatus;
}

interface StudentContextValue {
  student: Student;
  categories: Category[];
  selections: Record<string, CategorySelection>;
  eduRevSelections: Record<string, EduRevSelection>; // courseId -> EduRevSelection
  toggleCourse: (categoryId: string, courseId: string) => void;
  getCreditsUsed: (categoryId: string) => number;
  finalizeCategory: (categoryId: string) => void;
  getStatus: (categoryId: string) => SelectionStatus;
  setEduRevSelection: (courseId: string, eduRevData: EduRevSelection) => void;
  getEduRevSelection: (courseId: string) => EduRevSelection | null;
  updateEduRevSelection: (courseId: string, updates: Partial<EduRevSelection>) => void;
  areAllEduRevSelectionsComplete: (categoryId: string) => boolean;
  deleteEduRevSelection: (courseId: string) => void;
}

const StudentContext = createContext<StudentContextValue | null>(null);

const STORAGE_KEY = "course-mapper-selections";
const EDU_REV_STORAGE_KEY = "course-mapper-edu-rev";

function loadSelections(): Record<string, CategorySelection> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function loadEduRevSelections(): Record<string, EduRevSelection> {
  try {
    const raw = localStorage.getItem(EDU_REV_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selections, setSelections] = useState<Record<string, CategorySelection>>(loadSelections);
  const [eduRevSelections, setEduRevSelections] = useState<Record<string, EduRevSelection>>(loadEduRevSelections);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
  }, [selections]);

  useEffect(() => {
    localStorage.setItem(EDU_REV_STORAGE_KEY, JSON.stringify(eduRevSelections));
  }, [eduRevSelections]);

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
    const current = selections[categoryId] || { selectedCourseIds: [], status: "not_started" };
    const isRemoving = current.selectedCourseIds.includes(courseId);

    setSelections((prev) => {
      const current = prev[categoryId] || { selectedCourseIds: [], status: "not_started" };
      if (current.status === "finalized") return prev;

      const cat = mockCategories.find((c) => c.id === categoryId);
      const isRemoving = current.selectedCourseIds.includes(courseId);

      if (!isRemoving && cat) {
        const course = cat.courses.find((c) => c.id === courseId);
        const currentCredits = cat.courses
          .filter((c) => current.selectedCourseIds.includes(c.id))
          .reduce((sum, c) => sum + c.credits, 0);
        if (course && currentCredits + course.credits > cat.maxCredits) return prev;
      }

      const ids = isRemoving
        ? current.selectedCourseIds.filter((id) => id !== courseId)
        : [...current.selectedCourseIds, courseId];

      return {
        ...prev,
        [categoryId]: { selectedCourseIds: ids, status: ids.length > 0 ? "draft" : "not_started" },
      };
    });

    // If removing a course, also remove its Edu Rev selection
    if (isRemoving) {
      setEduRevSelections((prev) => {
        const { [courseId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const finalizeCategory = (categoryId: string) => {
    setSelections((prev) => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], status: "finalized" },
    }));

    // Finalize all Edu Rev selections for this category
    setEduRevSelections((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((courseId) => {
        if (updated[courseId].categoryId === categoryId) {
          updated[courseId] = { ...updated[courseId], status: "finalized" };
        }
      });
      return updated;
    });
  };

  const getStatus = (categoryId: string): SelectionStatus => getSelection(categoryId).status;

  const setEduRevSelection = (courseId: string, eduRevData: EduRevSelection) => {
    setEduRevSelections((prev) => ({
      ...prev,
      [courseId]: eduRevData,
    }));
  };

  const getEduRevSelection = (courseId: string): EduRevSelection | null => {
    return eduRevSelections[courseId] || null;
  };

  const updateEduRevSelection = (courseId: string, updates: Partial<EduRevSelection>) => {
    setEduRevSelections((prev) => ({
      ...prev,
      [courseId]: { ...prev[courseId], ...updates, updatedAt: new Date().toISOString() },
    }));
  };

  const areAllEduRevSelectionsComplete = (categoryId: string): boolean => {
    const categorySelections = selections[categoryId];
    if (!categorySelections || categorySelections.selectedCourseIds.length === 0) {
      return true;
    }

    return categorySelections.selectedCourseIds.every((courseId) => {
      const eduRev = eduRevSelections[courseId];
      return (
        eduRev &&
        eduRev.optionType &&
        eduRev.achievement &&
        eduRev.achievement.title &&
        eduRev.achievement.description &&
        eduRev.achievement.documentFile
      );
    });
  };

  const deleteEduRevSelection = (courseId: string) => {
    setEduRevSelections((prev) => {
      const { [courseId]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <StudentContext.Provider
      value={{
        student: mockStudent,
        categories: mockCategories,
        selections,
        eduRevSelections,
        toggleCourse,
        getCreditsUsed,
        finalizeCategory,
        getStatus,
        setEduRevSelection,
        getEduRevSelection,
        updateEduRevSelection,
        areAllEduRevSelectionsComplete,
        deleteEduRevSelection,
      }}
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
