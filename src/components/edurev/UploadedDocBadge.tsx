import { X, FileText } from "lucide-react";

interface UploadedDocBadgeProps {
  fileName: string;
  onRemove: () => void;
}

const UploadedDocBadge = ({ fileName, onRemove }: UploadedDocBadgeProps) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/15 text-sm">
      <FileText className="w-4 h-4 text-primary shrink-0" />
      <span className="text-primary font-medium truncate">{fileName}</span>
      <button
        onClick={onRemove}
        type="button"
        className="p-1 hover:bg-primary/10 rounded transition-colors ml-1"
        aria-label="Remove document"
      >
        <X className="w-3.5 h-3.5 text-primary/60" />
      </button>
    </div>
  );
};

export default UploadedDocBadge;
