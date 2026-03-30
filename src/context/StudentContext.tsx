import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  mockStudent,
  type Student,
  type DemoStudentProfileId,
  getDemoStudentByProfile,
  isValidDemoStudentProfile,
} from "@/data/mockStudent";
import { mockCategories, type Category } from "@/data/mockCategories";
import type { EduRevSelection } from "@/data/eduRevTypes";

export type SelectionStatus = "not_started" | "draft" | "finalized";
export type EduRevPathwayId = "placements" | "entrepreneurship" | "revenue_generation" | "higher_studies" | "govt_exams";
export type EduRevTierId = "tier_50" | "tier_30" | "tier_20";

export interface CategorySelection {
  selectedCourseIds: string[];
  status: SelectionStatus;
}

interface StudentContextValue {
  student: Student;
  selectedDemoProfileId: DemoStudentProfileId | null;
  categories: Category[];
  selections: Record<string, CategorySelection>;
  eduRevSelections: Record<string, EduRevSelection>; // courseId -> EduRevSelection
  hasJoinedEduRev: boolean;
  selectedEduRevPathway: EduRevPathwayId | null;
  selectedEduRevTier: EduRevTierId | null;
  toggleCourse: (categoryId: string, courseId: string) => void;
  setCategorySelectedCourses: (categoryId: string, courseIds: string[]) => void;
  getCreditsUsed: (categoryId: string) => number;
  areAllCategoriesSelected: () => boolean;
  getUnselectedCategoryNames: () => string[];
  finalizeCategory: (categoryId: string) => void;
  getStatus: (categoryId: string) => SelectionStatus;
  setEduRevSelection: (courseId: string, eduRevData: EduRevSelection) => void;
  getEduRevSelection: (courseId: string) => EduRevSelection | null;
  updateEduRevSelection: (courseId: string, updates: Partial<EduRevSelection>) => void;
  areAllEduRevSelectionsComplete: (categoryId: string) => boolean;
  deleteEduRevSelection: (courseId: string) => void;
  setHasJoinedEduRev: (value: boolean) => void;
  setSelectedEduRevPathway: (value: EduRevPathwayId | null) => void;
  setSelectedEduRevTier: (value: EduRevTierId | null) => void;
  setDemoStudentProfile: (profileId: DemoStudentProfileId) => void;
}

const StudentContext = createContext<StudentContextValue | null>(null);

const STORAGE_KEY = "course-mapper-selections";
const EDU_REV_STORAGE_KEY = "course-mapper-edu-rev";
const EDU_REV_JOINED_STORAGE_KEY = "course-mapper-edu-rev-joined";
const EDU_REV_PATHWAY_STORAGE_KEY = "course-mapper-edu-rev-pathway";
const EDU_REV_TIER_STORAGE_KEY = "course-mapper-edu-rev-tier";
const DEMO_PROFILE_STORAGE_KEY = "course-navigator-demo-profile";
const FLOW_INPUTS_STORAGE_KEY = "course-navigator-flow-inputs";

function loadDemoProfile(): DemoStudentProfileId | null {
  try {
    const raw = localStorage.getItem(DEMO_PROFILE_STORAGE_KEY);
    if (!raw) return null;
    return isValidDemoStudentProfile(raw) ? raw : null;
  } catch {
    return null;
  }
}

function normalizeSelections(raw: Record<string, CategorySelection>): Record<string, CategorySelection> {
  const normalized: Record<string, CategorySelection> = { ...raw };

  for (const category of mockCategories) {
    // Mandatory categories are fixed: all courses stay selected.
    if (!category.isElective) {
      const existing = raw[category.id];
      normalized[category.id] = {
        selectedCourseIds: category.courses.map((course) => course.id),
        status: existing?.status === "finalized" ? "finalized" : "draft",
      };
    }
  }

  return normalized;
}

function loadSelections(): Record<string, CategorySelection> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeSelections(JSON.parse(raw));
  } catch {}
  return normalizeSelections({});
}

function loadEduRevSelections(): Record<string, EduRevSelection> {
  try {
    const raw = localStorage.getItem(EDU_REV_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function loadEduRevJoined(): boolean {
  try {
    const raw = localStorage.getItem(EDU_REV_JOINED_STORAGE_KEY);
    if (raw !== null) return raw === "true";
  } catch {}
  return false;
}

function loadEduRevPathway(): EduRevPathwayId | null {
  try {
    const raw = localStorage.getItem(EDU_REV_PATHWAY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = raw as EduRevPathwayId;
    const allowed: EduRevPathwayId[] = ["placements", "entrepreneurship", "revenue_generation", "higher_studies", "govt_exams"];
    return allowed.includes(parsed) ? parsed : null;
  } catch {}
  return null;
}

function loadEduRevTier(): EduRevTierId | null {
  try {
    const raw = localStorage.getItem(EDU_REV_TIER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = raw as EduRevTierId;
    const allowed: EduRevTierId[] = ["tier_50", "tier_30", "tier_20"];
    return allowed.includes(parsed) ? parsed : null;
  } catch {}
  return null;
}

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDemoProfileId, setSelectedDemoProfileId] = useState<DemoStudentProfileId | null>(loadDemoProfile);
  const [student, setStudent] = useState<Student>(() => {
    const saved = loadDemoProfile();
    return saved ? getDemoStudentByProfile(saved) : mockStudent;
  });
  const [selections, setSelections] = useState<Record<string, CategorySelection>>(loadSelections);
  const [eduRevSelections, setEduRevSelections] = useState<Record<string, EduRevSelection>>(loadEduRevSelections);
  const [hasJoinedEduRev, setHasJoinedEduRev] = useState<boolean>(loadEduRevJoined);
  const [selectedEduRevPathway, setSelectedEduRevPathway] = useState<EduRevPathwayId | null>(loadEduRevPathway);
  const [selectedEduRevTier, setSelectedEduRevTier] = useState<EduRevTierId | null>(loadEduRevTier);

  useEffect(() => {
    setSelections((prev) => normalizeSelections(prev));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
  }, [selections]);

  useEffect(() => {
    localStorage.setItem(EDU_REV_STORAGE_KEY, JSON.stringify(eduRevSelections));
  }, [eduRevSelections]);

  useEffect(() => {
    localStorage.setItem(EDU_REV_JOINED_STORAGE_KEY, String(hasJoinedEduRev));
  }, [hasJoinedEduRev]);

  useEffect(() => {
    if (!selectedEduRevPathway) {
      localStorage.removeItem(EDU_REV_PATHWAY_STORAGE_KEY);
      return;
    }
    localStorage.setItem(EDU_REV_PATHWAY_STORAGE_KEY, selectedEduRevPathway);
  }, [selectedEduRevPathway]);

  useEffect(() => {
    if (!selectedEduRevTier) {
      localStorage.removeItem(EDU_REV_TIER_STORAGE_KEY);
      return;
    }
    localStorage.setItem(EDU_REV_TIER_STORAGE_KEY, selectedEduRevTier);
  }, [selectedEduRevTier]);

  const setDemoStudentProfile = (profileId: DemoStudentProfileId) => {
    const nextStudent = getDemoStudentByProfile(profileId);
    setSelectedDemoProfileId(profileId);
    setStudent(nextStudent);
    localStorage.setItem(DEMO_PROFILE_STORAGE_KEY, profileId);
    localStorage.setItem(
      FLOW_INPUTS_STORAGE_KEY,
      JSON.stringify({ cgpa: String(nextStudent.cgpa), marks: String(nextStudent.marks) })
    );
  };

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
      // Mandatory categories are fixed and cannot be changed.
      if (cat && !cat.isElective) return prev;
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

  const setCategorySelectedCourses = (categoryId: string, courseIds: string[]) => {
    const cat = mockCategories.find((c) => c.id === categoryId);
    if (!cat || !cat.isElective) return;

    const validIds = Array.from(new Set(courseIds)).filter((id) =>
      cat.courses.some((course) => course.id === id)
    );

    const credits = cat.courses
      .filter((c) => validIds.includes(c.id))
      .reduce((sum, c) => sum + c.credits, 0);

    if (credits > cat.maxCredits) return;

    setSelections((prev) => {
      const current = prev[categoryId] || { selectedCourseIds: [], status: "not_started" };
      if (current.status === "finalized") return prev;

      return {
        ...prev,
        [categoryId]: {
          selectedCourseIds: validIds,
          status: validIds.length > 0 ? "draft" : "not_started",
        },
      };
    });

    setEduRevSelections((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((courseId) => {
        if (updated[courseId].categoryId === categoryId && !validIds.includes(courseId)) {
          delete updated[courseId];
        }
      });
      return updated;
    });
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

  const areAllCategoriesSelected = () =>
    mockCategories.every((category) => {
      const selected = selections[category.id]?.selectedCourseIds || [];
      return selected.length > 0;
    });

  const getUnselectedCategoryNames = () =>
    mockCategories
      .filter((category) => (selections[category.id]?.selectedCourseIds || []).length === 0)
      .map((category) => category.name);

  return (
    <StudentContext.Provider
      value={{
        student,
        selectedDemoProfileId,
        categories: mockCategories,
        selections,
        eduRevSelections,
        hasJoinedEduRev,
        selectedEduRevPathway,
        selectedEduRevTier,
        toggleCourse,
        setCategorySelectedCourses,
        getCreditsUsed,
        areAllCategoriesSelected,
        getUnselectedCategoryNames,
        finalizeCategory,
        getStatus,
        setEduRevSelection,
        getEduRevSelection,
        updateEduRevSelection,
        areAllEduRevSelectionsComplete,
        deleteEduRevSelection,
        setHasJoinedEduRev,
        setSelectedEduRevPathway,
        setSelectedEduRevTier,
        setDemoStudentProfile,
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
