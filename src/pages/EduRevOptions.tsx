import { useParams, useNavigate } from "react-router-dom";
import { useStudent } from "@/context/StudentContext";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import EduRevOptionCard from "@/components/edurev/EduRevOptionCard";
import AchievementForm from "@/components/edurev/AchievementForm";
import UndertakingModal from "@/components/edurev/UndertakingModal";
import ConsentModal from "@/components/preview/ConsentModal";
import { EDU_REV_OPTIONS, COMPLETED_TERM_ALLOWED_OPTIONS, type EduRevOptionType, type Achievement } from "@/data/eduRevTypes";
import { ChevronLeft, ChevronRight, BookOpen, Info } from "lucide-react";

const EduRevOptionsPage = () => {
  const { id: categoryId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories, selections, getEduRevSelection, setEduRevSelection, finalizeCategory, student } = useStudent();

  const category = categories.find((c) => c.id === categoryId);
  const categorySelection = selections[categoryId];

  const selectedCourseIds = useMemo(
    () => categorySelection?.selectedCourseIds || [],
    [categorySelection?.selectedCourseIds]
  );
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [showUndertaking, setShowUndertaking] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  // Redirect if no courses selected
  useEffect(() => {
    if (!category || selectedCourseIds.length === 0) {
      navigate("/");
    }
  }, [category, selectedCourseIds, navigate]);

  if (!category || selectedCourseIds.length === 0) return null;

  const currentCourseId = selectedCourseIds[currentCourseIndex];
  const currentCourse = category.courses.find((c) => c.id === currentCourseId);
  const studentCurrentTerm = (student.year - 1) * 2 + student.term;
  const isCompletedTermCourse = currentCourse ? currentCourse.term < studentCurrentTerm : false;
  const eduRevData = getEduRevSelection(currentCourseId);

  const optionType = eduRevData?.optionType || null;
  const achievement = eduRevData?.achievement || null;

  // If the saved option is not allowed for this course (e.g. completed-term restriction), treat as unset
  const effectiveOptionType =
    optionType && isCompletedTermCourse && !COMPLETED_TERM_ALLOWED_OPTIONS.includes(optionType)
      ? null
      : optionType;

  const isFormComplete: boolean =
    !!(effectiveOptionType &&
    achievement?.title?.trim() &&
    achievement?.description?.trim() &&
    achievement?.documentFile);

  const handleOptionSelection = (type: EduRevOptionType) => {
    const now = new Date().toISOString();
    setEduRevSelection(currentCourseId, {
      courseId: currentCourseId,
      categoryId: categoryId!,
      optionType: type,
      achievement: achievement || {
        title: "",
        description: "",
        documentFile: null,
        documentName: "",
        uploadedAt: now,
      },
      status: "draft",
      createdAt: eduRevData?.createdAt || now,
      updatedAt: now,
    });
  };

  const handleTitleChange = (title: string) => {
    const now = new Date().toISOString();
    setEduRevSelection(currentCourseId, {
      courseId: currentCourseId,
      categoryId: categoryId!,
      optionType,
      achievement: {
        title,
        description: achievement?.description || "",
        documentFile: achievement?.documentFile || null,
        documentName: achievement?.documentName || "",
        uploadedAt: achievement?.uploadedAt || now,
      },
      status: "draft",
      createdAt: eduRevData?.createdAt || now,
      updatedAt: now,
    });
  };

  const handleDescriptionChange = (description: string) => {
    const now = new Date().toISOString();
    setEduRevSelection(currentCourseId, {
      courseId: currentCourseId,
      categoryId: categoryId!,
      optionType,
      achievement: {
        title: achievement?.title || "",
        description,
        documentFile: achievement?.documentFile || null,
        documentName: achievement?.documentName || "",
        uploadedAt: achievement?.uploadedAt || now,
      },
      status: "draft",
      createdAt: eduRevData?.createdAt || now,
      updatedAt: now,
    });
  };

  const handleDocumentUpload = async (file: File) => {
    const fileData = await convertFileToBase64(file);
    const now = new Date().toISOString();
    setEduRevSelection(currentCourseId, {
      courseId: currentCourseId,
      categoryId: categoryId!,
      optionType,
      achievement: {
        title: achievement?.title || "",
        description: achievement?.description || "",
        documentFile: fileData,
        documentName: file.name,
        uploadedAt: now,
      },
      status: "draft",
      createdAt: eduRevData?.createdAt || now,
      updatedAt: now,
    });
  };

  const handleDocumentRemove = () => {
    const now = new Date().toISOString();
    setEduRevSelection(currentCourseId, {
      courseId: currentCourseId,
      categoryId: categoryId!,
      optionType,
      achievement: {
        title: achievement?.title || "",
        description: achievement?.description || "",
        documentFile: null,
        documentName: "",
        uploadedAt: achievement?.uploadedAt || now,
      },
      status: "draft",
      createdAt: eduRevData?.createdAt || now,
      updatedAt: now,
    });
  };

  const handleNext = () => {
    if (isFormComplete) {
      if (currentCourseIndex < selectedCourseIds.length - 1) {
        setCurrentCourseIndex(currentCourseIndex + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setShowUndertaking(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentCourseIndex > 0) {
      setCurrentCourseIndex(currentCourseIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const progress = ((currentCourseIndex + 1) / selectedCourseIds.length) * 100;

  const nextCourseId = selectedCourseIds[currentCourseIndex + 1];
  const nextCourse = nextCourseId ? category.courses.find((c) => c.id === nextCourseId) : null;

  return (
    <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        {/* Progress card */}
        <div className="bg-card rounded-xl border border-border p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-foreground">
              Course {currentCourseIndex + 1} of {selectedCourseIds.length}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-1.5 mb-3" />
          {nextCourse && (
            <p className="text-xs text-muted-foreground">Next: {nextCourse.name}</p>
          )}
        </div>

        {/* Current course card */}
        <div className="bg-card rounded-xl border border-border p-5 mb-8 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
            <BookOpen className="w-7 h-7 text-primary" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Current Course</span>
            <h2 className="text-lg font-bold text-foreground mt-0.5">{currentCourse?.name}</h2>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              # {currentCourse?.courseCode} · {currentCourse?.yearLabel}
            </p>
          </div>
        </div>

        {/* Benefit Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-1">
            Select Your Edu Revolution Benefit
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Choose the specific advantage you want to apply for this course module.
          </p>
          {isCompletedTermCourse && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-amber-50 text-amber-800 text-sm border border-amber-200 mb-4">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                This course is from a completed term. Only select Edu Rev benefits are available.
              </span>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(Object.entries(EDU_REV_OPTIONS) as Array<[EduRevOptionType, { label: string; description: string; icon: string }]>)
              .filter(([type]) => !isCompletedTermCourse || COMPLETED_TERM_ALLOWED_OPTIONS.includes(type))
              .map(
              ([type, { label, description, icon }]) => (
                <EduRevOptionCard
                  key={type}
                  type={type}
                  label={label}
                  description={description}
                  icon={icon}
                  isSelected={effectiveOptionType === type}
                  onClick={() => handleOptionSelection(type)}
                />
              )
            )}
          </div>
        </div>

        {/* Achievement Form */}
        {effectiveOptionType && (
          <div className="mb-8 bg-card rounded-xl border border-border p-6">
            <h2 className="text-base font-bold text-foreground mb-5">Achievement Details</h2>
            <AchievementForm
              title={achievement?.title || ""}
              description={achievement?.description || ""}
              documentName={achievement?.documentName || null}
              onTitleChange={handleTitleChange}
              onDescriptionChange={handleDescriptionChange}
              onDocumentUpload={handleDocumentUpload}
              onDocumentRemove={handleDocumentRemove}
              isComplete={isFormComplete}
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentCourseIndex === 0}
            className="gap-2 h-10 rounded-lg"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isFormComplete}
            className="gap-2 h-10 rounded-lg"
          >
            {currentCourseIndex === selectedCourseIds.length - 1 ? (
              <>
                Finalize
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Save & Next Course
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {/* Undertaking Modal */}
        <UndertakingModal
          open={showUndertaking}
          onConfirm={() => {
            setShowUndertaking(false);
            setShowConsent(true);
          }}
          onCancel={() => setShowUndertaking(false)}
        />

        {/* Consent / Finalize Modal */}
        <ConsentModal
          open={showConsent}
          onCancel={() => setShowConsent(false)}
          onConfirm={() => {
            finalizeCategory(categoryId!);
            setShowConsent(false);
            navigate("/");
          }}
        />
      </div>
    </div>
  );
};

// Helper function to convert file to base64
function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default EduRevOptionsPage;
