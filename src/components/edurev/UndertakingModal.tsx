import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertTriangle, ChevronDown, Shield, FileCheck } from "lucide-react";

interface UndertakingModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const UndertakingModal = ({ open, onConfirm, onCancel }: UndertakingModalProps) => {
  const [accepted, setAccepted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleConfirm = () => {
    if (accepted) {
      onConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Important Undertaking</DialogTitle>
              <DialogDescription className="text-xs">
                Please read carefully before proceeding
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Warning Banner */}
          <div className="flex gap-3 rounded-xl border border-amber-200/60 bg-amber-50 p-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900">
              <strong>Read carefully:</strong> This undertaking is binding and must be acknowledged before submission.
            </p>
          </div>

          {/* Undertaking Content */}
          <div className="space-y-4">
            <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-5">
              <h3 className="font-bold text-foreground mb-3 text-sm">
                I hereby undertake and confirm that:
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  "All information provided in this application is true, accurate, and complete to the best of my knowledge.",
                  "I will submit authentic and verifiable proof/documentation for all claims made in this application.",
                  "I understand that my nomination shall be evaluated by the standing committee.",
                  "I accept that the assessment process may include interviews or additional verification.",
                  "I will comply with all further requirements or clarifications requested during the evaluation process.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Additional Terms */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-between text-sm font-semibold text-foreground hover:bg-secondary/50 p-3.5 rounded-xl transition-colors border border-border/50"
            >
              <span>Legal and Academic Integrity Terms</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              />
            </button>

            {expanded && (
              <div className="rounded-xl border border-border bg-secondary/20 p-5 text-sm text-muted-foreground space-y-2.5">
                <p>
                  • False or misleading information may result in rejection of the application and
                  disciplinary action.
                </p>
                <p>
                  • All submitted documents must be authentic and may be verified with original
                  issuing authorities.
                </p>
                <p>
                  • The institution reserves the right to conduct background checks and verify
                  credentials.
                </p>
                <p>
                  • Decisions made by the committee are final and binding.
                </p>
                <p>
                  • By submitting this application, you consent to our privacy policy and data
                  handling practices.
                </p>
              </div>
            )}
          </div>

          {/* Accepting Checkbox */}
          <div className="flex items-start gap-3 rounded-xl border-2 border-border bg-card p-4 hover:border-primary/30 transition-colors">
            <Checkbox
              id="understand"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked as boolean)}
              className="mt-1"
            />
            <Label
              htmlFor="understand"
              className="text-sm font-medium leading-relaxed cursor-pointer"
            >
              I accept that I have read and understood the above undertaking. I confirm that all
              information provided is accurate and authentic.
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2 flex-row justify-between sm:justify-end mt-2">
          <Button variant="outline" onClick={onCancel} className="rounded-xl h-11">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!accepted}
            className="rounded-xl h-11 bg-gradient-to-r from-primary to-amber-500 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 gap-2"
          >
            <Shield className="w-4 h-4" />
            I Confirm & Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UndertakingModal;
