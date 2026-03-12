import { useState } from "react";
import UploadedDocBadge from "./UploadedDocBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, AlertCircle, CheckCircle2, FileUp } from "lucide-react";

interface AchievementFormProps {
  title: string;
  description: string;
  documentName: string | null;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onDocumentUpload: (file: File) => void;
  onDocumentRemove: () => void;
  isComplete: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const AchievementForm = ({
  title,
  description,
  documentName,
  onTitleChange,
  onDescriptionChange,
  onDocumentUpload,
  onDocumentRemove,
  isComplete,
}: AchievementFormProps) => {
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    setFileError(null);

    if (file.size > MAX_FILE_SIZE) {
      setFileError("File size must be less than 10MB");
      e.currentTarget.value = "";
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError("Please upload a PDF, image, or Word document");
      e.currentTarget.value = "";
      return;
    }

    onDocumentUpload(file);
  };

  const isTitleEmpty = !title.trim();
  const isDescriptionEmpty = !description.trim();
  const isDocumentEmpty = !documentName;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Request Title <span className="text-destructive">*</span>
        </label>
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="e.g. Prior Research Recognition"
          className="w-full h-11 rounded-xl border-border focus:border-primary focus:ring-primary/20"
        />
        {isTitleEmpty && (
          <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Title is required
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Detailed Description <span className="text-destructive">*</span>
        </label>
        <Textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Explain why you qualify for this benefit..."
          rows={4}
          className="w-full resize-none rounded-xl border-border focus:border-primary focus:ring-primary/20"
        />
        {isDescriptionEmpty && (
          <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Description is required
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Supporting Documentation <span className="text-destructive">*</span>
        </label>
        {documentName ? (
          <UploadedDocBadge fileName={documentName} onRemove={onDocumentRemove} />
        ) : (
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/40 hover:bg-primary/[0.02] transition-all duration-200 group">
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary/5 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
              <FileUp className="w-6 h-6 text-primary/60 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              PDF, PNG, JPG (max. 10MB)
            </p>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              className="hidden"
              id="document-upload"
            />
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={() => document.getElementById("document-upload")?.click()}
            >
              <label className="cursor-pointer">Select File</label>
            </Button>
          </div>
        )}
        {fileError && (
          <p className="text-xs text-destructive mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {fileError}
          </p>
        )}
        {isDocumentEmpty && !fileError && (
          <p className="text-xs text-destructive mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Document upload is required
          </p>
        )}
      </div>

      {/* Status banner */}
      <div className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-sm ${
        isComplete
          ? "bg-emerald-50 border-emerald-200/60 text-emerald-700"
          : "bg-primary/[0.03] border-primary/10 text-primary"
      }`}>
        {isComplete ? (
          <CheckCircle2 className="w-4 h-4 shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 shrink-0" />
        )}
        <p className="text-xs font-medium">
          {isComplete
            ? "All fields completed — ready to proceed"
            : "Please fill all required fields to proceed"}
        </p>
      </div>
    </div>
  );
};

export default AchievementForm;
